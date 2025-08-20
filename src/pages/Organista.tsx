import React, { useState } from "react";

const niveis = [
  "Ensaio",
  "RDJ",
  "RDJ/Culto Oficial",
  "RDJ/Oficializada",
  "Culto Oficial",
  "Oficializada",
];

interface Organista {
  id: number;
  nome: string;
  nivel: string;
}

export default function Organista() {
  const [organistas, setOrganistas] = useState<Organista[]>([]);
  const [novoOrganista, setNovoOrganista] = useState<Organista>({
    id: Date.now(),
    nome: "",
    nivel: "",
  });

  const adicionarOrganista = () => {
    if (!novoOrganista.nome || !novoOrganista.nivel) return;
    setOrganistas([...organistas, { ...novoOrganista, id: Date.now() }]);
    setNovoOrganista({ id: Date.now(), nome: "", nivel: "" });
  };

  const removerOrganista = (id: number) => {
    setOrganistas(organistas.filter((o) => o.id !== id));
  };

  return (
    <div className="w-full bg-neutral-5 p-4 pl-44 pr-44">
      <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Gerenciar Organistas
      </h2>

      {/* Form Adicionar Organista */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6 bg-white shadow-md rounded-xl p-4">
        <input
          type="text"
          placeholder="Nome da organista"
          value={novoOrganista.nome}
          onChange={(e) =>
            setNovoOrganista({ ...novoOrganista, nome: e.target.value })
          }
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={novoOrganista.nivel}
          onChange={(e) =>
            setNovoOrganista({ ...novoOrganista, nivel: e.target.value })
          }
          className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Selecione o nível</option>
          {niveis.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <button
  onClick={adicionarOrganista}
  disabled={!novoOrganista.nome || !novoOrganista.nivel}
  className={`px-6 py-2 rounded-lg text-white transition shadow-md 
    ${
      !novoOrganista.nome || !novoOrganista.nivel
        ? "bg-gray-200 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700 cursor-pointer"
    }`}
>
  + Adicionar Organista
</button>
      </div>

      {/* Lista de Organistas */}
      <div className="space-y-4">
        {organistas.length === 0 ? (
          <p className="text-gray-600 italic">
            Nenhuma organista cadastrada ainda.
          </p>
        ) : (
          organistas.map((o) => (
            <div
              key={o.id}
              className="flex justify-between items-center bg-gray-100 p-4  shadow-sm"
            >
              <span className="font-medium text-gray-800">
                {o.nome} — <span className="text-blue-600">{o.nivel}</span>
              </span>
              <button
                onClick={() => removerOrganista(o.id)}
                className="text-red-600 hover:text-red-800 cursor-pointer"
              >
                Remover
              </button>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
}
