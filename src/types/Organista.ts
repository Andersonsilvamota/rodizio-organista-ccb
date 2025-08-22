export type DiaSelecionado = {
  dia: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  qtd: number; // quantidade de vezes que a organista deseja tocar neste dia (0 = sem limite)
};

export type Organista = {
  id: string;
  nome: string;
  nivel: 
    | "Ensaio"
    | "RDJ"
    | "RDJ/Culto Oficial"
    | "RDJ/Oficializada"
    | "Culto Oficial"
    | "Oficializada";
  cor: string; // classe de cor para exibir o nome
  diasSelecionados: DiaSelecionado[]; // dias que a organista deseja tocar com quantidade
};
