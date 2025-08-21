export type Organista = {
  id: string;
  nome: string;
  nivel: string;
  cor: string;
  ocorrencias?: number;
  diasDisponiveis: number[];
  diasSelecionados: number[];
}