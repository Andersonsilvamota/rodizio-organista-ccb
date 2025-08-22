import { useState } from "react";
import { useConfig } from "../context/configContext";

const diasSemana = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

export default function Configuracao() {
  const { configuracao, setConfiguracao } = useConfig();

  const [form, setForm] = useState({
    nomeComum: "",
    diasCulto: [] as string[],
    reuniaoJovens: false,
    dataInicio: "",
    dataFim: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleDiasCulto = (dia: string) => {
    setForm(prev => ({
      ...prev,
      diasCulto: prev.diasCulto.includes(dia)
        ? prev.diasCulto.filter(d => d !== dia)
        : [...prev.diasCulto, dia]
    }));
  };

  const handleSalvar = () => {
    if (!form.nomeComum || !form.dataInicio || !form.dataFim || form.diasCulto.length === 0) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const diasNumericos = form.diasCulto.map(dia => {
      const id = diasSemana.indexOf(dia);
      return { id, label: dia };
    });

    setConfiguracao({
      nomeComum: form.nomeComum,
      diasCulto: diasNumericos,
      temRDJ: form.reuniaoJovens,
      mesInicio: new Date(form.dataInicio),
      mesFim: new Date(form.dataFim)
    });

    alert("✅ Configuração salva!");
  };

  const handleLimpar = () => {
    setForm({
      nomeComum: "",
      diasCulto: [],
      reuniaoJovens: false,
      dataInicio: "",
      dataFim: ""
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const minDataFinal = form.dataInicio
    ? new Date(new Date(form.dataInicio).getTime() + 24*60*60*1000)
        .toISOString()
        .split("T")[0]
    : today;

  return (
    <div className="w-full bg-neutral-5 p-4 pl-44 pr-44">
      <div className="container mx-auto px-4 pt-2">
        <h2 className="text-xl font-semibold mb-4">⚙️ Configuração do Rodízio</h2>
        <h3 className="">Preencha os dados básicos da sua comum e os parâmetros do rodízio</h3>

        <div className="space-y-6">

          {/* Nome da Comum */}
          <div className="pb-6">
            <label className="block font-medium mb-2 text-gray-700">Nome da Comum</label>
            <input
              type="text"
              name="nomeComum"
              value={form.nomeComum}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="Ex: Comum Central"
            />
          </div>

          {/* Dias de Culto */}
          <div className="pb-6">
            <label className="block font-medium mb-2 text-gray-700">Dias de Culto</label>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
              {diasSemana.map(dia => (
                <label
                  key={dia}
                  className={`cursor-pointer flex items-center gap-2 border px-3 py-2 rounded-lg shadow-sm transition ${
                    form.diasCulto.includes(dia)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.diasCulto.includes(dia)}
                    onChange={() => handleDiasCulto(dia)}
                    className="hidden"
                  />
                  {dia}
                </label>
              ))}
            </div>
          </div>

          {/* RDJ */}
          <div className="flex items-center gap-3 p-3 border rounded-xl shadow-sm bg-gray-50">
            <input
              type="checkbox"
              name="reuniaoJovens"
              checked={form.reuniaoJovens}
              onChange={handleChange}
              className="h-5 w-5 accent-blue-600"
            />
            <span className="font-medium text-gray-700">
              Possui Reunião de Jovens e Menores (RDJ)?
            </span>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 pb-6">
            <div>
              <label className="block font-medium mb-2 text-gray-700">Data de Início</label>
              <input
                type="date"
                name="dataInicio"
                value={form.dataInicio}
                onChange={handleChange}
                min={today}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="block font-medium mb-2 text-gray-700">Data Final</label>
              <input
                type="date"
                name="dataFim"
                value={form.dataFim}
                onChange={handleChange}
                min={minDataFinal}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={handleSalvar}
              disabled={
                !form.nomeComum ||
                form.diasCulto.length === 0 ||
                !form.dataInicio ||
                !form.dataFim
              }
              className={`w-full col-span-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition  
                ${
                  !form.nomeComum ||
                  form.diasCulto.length === 0 ||
                  !form.dataInicio ||
                  !form.dataFim
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              Salvar Configuração
            </button>
            <button
              type="button"
              onClick={handleLimpar}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-700"
            >
              Limpar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
