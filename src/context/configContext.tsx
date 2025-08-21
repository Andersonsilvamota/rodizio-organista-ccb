// // src/context/ConfigContext.tsx
// import React, { createContext, useState, useContext } from "react";


// interface Configuracao {
//   dataInicio: Date;
//   dataFim: Date;
//   diasCulto: number[]; // [0=domingo, 1=segunda...]
// }

// export type Nivel =
//   | "Ensaio"
//   | "RDJ"
//   | "RDJ/Culto Oficial"
//   | "RDJ/Oficializada"
//   | "Culto Oficial"
//   | "Oficializada";


// interface Organista {
//   id: string;
//   nome: string;
//   nivel: Nivel;
//   cor: string;
// }

// interface ConfigContextType {
//   configuracao: Configuracao | null;
//   setConfiguracao: (c: Configuracao) => void;
//   organistas: Organista[];
//   setOrganistas: (o: Organista[]) => void;
// }

// const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [configuracao, setConfiguracao] = useState<Configuracao | null>(null);
//   const [organistas, setOrganistas] = useState<Organista[]>([]);

//   return (
//     <ConfigContext.Provider value={{ configuracao, setConfiguracao, organistas, setOrganistas }}>
//       {children}
//     </ConfigContext.Provider>
//   );
// };

// export const useConfig = () => {
//   const ctx = useContext(ConfigContext);
//   if (!ctx) throw new Error("useConfig deve ser usado dentro do ConfigProvider");
//   return ctx;
// };
// src/context/configContext.tsx
import { createContext, useContext, useState } from "react";
import type { Configuracao, Organista } from "../utils/rodizioGenerator";
import { mockConfiguracao, mockOrganistas } from "../mocks/mockData";

interface ConfigContextProps {
  configuracao: Configuracao | null;
  organistas: Organista[];
  setConfiguracao: (config: Configuracao) => void;
  setOrganistas: (orgs: Organista[]) => void;
}

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [configuracao, setConfiguracao] = useState<Configuracao | null>(mockConfiguracao);
  const [organistas, setOrganistas] = useState<Organista[]>(mockOrganistas);

  return (
    <ConfigContext.Provider value={{ configuracao, organistas, setConfiguracao, setOrganistas }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig deve ser usado dentro de um ConfigProvider");
  return context;
};
