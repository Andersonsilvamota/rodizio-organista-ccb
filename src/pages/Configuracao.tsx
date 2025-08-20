import { useState } from "react";

export default function Configuracao() {
  const [form, setForm] = useState({
    nomeComum: "",
    diasCulto: [] as string[],
    reuniaoJovens: false,
    dataInicio: "",
    dataFim: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDiasCulto = (dia: string) => {
    setForm((prev) => ({
      ...prev,
      diasCulto: prev.diasCulto.includes(dia)
        ? prev.diasCulto.filter((d) => d !== dia)
        : [...prev.diasCulto, dia],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Configuração salva:\n\n" + JSON.stringify(form, null, 2));
  };

  // Data mínima: hoje
  const today = new Date().toISOString().split("T")[0];
   const minDataFinal = form.dataInicio
  ? new Date(new Date(form.dataInicio).getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  : today;
  console.log("minDataFinal",minDataFinal)
  return (
    <div className="w-full bg-neutral-5 p-4 pl-44 pr-44">
      <div className="container mx-auto px-4 pt-2">
      <h2 className="text-xl font-semibold mb-4">⚙️ Configuração do Rodízio</h2>
      <h3 className="">Preencha os dados básicos da sua comum e os parâmetros do rodízio</h3>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="pb-6">
          <label className="block font-medium mb-2 text-gray-700">Nome da Comum</label>
          <input
            type="text"
            name="nomeComum"
            value={form.nomeComum}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition "
            placeholder="Ex: Comum Central"
          />
        </div>

        {/* Dias de Culto */}
        <div className="pb-6">
          <label className="block font-medium mb-2 text-gray-700">Dias de Culto</label>
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 ">
            {["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"].map((dia) => (
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

        {/* Reunião de Jovens */}
        <div className=" flex items-center gap-3 p-3 border rounded-xl shadow-sm bg-gray-50">
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

        {/* Data de Início */}
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

        

        {/* Botão */}
        <button
          type="submit"
          disabled={
            !form.nomeComum ||
            form.diasCulto.length === 0 ||
            !form.dataInicio ||
            !form.dataFim ||
            !form.dataInicio ||
            !form.dataFim
          }
          className={`w-full bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition  
            ${
              !form.nomeComum ||
              form.diasCulto.length === 0 ||
              !form.dataInicio ||
              !form.dataFim ||
              !form.dataInicio ||
              !form.dataFim
                ? "opacity-50 cursor-not-allowed hover:bg-blue-600"
                : "cursor-pointer"
    }`}
>
  Salvar Configuração
</button>
      </form>
    </div>
    </div>
  );
}
