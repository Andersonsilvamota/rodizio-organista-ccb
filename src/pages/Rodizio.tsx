import { useState } from "react";
import { gerarRodizio,  } from "../utils/rodizioGenerator";
import { format } from "date-fns";
import { useConfig } from "../context/configContext";
import Organista from "./Organista";

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
export interface Escala {
  data: Date;
  rdjMeiaHora: Organista | null;
  rdjCulto: Organista | null;
  cultoMeiaHora: Organista | null;
  culto: Organista | null;
}


export interface Configuracao {
  dataInicio: Date;
  dataFim: Date;
  diasCulto: number[]; // 0=domingo ... 6=sábado
}

export default function Rodizio() {
  const { configuracao, organistas } = useConfig();
  
  console.log("configuração", configuracao)

  if (!configuracao) {
    return <div className="flex flex-col items-center p-6 text-red-600">
      <div>⚠ Configure primeiro os dias de culto na aba "Configuração".</div>
    </div>;
  }

  const escalas = gerarRodizio(configuracao, organistas);
  // const [organistas, setOrganistas] = useState<Organista[]>([
    
  //   { id: "1", nome: "Maria", nivel: "RDJ/Culto Oficial", cor: "text-red-600" },
  //   { id: "2", nome: "Ana", nivel: "Culto Oficial", cor: "text-blue-600" },
  //   { id: "3", nome: "João", nivel: "Ensaio", cor: "text-green-600" },
  // ]);

  const [config] = useState<Configuracao>({
    dataInicio: new Date(),
    dataFim: new Date(new Date().setDate(new Date().getDate() + 30)),
    diasCulto: [0, 3, 5], // domingo, quarta e sexta
  });

  

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Rodízio de Organistas</h2>

      <table className="w-full border-collapse bg-white rounded-lg shadow">
  <thead>
    <tr className="bg-gray-100">
      <th className="border border-black p-2">Data</th>
      <th className="border border-black p-2">Dia</th>
      <th className="border border-black p-2">Meia Hora - (RDJ)</th>
      <th className="border border-black p-2">RDJ</th>
      <th className="border border-black p-2">Meia Hora (Culto)</th>
      <th className="border border-black p-2">Culto Oficial</th>
    </tr>
  </thead>
  <tbody>
    {escalas.map((escala, idx) => (
      <tr key={idx} className="text-center">
        <td className="border border-black p-2">{format(escala.data, "dd/MM/yyyy")}</td>
        <td className="border border-black p-2">
          {escala.data.toLocaleDateString("pt-BR", { weekday: "long" })}
        </td>
        <td className="border border-black p-2">
          <span className={escala.rdjMeiaHora?.cor || ""}>
            {escala.rdjMeiaHora?.nome || "-"}
          </span>
        </td>
        <td className="border border-black p-2">
          <span className={escala.rdjCulto?.cor || ""}>
            {escala.rdjCulto?.nome || "-"}
          </span>
        </td>
        <td className="border border-black p-2">
          <span className={escala.cultoMeiaHora?.cor || ""}>
            {escala.cultoMeiaHora?.nome || "-"}
          </span>
        </td>
        <td className="border border-black p-2">
          <span className={escala.culto?.cor || ""}>
            {escala.culto?.nome || "-"}
          </span>
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
