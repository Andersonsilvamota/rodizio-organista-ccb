import React, { useState } from "react";
import { useConfig } from "../context/configContext";
import type { Organista } from "../types/Organista";

type RodizioItem = {
  data: Date;
  diaSemana: string;
  meiaHora: Organista | null;
  culto: Organista | null;
};

const diasSemanaStr = ["DOM","SEG","TER","QUA","QUI","SEX","SÁB"];
const mesesStr = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export default function Rodizio() {
  const { configuracao, organistas } = useConfig();
  const [rodizio, setRodizio] = useState<RodizioItem[]>([]);
  const [editing, setEditing] = useState(false);

  if (!configuracao) return <p>⚠️ Nenhuma configuração salva.</p>;

  const gerarRodizio = () => {
  if (!configuracao) return;

  const items: RodizioItem[] = [];
  const { mesInicio, mesFim, diasCulto } = configuracao;

  const diasCultoNumeros = diasCulto.map(d => d.id); // converte para número
  const current = new Date(mesInicio);

  const organistasCount: Record<string, number> = {};
  organistas.forEach(o => organistasCount[o.id] = 0);

  while (current <= mesFim) {
    const dia = current.getDay();

    if (diasCultoNumeros.includes(dia)) {
      const disponiveis = organistas.filter(o => 
        o.diasSelecionados.some(d => d.dia === dia && (d.qtd === 0 || organistasCount[o.id] < d.qtd))
      );

      const restrito = ["RDJ/Culto Oficial","RDJ/Oficializada","Culto Oficial","Oficializada"];

      const meiaHora = disponiveis.find(o => {
        const jaVaiNoCulto = disponiveis.some(x => x !== o && restrito.includes(x.nivel));
        if (restrito.includes(o.nivel)) return !jaVaiNoCulto;
        return true;
      }) || null;

      const culto = disponiveis.find(o =>
        restrito.includes(o.nivel)
      ) || meiaHora || null;

      if (meiaHora) organistasCount[meiaHora.id] = (organistasCount[meiaHora.id] || 0) + 1;
      if (culto && culto.id !== meiaHora?.id) organistasCount[culto.id] = (organistasCount[culto.id] || 0) + 1;

      items.push({
        data: new Date(current),
        diaSemana: diasSemanaStr[dia],
        meiaHora,
        culto
      });
    }

    current.setDate(current.getDate() + 1);
  }

  setRodizio(items);
};


  const handleEditCell = (id: string, field: "meiaHora" | "culto", value: string) => {
    setRodizio(prev =>
      prev.map(r => {
        if (r.data.toDateString() === id && r[field]) {
          return { ...r, [field]: { ...r[field]!, nome: value } };
        }
        return r;
      })
    );
  };

  // Separar por mês
  const rodizioPorMes = rodizio.reduce((acc, r) => {
    const mes = r.data.getMonth();
    if (!acc[mes]) acc[mes] = [];
    acc[mes].push(r);
    return acc;
  }, {} as Record<number, RodizioItem[]>);

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Rodízio - {configuracao.nomeComum}</h2>

      <button
        onClick={gerarRodizio}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Gerar Rodízio
      </button>

      {Object.entries(rodizioPorMes).map(([mes, items]) => (
        <div key={mes} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{mesesStr[Number(mes)]}</h3>
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Dia</th>
                <th className="px-4 py-2">Meia Hora</th>
                <th className="px-4 py-2">Culto</th>
              </tr>
            </thead>
            <tbody>
              {items.map(r => (
                <tr key={r.data.toDateString()} className="border-t text-center">
                  <td className="px-4 py-2">{r.data.toLocaleDateString()}</td>
                  <td className="px-4 py-2">{r.diaSemana}</td>
                  <td className="px-4 py-2">
                    {editing ? (
                      <input
                        type="text"
                        className={`w-full border px-2 py-1 ${r.meiaHora?.cor}`}
                        value={r.meiaHora?.nome || ""}
                        onChange={e => r.meiaHora && handleEditCell(r.data.toDateString(), "meiaHora", e.target.value)}
                      />
                    ) : (
                      <span className={r.meiaHora?.cor}>{r.meiaHora?.nome}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editing ? (
                      <input
                        type="text"
                        className={`w-full border px-2 py-1 ${r.culto?.cor}`}
                        value={r.culto?.nome || ""}
                        onChange={e => r.culto && handleEditCell(r.data.toDateString(), "culto", e.target.value)}
                      />
                    ) : (
                      <span className={r.culto?.cor}>{r.culto?.nome}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-4">
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {editing ? "Finalizar Edição" : "Editar Rodízio"}
        </button>
      </div>
    </div>
  );
}
