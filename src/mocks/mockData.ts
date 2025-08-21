// src/mocks/mockData.ts

import type { Configuracao, Organista } from "../utils/rodizioGenerator";

export const mockOrganistas: Organista[] = [
  { id: "1", nome: "Raiany", nivel: "Ensaio", cor: "text-red-600" },
  { id: "2", nome: "Larisse", nivel: "RDJ", cor: "text-blue-600" },
  { id: "3", nome: "Rebeca", nivel: "RDJ", cor: "text-green-600" },
  { id: "4", nome: "Rute", nivel: "RDJ/Oficializada", cor: "text-yellow-600" },
  { id: "5", nome: "Laiany", nivel: "Oficializada", cor: "text-purple-600" },
  { id: "6", nome: "Victória", nivel: "Oficializada", cor: "text-pink-600" },
  { id: "7", nome: "Érica", nivel: "Oficializada", cor: "text-gray-600" },
];

export const mockConfiguracao: Configuracao = {
  dataInicio: new Date("2025-08-01"),
  dataFim: new Date("2025-09-30"),
  diasCulto: [0, 3], // Domingo, Quarta
};
