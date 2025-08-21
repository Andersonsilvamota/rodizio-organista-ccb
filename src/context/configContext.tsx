import { createContext, useContext, useState } from "react";
import type { Configuracao } from "../types/Configuracao";
import type { Organista } from "../types/Organista";
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
