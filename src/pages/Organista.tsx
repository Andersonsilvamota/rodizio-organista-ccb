import { useEffect, useState } from "react";

interface Organista {
  id: number;
  nome: string;
  nivel: string;
  cor: string;
}

export default function Organista() {
  const [organistas, setOrganistas] = useState<Organista[]>([]);
  const [novoOrganista, setNovoOrganista] = useState({ nome: "", nivel: "" });

  // 🎨 Paleta de cores para cada organista
  const cores = [
    "#e57373", "#64b5f6", "#81c784", "#ffb74d", "#ba68c8",
    "#4db6ac", "#7986cb", "#f06292", "#9575cd", "#4fc3f7"
  ];

  // 🔹 Carregar do localStorage ao iniciar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem("organistas");
    if (dadosSalvos) {
      setOrganistas(JSON.parse(dadosSalvos));
    }
  }, []);

  // 🔹 Salvar no localStorage sempre que alterar
  useEffect(() => {
    localStorage.setItem("organistas", JSON.stringify(organistas));
  }, [organistas]);

  const adicionarOrganista = () => {
    if (!novoOrganista.nome || !novoOrganista.nivel) return;

    const novaLista = [
      ...organistas,
      {
        id: Date.now(),
        nome: novoOrganista.nome,
        nivel: novoOrganista.nivel,
        cor: cores[organistas.length % cores.length],
      },
    ];
    setOrganistas(novaLista);
    setNovoOrganista({ nome: "", nivel: "" });
  };

  // 🔹 Lista de cultos fixos (exemplo inicial)
  const cultos = [
    { dia: "Domingo", tipo: "Culto Oficial" },
    { dia: "Terça", tipo: "Culto Oficial" },
    { dia: "Quinta", tipo: "Reunião de Jovens" },
  ];

  // 🔹 Função que retorna organistas válidas para um culto
  const organistasValidos = (tipo: string) => {
    return organistas.filter((o) => {
      if (o.nivel === "Ensaio") return false;
      if (o.nivel === "RDJ" && tipo === "Reunião de Jovens") return true;
      if (o.nivel === "RDJ/Culto Oficial" && (tipo === "Reunião de Jovens" || tipo === "Culto Oficial")) return true;
      if (o.nivel === "RDJ/Oficializada") return true;
      if (o.nivel === "Culto Oficial" && tipo === "Culto Oficial") return true;
      if (o.nivel === "Oficializada") return true;
      return false;
    });
  };

  // 🔹 Gerar rodízio respeitando níveis
  const gerarRodizio = () => {
    let index = 0;
    return cultos.map((culto) => {
      const validos = organistasValidos(culto.tipo);
      if (validos.length === 0) {
        return { ...culto, meiaHora: null, cultoOficial: null };
      }

      const meiaHora = validos[index % validos.length];
      index++;
      const cultoOficial = validos[index % validos.length];
      index++;

      return {
        ...culto,
        meiaHora,
        cultoOficial,
      };
    });
  };

  const rodizioPreview = gerarRodizio();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gerenciar Organistas</h2>

      {/* Formulário de adicionar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Nome da organista"
          value={novoOrganista.nome}
          onChange={(e) =>
            setNovoOrganista({ ...novoOrganista, nome: e.target.value })
          }
          className="border rounded-lg px-4 py-2 flex-1"
        />
        <select
          value={novoOrganista.nivel}
          onChange={(e) =>
            setNovoOrganista({ ...novoOrganista, nivel: e.target.value })
          }
          className="border rounded-lg px-4 py-2 flex-1"
        >
          <option value="">Selecione o nível</option>
          <option value="Ensaio">Ensaio</option>
          <option value="RDJ">RDJ</option>
          <option value="RDJ/Culto Oficial">RDJ/Culto Oficial</option>
          <option value="RDJ/Oficializada">RDJ/Oficializada</option>
          <option value="Culto Oficial">Culto Oficial</option>
          <option value="Oficializada">Oficializada</option>
        </select>
        <button
          onClick={adicionarOrganista}
          disabled={!novoOrganista.nome || !novoOrganista.nivel}
          className={`px-6 py-2 rounded-lg text-white transition shadow-md
            ${
              !novoOrganista.nome || !novoOrganista.nivel
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
        >
          + Adicionar Organista
        </button>
      </div>

      {/* Lista de organistas */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Organistas cadastradas</h3>
        {organistas.length === 0 && (
          <p className="text-gray-500">Nenhuma organista cadastrada ainda.</p>
        )}
        <ul className="space-y-2">
          {organistas.map((o) => (
            <li
              key={o.id}
              className="px-4 py-2 rounded-lg shadow-sm border flex justify-between items-center"
              style={{ backgroundColor: o.cor, color: "white" }}
            >
              <span className="font-medium">
                {o.nome} - <i>{o.nivel}</i>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preview do rodízio */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Prévia do Rodízio</h3>
        {rodizioPreview.length === 0 ? (
          <p className="text-gray-500">Cadastre organistas para visualizar o rodízio.</p>
        ) : (
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2">Dia</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Meia Hora</th>
                <th className="p-2">Culto</th>
              </tr>
            </thead>
            <tbody>
              {rodizioPreview.map((c, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2 text-center">{c.dia}</td>
                  <td className="p-2 text-center">{c.tipo}</td>
                  <td
                    className="p-2 text-center font-semibold rounded"
                    style={{
                      backgroundColor: c.meiaHora?.cor || "#e0e0e0",
                      color: c.meiaHora ? "white" : "black",
                    }}
                  >
                    {c.meiaHora ? c.meiaHora.nome : "Sem organista"}
                  </td>
                  <td
                    className="p-2 text-center font-semibold rounded"
                    style={{
                      backgroundColor: c.cultoOficial?.cor || "#e0e0e0",
                      color: c.cultoOficial ? "white" : "black",
                    }}
                  >
                    {c.cultoOficial ? c.cultoOficial.nome : "Sem organista"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
