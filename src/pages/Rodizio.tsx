import { useState } from "react";
import { gerarRodizio,  } from "../utils/rodizioGenerator";
import { format } from "date-fns";

export type Nivel =
  | "Ensaio"
  | "RDJ"
  | "RDJ/Culto Oficial"
  | "RDJ/Oficializada"
  | "Culto Oficial"
  | "Oficializada";

export interface Organista {
  id: string;
  nome: string;
  nivel: Nivel;
  cor: string;
}

export interface Configuracao {
  dataInicio: Date;
  dataFim: Date;
  diasCulto: number[]; // 0=domingo ... 6=sábado
}

export default function Rodizio() {
  const [organistas, setOrganistas] = useState<Organista[]>([
    { id: "1", nome: "Maria", nivel: "RDJ/Culto Oficial", cor: "text-red-600" },
    { id: "2", nome: "Ana", nivel: "Culto Oficial", cor: "text-blue-600" },
    { id: "3", nome: "João", nivel: "Ensaio", cor: "text-green-600" },
  ]);

  const [config] = useState<Configuracao>({
    dataInicio: new Date(),
    dataFim: new Date(new Date().setDate(new Date().getDate() + 30)),
    diasCulto: [0, 3, 5], // domingo, quarta e sexta
  });

  const escalas = gerarRodizio(config, organistas);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Rodízio de Organistas</h2>

      <table className="w-full border-collapse bg-white rounded-lg shadow">
  <thead>
    <tr className="bg-gray-100">
      <th className="border p-2">Data</th>
      <th className="border p-2">Dia</th>
      <th className="border p-2">Meia Hora (RDJ)</th>
      <th className="border p-2">Culto (RDJ)</th>
      <th className="border p-2">Meia Hora (Culto)</th>
      <th className="border p-2">Culto (Culto)</th>
    </tr>
  </thead>
  <tbody>
    {escalas.map((escala, idx) => (
      <tr key={idx} className="text-center">
        <td className="border p-2">{format(escala.data, "dd/MM/yyyy")}</td>
        <td className="border p-2">
          {escala.data.toLocaleDateString("pt-BR", { weekday: "long" })}
        </td>
        <td className={`border p-2 ${escala.rdjMeiaHora?.cor || ""}`}>
          {escala.rdjMeiaHora?.nome || "-"}
        </td>
        <td className={`border p-2 ${escala.rdjCulto?.cor || ""}`}>
          {escala.rdjCulto?.nome || "-"}
        </td>
        <td className={`border p-2 ${escala.cultoMeiaHora?.cor || ""}`}>
          {escala.cultoMeiaHora?.nome || "-"}
        </td>
        <td className={`border p-2 ${escala.culto?.cor || ""}`}>
          {escala.culto?.nome || "-"}
        </td>
      </tr>
    ))}
  </tbody>
</table>


      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Resumo</h3>
        <ul>
          {organistas.map((org) => {
            const count = escalas.filter(
              (e) => e.meiaHora?.id === org.id || e.culto?.id === org.id
            ).length;
            return (
              <li key={org.id} className={org.cor}>
                {org.nome}: {count} vezes
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
