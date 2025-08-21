// __tests__/gerarRodizio.test.ts
import { gerarRodizio, Escala, Nivel, Organista, Configuracao } from "../src/utils/rodizioGenerator";

// Mock da função isSunday e addDays, adapte se estiver dentro do mesmo arquivo
const isSunday = (date: Date) => date.getDay() === 0;
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Se precisar importar podeTocar, escolherOrganista e usá-los, 
// senão assuma que estão internamente usados na gerarRodizio.

describe("gerarRodizio", () => {
  const organistas: Organista[] = [
    { id: "1", nome: "Ana", nivel: "Culto Oficial", cor: "red" },
    { id: "2", nome: "Bruno", nivel: "RDJ", cor: "blue" },
    { id: "3", nome: "Carlos", nivel: "Ensaio", cor: "green" },
    { id: "4", nome: "Diana", nivel: "RDJ/Culto Oficial", cor: "yellow" },
  ];

  const config: Configuracao = {
    dataInicio: new Date("2025-08-17"), // Domingo
    dataFim: new Date("2025-08-23"), // Sábado
    diasCulto: [2, 4], // Terça e Quinta (dias da semana)
  };

  test("não escala organistas em dias sem culto", () => {
    const escalas = gerarRodizio(config, organistas);

    escalas.forEach((escala) => {
      const day = escala.data.getDay();
      if (!config.diasCulto.includes(day) && !isSunday(escala.data)) {
        expect(escala.culto).toBeNull();
        expect(escala.cultoMeiaHora).toBeNull();
      }
    });
  });

  test("não repete organista em dias consecutivos", () => {
    const escalas = gerarRodizio(config, organistas);

    for (let i = 1; i < escalas.length; i++) {
      const ontem = escalas[i - 1];
      const hoje = escalas[i];

      const ontemIds = [
        ontem.rdjMeiaHora?.id,
        ontem.rdjCulto?.id,
        ontem.cultoMeiaHora?.id,
        ontem.culto?.id,
      ].filter(Boolean);

      const hojeIds = [
        hoje.rdjMeiaHora?.id,
        hoje.rdjCulto?.id,
        hoje.cultoMeiaHora?.id,
        hoje.culto?.id,
      ].filter(Boolean);

      hojeIds.forEach((id) => {
        expect(ontemIds).not.toContain(id);
      });
    }
  });

  test("escalas RDJ no domingo", () => {
    const escalas = gerarRodizio(config, organistas);

    const domingo = escalas.find((e) => e.data.getDay() === 0);
    expect(domingo?.rdjCulto).toBeDefined();
    expect(domingo?.rdjMeiaHora).toBeDefined();
  });

  test("organistas nível Ensaio só tocam meia hora no culto", () => {
    const escalas = gerarRodizio(config, organistas);

    escalas.forEach((escala) => {
      if (escala.cultoMeiaHora?.nivel === "Ensaio") {
        expect(escala.cultoMeiaHora).toBeDefined();
      }
    });
  });

  test("culto oficial não toca meia hora exceto no dia de culto oficial", () => {
    const escalas = gerarRodizio(config, organistas);

    escalas.forEach((escala) => {
      const nivelMeiaHora = escala.cultoMeiaHora?.nivel ?? "";
      const nivelCulto = escala.culto?.nivel ?? "";

      const niveisRestritos = [
        "Culto Oficial",
        "Oficializada",
        "RDJ/Culto Oficial",
        "RDJ/Oficializada",
      ];

      if (niveisRestritos.includes(nivelMeiaHora)) {
        const isDiaCulto = config.diasCulto.includes(escala.data.getDay());
        if (!isDiaCulto) {
          expect(escala.cultoMeiaHora).toBeNull();
        }
      }

      // Culto oficial no dia deve estar presente
      if (niveisRestritos.includes(nivelCulto)) {
        expect(config.diasCulto).toContain(escala.data.getDay());
      }
    });
  });
});
