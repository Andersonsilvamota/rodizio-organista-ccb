export interface Configuracao {
  nomeComum: string;
  diasCulto: { id: number; label: string }[]; // ex: 0=domingo, 3=quarta
  temRDJ: boolean;
  mesInicio: Date;
  mesFim: Date;
}
