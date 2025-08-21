import React, { useEffect, useState } from "react";
import { mockConfiguracao, mockDiasCultoConfig, mockOrganistas } from "../mocks/mockData";
import type { Organista } from '../types/Organista';
import type { Configuracao } from "../types/Configuracao";
import { useConfig } from "../context/configContext";


export default function Organista(){
  const [organistas, setOrganistas] = useState<Organista[]>(mockOrganistas)
  const [editingOrganista, setEditingOrganista] = useState<Organista | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editNivel, setEditNivel] = useState("");
  const [adding, setAdding] = useState(false);
  const [diasCultoConfig, setDiasCultoConfig] = useState(mockDiasCultoConfig)
  // estados locais para edição/adicionar
  const [nome, setNome] = useState("");
  const [nivel, setNivel] = useState("Ensaio");
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([]);
  const [ocorrencias, setOcorrencias] = useState(1);
  const { configuracao } = useConfig();
  const diasCulto = configuracao?.diasCulto ?? [];
  const hasRDJ = configuracao?.temRDJ ?? false;

  const removeOrganista = (id: string | number) => {
    setOrganistas(prev => prev.filter(o => String(o.id) !== String(id)));
  };

  const openEditModal = (org: Organista) => {
    setEditingOrganista(org);
    setNome(org.nome);
    setNivel(org.nivel);
    setDiasSelecionados(org.diasSelecionados);
    setOcorrencias(org.ocorrencias ?? 1);
    console.log("openEditModal", org)
  };


  const openAddModal = () => {
    setAdding(true);
    setNome("");
    setNivel("Ensaio");
    setDiasSelecionados([]);
    setOcorrencias(1);
  };
  console.log("organistas",organistas)
  const toggleDia = (dia: number) => {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };


  const saveEdit = () => {
    if (!editingOrganista) return;
    setOrganistas((prev) =>
      prev.map((o) =>
        o.id === editingOrganista.id
          ? {
              ...o,
              nome,
              nivel,
              diasSelecionados,
              ocorrencias,
            }
          : o
      )
    );
    setEditingOrganista(null);
  };
  const saveAdd = () => {
    setOrganistas((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        nome,
        nivel,
        cor: "text-gray-600",
        diasDisponiveis: diasCultoConfig.map((d) => d.id),
        diasSelecionados,
        ocorrencias,
      },
    ]);
    setAdding(false);
  };

  return (
    <div className="mx-auto w-full bg-neutral-5 p-4 pl-44 pr-44">
      <header className="flex justify-between items-center mb-6 pb-5">
        <h2 className="text-2xl font-bold">Lista de Organistas</h2>

        <button
        onClick={() => openAddModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          + Adicionar Organista
        </button>
      </header>
      {/* listagem de organistas*/}
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
         <thead className="bg-gray-100">
           <tr>
             <th className="grid grid-cols-4 gap-4 px-4 py-2 text-left">Nome</th>
             <th className="px-4 py-2 text-left">Nível</th>
             <th className="px-4 py-2 text-left">Ocorrências</th>
           </tr>
         </thead>
         <tbody>
           {organistas.map((org) => (
             <tr key={org.id} className="border-t">
               <td className="px-4 py-2">{org.nome}</td>
               <td className="px-4 py-2">{org.nivel}</td>
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
               <td colSpan={5} className="text-center py-4 text-gray-500">
                 Nenhuma organista cadastrado
               </td>
             </tr>
           )}
         </tbody>
       </table>
      
      

      {/* Modal de Edição */}
      {(editingOrganista || adding) && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-300 bg-opacity-75">
          
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">{editingOrganista ? "Editar Organista" : "Adicionar Organista"}</h2>

            <label className="block mb-2 text-sm font-medium">Nome</label>
            <input
              type="text"
              value={nome ||editNome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            <label className="block mb-2 text-sm font-medium">Nível</label>
            <select
              value={nivel || editNivel}
              onChange={(e) => setNivel(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              
              <option value="Ensaio">Ensaio</option>
              <option value="RDJ">RDJ</option>
              <option value="RDJ/Culto Oficial">RDJ/Culto Oficial</option>
              <option value="RDJ/Oficializada">RDJ/Oficializada</option>
              <option value="Culto Oficial">Culto Oficial</option>
              <option value="Oficializada">Oficializada</option>
            </select>
            <label className="block mb-2 text-sm font-medium">Dias</label>
            <div className="mb-4 space-y-2">
              {diasCultoConfig.map((dia) => (
                <label key={dia.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={diasSelecionados.includes(dia.id)}
                    onChange={() => toggleDia(dia.id)}
                  />
                  <span>{dia.label}</span>
                </label>
              ))}
            </div>

            <label className="block mb-2 text-sm font-medium">
              Ocorrências/mês
            </label>
            <input
              type="number"
              min={0}
              value={ocorrencias}
              onChange={(e) => setOcorrencias(Number(e.target.value))}
              className="w-full p-2 border rounded mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditingOrganista(null);
                  setAdding(false);
                }}
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

// const niveis = [
//   "Ensaio",
//   "RDJ",
//   "RDJ/Culto Oficial",
//   "RDJ/Oficializada",
//   "Culto Oficial",
//   "Oficializada",
// ];

// const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

//   const Organistas: React.FC<{ configuracao: { diasCulto: string[]; temRDJ: boolean } }> = ({ configuracao }) => {
//   const [organistas, setOrganistas] = useState<Organista[]>([]);
//   const [open, setOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [nome, setNome] = useState("");
//   const [nivel, setNivel] = useState("");
//   const [ocorrencias, setOcorrencias] = useState(1);
//   const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
//   const [form, setForm] = useState({
//     nome: "",
//     nivel: "",
//     ocorrencias: 1,
//     diasSelecionados: [] as string[],
//   })
//   const [editId, setEditId] = useState<number | null>(null)
//   const mockConfig = mockConfiguracao;
//   const mockOrg = mockOrganistas;
  

//   useEffect(() => {
//     setOrganistas(mockOrg as Organista[]);
//   })
//   console.log("mockConfig",mockConfig)
//   console.log("mockConfig",mockOrg)
//  const resetForm = () => {
//     setForm({ nome: "", nivel: "", ocorrencias: 1, diasSelecionados: [] })
//     setEditId(null)
//   }
//   const handleAdd = () => {
//     if (!nome || !nivel || ocorrencias < 1) return;

//     setOrganistas([
//       ...organistas,
//       {
//         id: Date.now(),
//         nome,
//         nivel,
//         ocorrencias,
//         diasSelecionados,
//       },
//     ]);

//     // resetar form
//     setNome("");
//     setNivel("");
//     setOcorrencias(1);
//     setDiasSelecionados([]);
//     setOpen(false);
//   };

//   const handleRemove = (id: string) => {
//     console.log("handleRemove", id)
//     const newOrganists = organistas.filter(organistas => organistas.id !== id)
//     setOrganistas(newOrganists);
//   };

//   const handleEdit = (id: number, field: keyof Organista, value: any) => {
//     setOrganistas(
//       organistas.map((o) => (o.id === id ? { ...o, [field]: value } : o))
//     );
//   };

//   const abrirModal = () => {
//     alert("Abre modal")
//     //resetForm()
//     setIsModalOpen(true)
//   }
//   const handleCheckbox = (dia: string) => {
//     setForm((prev) => ({
//       ...prev,
//       diasSelecionados: prev.diasSelecionados.includes(dia)
//         ? prev.diasSelecionados.filter((d) => d !== dia)
//         : [...prev.diasSelecionados, dia],
//     }))
//   }
// const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target
//     setForm((prev) => ({
//       ...prev,
//       [name]: name === "ocorrencias" ? Number(value) : value,
//     }))
//   }
//   const handleSubmit = () => {
//     alert("Salvar modal")
//   }
//   // const diasDisponiveis = (nivel: string) => {
//   //   let dias = [...configuracao.diasCulto];
//   //   if (configuracao.temRDJ && (nivel.includes("RDJ"))) {
//   //     dias = ["Domingo (RDJ)", ...dias];
//   //   }
//   //   return dias;
//   // };

//   return (
//     <div className="w-full bg-neutral-5 p-4 pl-44 pr-44 p-6 space-y-6 border-2">
//       <header className="flex justify-between items-center mb-6 border-2">
//         <h2 className="text-2xl font-bold">Organistas</h2>

//         <button
//             onClick={abrirModal}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
//           >
//             + Adicionar Organista
//         </button>
//       </header>

//       {/* Lista de Organistas */}
//       <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-4 py-2 text-left">Nome</th>
//             <th className="px-4 py-2 text-left">Nível</th>
//             <th className="px-4 py-2 text-left">Ocorrências</th>
//             <th className="px-4 py-2 text-left">Dias</th>
//             <th className="px-4 py-2 text-left">Ações</th>
//           </tr>
//         </thead>
//         <tbody>
//           {mockOrg.map((org) => (
//             <tr key={org.id} className="border-t">
//               <td className="px-4 py-2">{org.nome}</td>
//               <td className="px-4 py-2">{org.nivel}</td>
//               <td className="px-4 py-2">{org.ocorrencias}</td>
//               <td className="px-4 py-2">{org.diasSelecionados.join(", ")}</td>
//               <td className="px-4 py-2 flex gap-2">
//                 <button
//                   className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer"
//                 >
//                   Editar
//                 </button>
//                 <button
//                   onClick={() => handleRemove(org.id)}
//                   className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
//                 >
//                   Remover
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {organistas.length === 0 && (
//             <tr>
//               <td colSpan={5} className="text-center py-4 text-gray-500">
//                 Nenhum organista cadastrado
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
//             <h2 className="text-xl font-bold mb-4">
//               {editId ? "Editar Organista" : "Adicionar Organista"}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Nome */}
//               <div>
//                 <label className="block font-medium">Nome</label>
//                 <input
//                   type="text"
//                   name="nome"
//                   value={form.nome}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                   required
//                 />
//               </div>

//               {/* Nível */}
//               <div>
//                 <label className="block font-medium">Nível</label>
//                 <select
//                   name="nivel"
//                   value={form.nivel}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                   required
//                 >
//                   <option value="">Selecione um nível</option>
//                   {niveis.map((n) => (
//                     <option key={n} value={n}>
//                       {n}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//                {/* Ocorrências */}
//               <div>
//                 <label className="block font-medium">
//                   Quantidade de ocorrências no mês
//                 </label>
//                 <input
//                   type="number"
//                   name="ocorrencias"
//                   min={1}
//                   value={form.ocorrencias}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                 />
//               </div>
//               {/* Dias de Culto */}
//               <div>
//                 <label className="block font-medium">Dias disponíveis</label>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {diasDisponiveis(form.nivel).map((dia) => (
//                     <label
//                       key={dia}
//                       className="flex items-center gap-2 border px-3 py-1 rounded cursor-pointer hover:bg-gray-100"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={form.diasSelecionados.includes(dia)}
//                         onChange={() => handleCheckbox(dia)}
//                       />
//                       {dia}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//             </form>
//           </div>
//         </div>
//       )}
//     </div>
    
//   );
// };

// export default Organistas;
