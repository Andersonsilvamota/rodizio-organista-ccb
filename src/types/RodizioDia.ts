import type { Organista } from "./Organista";

export interface RodizioDia {
  data: Date;
  diaSemana: [];
  meiaHora: Organista | null;
  culto: Organista | null;
  meiaHoraRDJ: Organista | null;
  rdj: Organista | null;
}