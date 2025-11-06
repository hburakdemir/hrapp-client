import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { workflowAPI } from "../../api/modules/workflow";
import toast from "react-hot-toast";

export default function CreateWorkflowButton() {
  const [showModal, setShowModal] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [stages, setStages] = useState([{ name: "" }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addStage = () => setStages([...stages, { name: "" }]);
  const removeStage = (idx) => setStages(stages.filter((_, i) => i !== idx));

  const handleStageChange = (idx, value) => {
    const updated = [...stages];
    updated[idx].name = value;
    setStages(updated);
  };

  const handleCreateWorkflow = async () => {
    if (!workflowName.trim()) return toast.error("Şablon adı gerekli!");
    if (stages.some((s) => !s.name.trim()))
      return toast.success("Aşama adları boş olamaz!");

    try {
      setLoading(true);
      const data = {
        name: workflowName,
        stages: stages.map((s) => s.name),
      };

      await workflowAPI.create(data);
      toast.success("Şablon başarıyla oluşturuldu!");
      navigate("/sablonlar");
    } catch (err) {
      console.error(err);
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Yeni Şablon Oluştur</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Yeni Şablon Oluştur
      </button>

      {showModal && (
        <>
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

          {/* modal */}
          <div className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50">
            <h2 className="text-xl font-semibold mb-4">Yeni Şablon</h2>

            <label className="block mb-1 text-sm font-medium">Şablon Adı</label>
            <input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Örnek: İşe Alım Süreci"
              className="border border-gray-300 rounded w-full px-3 py-2 mb-4 focus:ring focus:ring-blue-200 outline-none"
            />

            <div>
              <label className="block mb-2 text-sm font-medium">Aşamalar</label>
              {stages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    value={stage.name}
                    onChange={(e) => handleStageChange(idx, e.target.value)}
                    placeholder={`Aşama ${idx + 1}`}
                    className="border border-gray-300 rounded px-3 py-2 flex-1 focus:ring focus:ring-blue-200 outline-none"
                  />
                  {stages.length > 1 && (
                    <button
                      onClick={() => removeStage(idx)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Sil
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addStage}
                className="text-sm mt-2 text-blue-600 hover:text-blue-800"
              >
                + Aşama Ekle
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Vazgeç
              </button>
              <button
                onClick={handleCreateWorkflow}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? "Oluşturuluyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
