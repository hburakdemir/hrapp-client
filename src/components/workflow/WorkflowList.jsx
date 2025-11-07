import { useEffect, useState } from "react";
import { workflowAPI } from "../../api/modules/workflow";
import { stageAPI } from "../../api/modules/stage"; 
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState([]);
  const [stages, setStages] = useState([]); 
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editName, setEditName] = useState("");
  const navigate = useNavigate();
  const { colors } = useTheme();

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const res = await workflowAPI.getAll();
      const list = res.data?.data || [];
      setWorkflows(list);
      setFiltered(list);
    } catch (err) {
      console.error(err);
      toast.error("Şablonlar alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStages = async () => {
    try {
      const res = await stageAPI.getAll();
      setStages(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Aşamalar alınamadı.");
    }
  };

  useEffect(() => {
    fetchWorkflows();
    fetchStages();
  }, []);


  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredList = workflows.filter((w) =>
      w.name.toLowerCase().includes(lower)
    );
    setFiltered(filteredList);
  }, [search, workflows]);


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

  const openEdit = (workflow) => {
    setEditModal(workflow);
    setEditName(workflow.name);
  };

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
          className="border rounded px-3 py-2 outline-none"
          style={{
            borderColor: colors.text,
            color: colors.text,
          }}
        />
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
          {filtered.length > 0 ? (
            filtered.map((wf) => {
              const relatedStages = stages.filter(
                (s) => s.workflowId === wf.id
              ); 
              return (
                <div
                  key={wf.id}
                  className="p-4 rounded-2xl shadow hover:shadow-md transition flex flex-col"
                  style={{ backgroundColor: colors.bgsoft }}
                >
                  <h3 className="text-lg font-semibold mb-2">{wf.name}</h3>

                  <p
                    className={`text-xs font-medium mb-2 ${
                      wf.isActive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {wf.isActive ? "Aktif" : "Silinmiş"}
                  </p>

                  {relatedStages.length > 0 ? (
                    <ul className="text-sm mb-3">
                      {relatedStages.map((s) => (
                        <li key={s.id} className="flex flex-col mb-1">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-gray-500 text-xs">
                            {s.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm mb-3">
                      Henüz aşama eklenmemiş
                    </p>
                  )}

                  {/* 🧭 Butonlar */}
                  <div className="flex justify-center gap-2 text-sm mt-auto">
                    <button
                      onClick={() => navigate(`/sablonlar/${wf.id}`)}
                      className="px-3 py-1 border rounded"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                    >
                      Detay
                    </button>
                    <button
                      onClick={() => openEdit(wf)}
                      className="px-3 py-1 rounded"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(wf.id)}
                      className="px-3 py-1 rounded"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">Hiç şablon bulunamadı.</p>
          )}
        </div>
      )}

      {/* ✏️ Düzenleme Modalı */}
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
