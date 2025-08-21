import { addDays, isSunday } from "date-fns";

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

type EscalaContagem = Record<string, number>;

function podeTocar(
  organista: Organista,
  tipo: "Culto" | "RDJ",
  meiaHora = false
): boolean {
  const { nivel } = organista;

  if (nivel === "Ensaio") return meiaHora && tipo === "Culto";

  if (nivel === "RDJ") return tipo === "RDJ" || (meiaHora && tipo === "Culto");

  if (nivel === "RDJ/Culto Oficial" || nivel === "RDJ/Oficializada")
    return (tipo === "Culto" && !meiaHora) || tipo === "RDJ";

  if (nivel === "Culto Oficial" || nivel === "Oficializada")
    return tipo === "Culto" && !meiaHora;

  return false;
}

export function gerarRodizio(
  config: Configuracao,
  organistas: Organista[]
): Escala[] {
  const escalas: Escala[] = [];
  const contagem: EscalaContagem = {};
  organistas.forEach((o) => (contagem[o.id] = 0));

  let current = config.dataInicio;

  while (current <= config.dataFim) {
    const day = current.getDay();
    const isRDJ = isSunday(current);
    const isCulto = config.diasCulto.includes(day);

    if (!isRDJ && !isCulto) {
      current = addDays(current, 1);
      continue;
    }

    const escalaAnterior = escalas[escalas.length - 1] ?? null;

    let rdjMeiaHora: Organista | null = null;
    let rdjCulto: Organista | null = null;
    let cultoMeiaHora: Organista | null = null;
    let culto: Organista | null = null;

    // Escolha organistas para RDJ
    if (isRDJ) {
      rdjMeiaHora = escolherOrganista(
        organistas,
        "RDJ",
        contagem,
        escalaAnterior,
        false,
        "RDJ"
      );
      rdjCulto = rdjMeiaHora;
    }

    // Escolha organistas para Culto
    if (isCulto) {
      culto = escolherOrganista(
        organistas,
        "Culto",
        contagem,
        escalaAnterior,
        false,
        "Culto"
      );

      // Meia hora do culto — só pode ser o mesmo do culto oficial ou outro permitido
      const candidatosMeiaHora = organistas.filter((o) => {
        if (
          o.nivel === "Culto Oficial" ||
          o.nivel === "Oficializada" ||
          o.nivel === "RDJ/Culto Oficial" ||
          o.nivel === "RDJ/Oficializada"
        ) {
          return culto?.id === o.id;
        }
        return true;
      });

      cultoMeiaHora = escolherOrganista(
        candidatosMeiaHora,
        "Culto",
        contagem,
        escalaAnterior,
        true,
        "Culto"
      );
    }

    // Atualiza contagem (cada organista conta só 1 por dia, mesmo se tocar em dois horários)
    const organistasDoDia = new Set<string>();
    if (rdjMeiaHora) organistasDoDia.add(rdjMeiaHora.id);
    if (rdjCulto) organistasDoDia.add(rdjCulto.id);
    if (cultoMeiaHora) organistasDoDia.add(cultoMeiaHora.id);
    if (culto) organistasDoDia.add(culto.id);

    organistasDoDia.forEach((id) => {
      contagem[id] = (contagem[id] || 0) + 1;
    });

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

/**
 * @param organistas lista de organistas
 * @param tipo "Culto" | "RDJ"
 * @param contagem contagem de escalas
 * @param escalaAnterior escala do dia anterior
 * @param meiaHora indica se é escala de meia hora
 * @param tipoEscala para bloquear repetição dia a dia por tipo ("Culto" ou "RDJ")
 */
function escolherOrganista(
  organistas: Organista[],
  tipo: "Culto" | "RDJ",
  contagem: EscalaContagem,
  escalaAnterior: Escala | null,
  meiaHora = false,
  tipoEscala: "Culto" | "RDJ"
): Organista | null {
  const candidatos = organistas.filter((o) => {
    // bloqueia quem tocou no mesmo tipo na escala anterior (dia anterior)
    const tocouNoMesmoTipoOntem = escalaAnterior
      ? tipoEscala === "RDJ"
        ? [escalaAnterior.rdjMeiaHora, escalaAnterior.rdjCulto].some(
            (p) => p?.id === o.id
          )
        : [escalaAnterior.cultoMeiaHora, escalaAnterior.culto].some(
            (p) => p?.id === o.id
          )
      : false;

    return podeTocar(o, tipo, meiaHora) && !tocouNoMesmoTipoOntem;
  });

  if (candidatos.length === 0) return null;

  candidatos.sort((a, b) => contagem[a.id] - contagem[b.id]);

  return candidatos[0];
}
