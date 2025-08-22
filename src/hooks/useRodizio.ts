import { useConfig } from "../context/configContext";
import { useState, useEffect } from "react";
import type { Organista } from "../utils/rodizioGenerator";

type RodizioItem = {
  data: Date;
  diaSemana: string;
  meiaHora?: Organista;
  culto?: Organista;
  meiaHoraRDJ?: Organista;
  rdj?: Organista;
};

export const useRodizio = () => {
  const { configuracao, organistas } = useConfig();
  const [rodizio, setRodizio] = useState<RodizioItem[]>([]);

  const selecionarOrganista = (
    disponiveis: Organista[],
    rodizioContagem: Record<string, number>
  ): Organista | null => {
    const candidatos = disponiveis.filter(
      (o) => (rodizioContagem[o.id] ?? 0) < (o.ocorrencias ?? 1)
    );
    if (candidatos.length === 0) return disponiveis[0] ?? null;
    candidatos.sort((a, b) => (rodizioContagem[a.id] ?? 0) - (rodizioContagem[b.id] ?? 0));
    return candidatos[0];
  };

  useEffect(() => {
    if (!configuracao) return;
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const rodizioContagem: Record<string, number> = {};
    const resultado: RodizioItem[] = [];
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesInicio = configuracao.mesInicio - 1;
    const mesFim = configuracao.mesFim - 1;

    for (let m = mesInicio; m <= mesFim; m++) {
      const diasNoMes = new Date(anoAtual, m + 1, 0).getDate();
      for (let d = 1; d <= diasNoMes; d++) {
        const data = new Date(anoAtual, m, d);
        const diaSemana = data.getDay();
        if (!configuracao.diasCulto.some((dc) => dc.id === diaSemana)) continue;

        // RDJ sempre domingo
        let meiaHoraRDJ: Organista | undefined;
        let rdj: Organista | undefined;
        if (configuracao.temRDJ && diaSemana === 0) {
          const disponiveisRDJ = organistas.filter((o) =>
            ["RDJ", "RDJ/Culto Oficial", "RDJ/Oficializada"].includes(o.nivel)
          );
          meiaHoraRDJ = selecionarOrganista(disponiveisRDJ, rodizioContagem);
          rdj = meiaHoraRDJ;
          if (meiaHoraRDJ) rodizioContagem[meiaHoraRDJ.id] = (rodizioContagem[meiaHoraRDJ.id] ?? 0) + 1;
        }

        // Culto
        const disponiveisCulto = organistas.filter((o) =>
          ["RDJ/Culto Oficial", "RDJ/Oficializada", "Culto Oficial", "Oficializada"].includes(o.nivel)
        );
        const meiaHora = selecionarOrganista(disponiveisCulto, rodizioContagem);
        const culto = selecionarOrganista(disponiveisCulto, rodizioContagem);
        if (meiaHora) rodizioContagem[meiaHora.id] = (rodizioContagem[meiaHora.id] ?? 0) + 1;
        if (culto) rodizioContagem[culto.id] = (rodizioContagem[culto.id] ?? 0) + 1;

        resultado.push({ data, diaSemana: diasSemana[diaSemana], meiaHora, culto, meiaHoraRDJ, rdj });
      }
    }

    setRodizio(resultado);
  }, [configuracao, organistas]);

  return rodizio;
};
