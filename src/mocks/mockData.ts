// src/mocks/mockData.ts

import type { Configuracao } from "../types/Configuracao";
import type { Organista } from "../types/Organista";

export const mockOrganistas: Organista[] = [
  {
    id: crypto.randomUUID(), nome: "Raiany", nivel: "Ensaio", cor: "text-red-600", diasDisponiveis: [3], diasSelecionados: [0, 3],
    ocorrencias: undefined
  },
  {
    id: crypto.randomUUID(), nome: "Larisse", nivel: "RDJ", cor: "text-blue-600", diasDisponiveis: [3], diasSelecionados: [0],
    ocorrencias: undefined
  },
  {
    id: crypto.randomUUID(), nome: "Rebeca", nivel: "RDJ", cor: "text-green-600", diasDisponiveis: [3], diasSelecionados: [3],
    ocorrencias: undefined
  },
  {
    id: crypto.randomUUID(), nome: "Rute", nivel: "RDJ/Oficializada", cor: "text-yellow-600", diasDisponiveis: [3], diasSelecionados: [3],
    ocorrencias: undefined
  },
  {
    id: crypto.randomUUID(), nome: "Laiany", nivel: "Oficializada", cor: "text-purple-600", diasDisponiveis: [3], diasSelecionados: [0, 3],
    ocorrencias: undefined
  },
  {
    id: crypto.randomUUID(), nome: "Victória", nivel: "Oficializada", cor: "text-pink-600", diasDisponiveis: [3], diasSelecionados: [0, 3],
    ocorrencias: undefined
  },
  {
    id: crypto.randomUUID(), nome: "Érica", nivel: "Oficializada", cor: "text-gray-600", diasDisponiveis: [3], diasSelecionados: [0, 3],
    ocorrencias: undefined
  },
];

export const mockConfiguracao: Configuracao = {
  nomeComum: "Icó Central",
  mesInicio: new Date("2025-09-01"),
  mesFim: new Date("2025-09-30"),
  diasCulto: [{id:0, label:"Domingo"}], // Domingo, Quarta
  temRDJ: true
};

export const mockDiasCultoConfig = [
  { id: 0, label: "Domingo" },
  { id: 3, label: "Quarta" }
]
