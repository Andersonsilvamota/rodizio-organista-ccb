import './App.css'

import React, { useState } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths } from "date-fns";

type Nivel =
| "Ensaio"
| "RDJ"
| "RDJ/Culto Oficial"
| "RDJ/Oficializada"
| "Culto oficial"
| "Oficializada";

interface Organista {
  id: string;
  nome: string;
  nivel: Nivel;
  corHex: string;
}

interface Configuracao {
  nomeComum: string;
  diasCulto: Array<number>; // 0=Dom, 1=Seg...
  temRDJ: boolean;
  mesInicial: string; // YYYY-MM
  mesFinal: string;   // YYYY-MM
}

interface Escala {
  data: string;
  weekday: string;
  meiaHoraCulto?: string;
  culto?: string;
  meiaHoraRDJ?: string;
  rdj?: string;
}

const niveis: Nivel[] = [
  "Ensaio",
  "RDJ",
  "RDJ/Culto Oficial",
  "RDJ/Oficializada",
  "Culto oficial",
  "Oficializada",
];

// Helper: gerar cor fixa para pessoa
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h},70%,70%)`;
}

// Regras de elegibilidade
function podeMeiaHora(n: Nivel) {
  return true;
}
function podeCulto(n: Nivel) {
  return ["RDJ/Culto Oficial", "RDJ/Oficializada", "Culto oficial", "Oficializada"].includes(n);
}
function podeRDJ(n: Nivel) {
  return ["RDJ", "RDJ/Culto Oficial", "RDJ/Oficializada"].includes(n);
}

// Função round-robin
function escolherProximo(
  candidatos: Organista[],
  contador: Record<string, number>
): Organista | null {
  if (candidatos.length === 0) return null;
  // Ordenar por menor ocorrência
  const ordenados = [...candidatos].sort(
    (a, b) => (contador[a.id] || 0) - (contador[b.id] || 0)
  );
  return ordenados[0];
}

export default function App() {
  const [config, setConfig] = useState<Configuracao>({
    nomeComum: "",
    diasCulto: [0, 3, 5], // Exemplo: Dom, Qua, Sex
    temRDJ: true,
    mesInicial: "2025-09",
    mesFinal: "2025-10",
  });

  const [organistas, setOrganistas] = useState<Organista[]>([
    { id: "1", nome: "Ana", nivel: "Ensaio", corHex: stringToColor("Ana") },
    { id: "2", nome: "Bruna", nivel: "RDJ", corHex: stringToColor("Bruna") },
    { id: "3", nome: "Carla", nivel: "Culto oficial", corHex: stringToColor("Carla") },
    { id: "4", nome: "Daniela", nivel: "Oficializada", corHex: stringToColor("Daniela") },
  ]);

  const [rodizio, setRodizio] = useState<Escala[]>([]);

  function gerarRodizio() {
    const [anoIni, mesIni] = config.mesInicial.split("-").map(Number);
    const [anoFim, mesFim] = config.mesFinal.split("-").map(Number);

    let datas: Date[] = [];
    let cursor = new Date(anoIni, mesIni - 1, 1);
    const fim = new Date(anoFim, mesFim - 1, 1);

    while (cursor <= fim) {
      const diasMes = eachDayOfInterval({
        start: startOfMonth(cursor),
        end: endOfMonth(cursor),
      }).filter((d) => config.diasCulto.includes(d.getDay()));
      datas = datas.concat(diasMes);
      cursor = addMonths(cursor, 1);
    }

    const contador: Record<string, number> = {};
    const result: Escala[] = [];

    for (const d of datas) {
      const dataStr = format(d, "dd/MM/yyyy");
      const weekday = format(d, "EEE", { locale: undefined });

      // Meia Hora culto
      const meiaHoraCands = organistas.filter((o) => podeMeiaHora(o.nivel));
      const meiaHoraOrg = escolherProximo(meiaHoraCands, contador);
      if (meiaHoraOrg) contador[meiaHoraOrg.id] = (contador[meiaHoraOrg.id] || 0) + 1;

      // Culto
      const cultoCands = organistas.filter((o) => podeCulto(o.nivel));
      const cultoOrg = escolherProximo(cultoCands, contador);
      if (cultoOrg) contador[cultoOrg.id] = (contador[cultoOrg.id] || 0) + 1;

      // RDJ (se houver)
      let meiaHoraRDJ: Organista | null = null;
      let rdjOrg: Organista | null = null;
      if (config.temRDJ) {
        const meiaHoraRdjCands = organistas.filter((o) => podeMeiaHora(o.nivel));
        meiaHoraRDJ = escolherProximo(meiaHoraRdjCands, contador);
        if (meiaHoraRDJ) contador[meiaHoraRDJ.id] = (contador[meiaHoraRDJ.id] || 0) + 1;

        const rdjCands = organistas.filter((o) => podeRDJ(o.nivel));
        rdjOrg = meiaHoraRDJ && podeRDJ(meiaHoraRDJ.nivel) ? meiaHoraRDJ : escolherProximo(rdjCands, contador);
        if (rdjOrg) contador[rdjOrg.id] = (contador[rdjOrg.id] || 0) + 1;
      }

      result.push({
        data: dataStr,
        weekday,
        meiaHoraCulto: meiaHoraOrg?.nome,
        culto: cultoOrg?.nome,
        meiaHoraRDJ: meiaHoraRDJ?.nome,
        rdj: rdjOrg?.nome,
      });
    }

    setRodizio(result);
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Rodízio de Organistas – {config.nomeComum || "___"}
      </h1>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
        onClick={gerarRodizio}
      >
        Gerar Rodízio
      </button>

      {rodizio.length > 0 && (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th>Data</th>
              <th>Dia</th>
              <th>Meia Hora</th>
              <th>Culto</th>
              {config.temRDJ && <th>Meia Hora RDJ</th>}
              {config.temRDJ && <th>RDJ</th>}
            </tr>
          </thead>
          <tbody>
            {rodizio.map((r, i) => (
              <tr key={i} className="border-b">
                <td>{r.data}</td>
                <td>{r.weekday}</td>
                <td style={{ color: stringToColor(r.meiaHoraCulto || "") }}>
                  {r.meiaHoraCulto}
                </td>
                <td style={{ color: stringToColor(r.culto || "") }}>
                  {r.culto}
                </td>
                {config.temRDJ && (
                  <>
                    <td style={{ color: stringToColor(r.meiaHoraRDJ || "") }}>
                      {r.meiaHoraRDJ}
                    </td>
                    <td style={{ color: stringToColor(r.rdj || "") }}>
                      {r.rdj}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
