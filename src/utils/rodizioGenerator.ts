import { addDays, format, isSunday } from "date-fns";

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

export interface Escala {
  data: Date;
  rdjMeiaHora: Organista | null;
  rdjCulto: Organista | null;
  cultoMeiaHora: Organista | null;
  culto: Organista | null;
}


function podeTocar(organista: Organista, tipo: "Culto" | "RDJ", meiaHora = false) {
  const { nivel } = organista;

  if (nivel === "Ensaio") return meiaHora && tipo === "Culto";
  if (nivel === "RDJ") return tipo === "RDJ" || (meiaHora && tipo === "Culto");
  if (nivel === "RDJ/Culto Oficial" || nivel === "RDJ/Oficializada") return true;
  if (nivel === "Culto Oficial" || nivel === "Oficializada")
    return tipo === "Culto" || (meiaHora && tipo === "Culto");

  return false;
}

export function gerarRodizio(config: Configuracao, organistas: Organista[]): Escala[] {
  const escalas: Escala[] = [];
  let current = config.dataInicio;

  while (current <= config.dataFim) {
    const day = current.getDay();

    let rdjMeiaHora: Organista | null = null;
    let rdjCulto: Organista | null = null;
    let cultoMeiaHora: Organista | null = null;
    let culto: Organista | null = null;

    // RDJ (domingo de manhã)
    if (isSunday(current)) {
      const organistaRDJ = escolherOrganista(organistas, "RDJ");
      rdjMeiaHora = organistaRDJ;
      rdjCulto = organistaRDJ;
    }

    // Culto (qualquer dia configurado)
    if (config.diasCulto.includes(day)) {
      cultoMeiaHora = escolherOrganista(organistas, "Culto", true);
      culto = escolherOrganista(organistas, "Culto");
      if (!culto && cultoMeiaHora) culto = cultoMeiaHora;
    }

    escalas.push({
      data: current,
      rdjMeiaHora,
      rdjCulto,
      cultoMeiaHora,
      culto,
    });

    current = addDays(current, 1);
  }

  return escalas;
}


let indexRodizio = 0;
function escolherOrganista(
  organistas: Organista[],
  tipo: "Culto" | "RDJ",
  meiaHora = false
): Organista | null {
  if (organistas.length === 0) return null;

  for (let i = 0; i < organistas.length; i++) {
    const idx = (indexRodizio + i) % organistas.length;
    const candidato = organistas[idx];
    if (podeTocar(candidato, tipo, meiaHora)) {
      indexRodizio = idx + 1;
      return candidato;
    }
  }

  return organistas[0]; // fallback se não tiver ninguém
}
