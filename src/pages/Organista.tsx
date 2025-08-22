 
import React, { useState } from "react";
import { mockOrganistas, mockDiasCultoConfig } from "../mocks/mockData";
import type { Organista } from '../types/Organista';
import { useConfig } from "../context/configContext";

type DiaSelecionado = { dia: number; qtd: number };

export default function Organista() {
  const [organistas, setOrganistas] = useState<Organista[]>(mockOrganistas);
  const [editingOrganista, setEditingOrganista] = useState<Organista | null>(null);
  const [adding, setAdding] = useState(false);

  const { configuracao } = useConfig();
  const diasCultoConfig = configuracao?.diasCulto ?? mockDiasCultoConfig.map(d => d.id);

  // estados locais para edição/adicionar
  const [nome, setNome] = useState("");
  const [nivel, setNivel] = useState("Ensaio");
  const [diasSelecionados, setDiasSelecionados] = useState<DiaSelecionado[]>([]);

  const [form, setForm] = useState({
    diasSelecionados: []
  });

  const toggleDia = (diaId: number) => {
    if (diasSelecionados.find(d => d.dia === diaId)) {
      setDiasSelecionados(prev => prev.filter(d => d.dia !== diaId));
    } else {
      setDiasSelecionados(prev => [...prev, { dia: diaId, qtd: 0 }]); // qtd = 0 → sem limite
    }
  };

  const updateQtd = (diaId: number, qtd: number) => {
    setDiasSelecionados(prev =>
      prev.map(d => d.dia === diaId ? { ...d, qtd } : d)
    );
  };

  const removeOrganista = (id: string) => {
    setOrganistas(prev => prev.filter(o => o.id !== id));
  };

  const openEditModal = (org: Organista) => {
    setEditingOrganista(org);
    setNome(org.nome);
    setNivel(org.nivel);
    setDiasSelecionados(org.diasSelecionados ?? []);
    setAdding(true);
  };

  const openAddModal = () => {
    setEditingOrganista(null);
    setNome("");
    setNivel("Ensaio");
    setDiasSelecionados([]);
    setAdding(true);
  };

  const saveEdit = () => {
    if (!editingOrganista) return;
    setOrganistas(prev =>
      prev.map(o =>
        o.id === editingOrganista.id
          ? { ...o, nome, nivel, diasSelecionados }
          : o
      )
    );
    setAdding(false);
    setEditingOrganista(null);
  };

  const saveAdd = () => {
    setOrganistas(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        nome,
        nivel,
        cor: "text-gray-600",
        diasSelecionados: diasCultoConfig.map(d => ({ dia: d, qtd: 0 })),
      }
    ]);
    setAdding(false);
  };

  return (
    <div className="mx-auto w-full bg-neutral-5 p-4 pl-44 pr-44">
      <header className="flex justify-between items-center mb-6 pb-5">
        <h2 className="text-2xl font-bold">Lista de Organistas</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          + Adicionar Organista
        </button>
      </header>

      {/* Lista de organistas */}
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="grid grid-cols-4 px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Nível</th>
            <th className="px-4 py-2 text-left">Dias Disponíveis</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {organistas.map(org => (
            <tr key={org.id} className="border-t">
              <td className={`px-4 py-2 font-semibold`}>{org.nome}</td>
              <td className="px-4 py-2 italic">{org.nivel}</td>
              <td className="px-4 py-2">
                {org.diasSelecionados.map(d => {
                  const label = mockDiasCultoConfig.find(m => m.id === d.dia)?.label;
                  return `${label}`;
                }).join(", ")}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => openEditModal(org)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => removeOrganista(org.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
          {organistas.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                Nenhuma organista cadastrada
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {adding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editingOrganista ? "Editar Organista" : "Adicionar Organista"}</h2>

            {/* Nome */}
            <div className="pb-6">
              <label className="block font-medium mb-2 text-gray-700">Nome</label>
              <input
                type="text"
                value={nome}onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition "
                placeholder="Ex: Fulana de Tal"
              />
            </div>
            

            {/* Nível */}
            <div className="pb-6">
              <label className="block font-medium mb-2 text-gray-700">Nível</label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className=" border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              >
                <option value="Ensaio">Ensaio</option>
                <option value="RDJ">RDJ</option>
                <option value="RDJ/Culto Oficial">RDJ/Culto Oficial</option>
                <option value="RDJ/Oficializada">RDJ/Oficializada</option>
                <option value="Culto Oficial">Culto Oficial</option>
                <option value="Oficializada">Oficializada</option>
              </select>

            </div>
            
            {/* Dias Disponíveis */}
            <label className="block mb-2 text-sm font-medium text-gray-700">Dias disponíveis</label>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
              {mockDiasCultoConfig.map((dia) => {
                const selected = diasSelecionados.find(ds => ds.dia === dia.id);
                return (
                  <div key={dia.id} className="flex flex-col items-center gap-1">
                    {/* Caixa do dia */}
                    <div
                      onClick={() => toggleDia(dia.id)}
                      className={`cursor-pointer flex items-center justify-center border px-3 py-2 rounded-lg shadow-sm transition w-16 ${
                        selected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      <span className="font-medium">{dia.label.slice(0, 3).toUpperCase()}</span>
                    </div>

                    {/* Input da quantidade fora da caixa */}
                    {selected && (
                      <input
                        type="number"
                        min={0}
                        value={selected.qtd}
                        onChange={(e) => updateQtd(dia.id, Number(e.target.value))}
                        className="w-14 border rounded text-center text-sm"
                      />
                    )}
                  </div>
                );
              })}
            </div>




            {/* Botões */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setAdding(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={editingOrganista ? saveEdit : saveAdd}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
