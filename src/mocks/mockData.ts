import type { Configuracao } from "../types/Configuracao";
import type { Organista } from "../types/Organista";

export const mockOrganistas: Organista[] = [
  {
    id: crypto.randomUUID(),
    nome: "Raiany",
    nivel: "Ensaio",
    cor: "text-red-600",
    diasSelecionados: [
      { dia: 3, qtd: 0 }, // Quarta, sem limite
      { dia: 0, qtd: 0 } // domingo, sem limite
    ]
  },
  {
    id: crypto.randomUUID(),
    nome: "Larisse",
    nivel: "RDJ",
    cor: "text-blue-600",
    diasSelecionados: [
      { dia: 0, qtd: 0 } // Domingo, sem limite
    ]
  },
  {
    id: crypto.randomUUID(),
    nome: "Rebeca",
    nivel: "RDJ",
    cor: "text-green-600",
    diasSelecionados: [
      { dia: 3, qtd: 0 } // Quarta, sem limite
    ]
  },
  {
    id: crypto.randomUUID(),
    nome: "Rute",
    nivel: "RDJ/Oficializada",
    cor: "text-yellow-600",
    diasSelecionados: [
      { dia: 3, qtd: 1 } // Quarta, 1 vez
    ]
  },
  {
    id: crypto.randomUUID(),
    nome: "Laiany",
    nivel: "Oficializada",
    cor: "text-purple-600",
    diasSelecionados: [
      { dia: 0, qtd: 0 }, // Domingo, sem limite
      { dia: 3, qtd: 0 }  // Quarta, sem limite
    ]
  },
  {
    id: crypto.randomUUID(),
    nome: "Victória",
    nivel: "Oficializada",
    cor: "text-pink-600",
    diasSelecionados: [
      { dia: 0, qtd: 0 }, // Domingo, sem limite
      { dia: 3, qtd: 0 }  // Quarta, sem limite
    ]
  },
  {
    id: crypto.randomUUID(),
    nome: "Érica",
    nivel: "Oficializada",
    cor: "text-gray-600",
    diasSelecionados: [
      { dia: 0, qtd: 1 }, // Domingo, 1 vez
      { dia: 3, qtd: 1 }  // Quarta, 1 vezes
    ]
  },
];


export const mockConfiguracao: Configuracao = {
  nomeComum: "Icó Central",
  mesInicio: new Date("2025-09-01"),
  mesFim: new Date("2025-09-30"),
  diasCulto: [0, 3], // Domingo e Quarta
  temRDJ: true
};

export const mockDiasCultoConfig = [
  { id: 0, label: "Domingo" },
  { id: 3, label: "Quarta" }
];
