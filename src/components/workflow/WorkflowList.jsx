import { useEffect, useState } from "react";
import { workflowAPI } from "../../api/modules/workflow";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editName, setEditName] = useState("");
  const navigate = useNavigate();

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const res = await workflowAPI.getAll();
      const list = res.data?.data;
      setWorkflows(Array.isArray(list) ? list : []);
      setFiltered(Array.isArray(list) ? list : []);
      console.log("response", res.data);
    } catch (err) {
      console.error(err);
      toast.error("Şablonlar alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();

    const filteredList = workflows.filter((w) => {
      // şablon adı 
      const nameMatch = w.name.toLowerCase().includes(lower);

      // aşama 
      const stageMatch = w.stages.some((stage) =>
        stage.toLowerCase().includes(lower)
      );

      return nameMatch || stageMatch;
    });

    setFiltered(filteredList);
  }, [search, workflows]);

  // Silme
  const handleDelete = async (id) => {
    if (!confirm("Bu şablonu silmek istediğine emin misin?")) return;
    try {
      await workflowAPI.delete(id);
      toast.success("Şablon silindi!");
      fetchWorkflows();
    } catch (err) {
      console.error(err);
      toast.error("Silme işlemi başarısız oldu.");
    }
  };

  // düzenleme aç
  const openEdit = (workflow) => {
    setEditModal(workflow);
    setEditName(workflow.name);
  };

  // düzenleme kaydet
  const handleUpdate = async () => {
    try {
      await workflowAPI.update(editModal.id, { name: editName });
      toast.success("Şablon güncellendi!");
      setEditModal(null);
      fetchWorkflows();
    } catch (err) {
      console.error(err);
      toast.error("Güncelleme başarısız oldu.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Şablonlar</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ara..."
          className="border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
        />
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length > 0 ? (
            filtered.map((wf) => (
              <div
                key={wf.id}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold mb-2">{wf.name}</h3>
                <ul className="flex flex-wrap gap-2 mb-4">
                  {wf.stages?.length > 0 ? (
                    wf.stages.map((stage, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded-full text-gray-700"
                      >
                        {stage}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm italic">
                      Aşama yok
                    </span>
                  )}
                </ul>

                <div className="flex justify-end gap-2 text-sm">
                  <button
                    onClick={() => navigate(`/sablonlar/${wf.id}`)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    Detay
                  </button>
                  <button
                    onClick={() => openEdit(wf)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(wf.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Hiç şablon bulunamadı.</p>
          )}
        </div>
      )}

      {editModal && (
        <>
          <div
            onClick={() => setEditModal(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50">
            <h2 className="text-lg font-semibold mb-4">Şablonu Düzenle</h2>

            <label className="block mb-1 text-sm font-medium">Adı</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border border-gray-300 rounded w-full px-3 py-2 mb-4 focus:ring focus:ring-blue-200 outline-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Vazgeç
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
