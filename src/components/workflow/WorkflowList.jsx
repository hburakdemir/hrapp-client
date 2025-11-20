import { useEffect, useState } from "react";
import { workflowAPI } from "../../api/modules/workflow";
import { stageAPI } from "../../api/modules/stage";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { userAPI } from "../../api/modules/user";

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState([]);
  const [stages, setStages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editName, setEditName] = useState("");

  const [assignModal, setAssignModal] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const navigate = useNavigate();
  const { colors } = useTheme();

  // workflow ve stage fetch
  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const res = await workflowAPI.getAll();
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
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
      const stageList = Array.isArray(res.data?.data) ? res.data.data : [];
      setStages(stageList);
    } catch (err) {
      console.error(err);
      toast.error("Aşamalar alınamadı.");
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await userAPI.getAllCandidates({ });

      const candidateList = res.data.data;
      // console.log("123",res.data);
      // console.log("456",res.data.data);
      setCandidates(candidateList);
      console.log(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Adaylar alınamadı.");
    }
  };

  useEffect(() => {
    fetchWorkflows();
    fetchStages();
    fetchCandidates();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredList = workflows.filter((w) =>
      w.name.toLowerCase().includes(lower)
    );
    setFiltered(filteredList);
  }, [search, workflows]);

  // silme ve güncelleme fonksiyonları
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

  // workflow'u adaya atama
  const openAssignModal = (workflow) => {
    setAssignModal(workflow);
    setSelectedCandidate(null);
  };

  const handleAssign = async () => {
    if (!selectedCandidate) {
      toast.error("Bir aday seçmelisiniz.");
      return;
    }

    try {
      await workflowAPI.assignToCandidate({
        workflowId: assignModal.id,
        candidateId: selectedCandidate.id,
        assignedByUserId: 1,
      });
      toast.success("Workflow adaya atandı!");
      setAssignModal(null);
    } catch (err) {
      console.error(err);
      toast.error("Atama başarısız oldu.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{
            color: colors.text,
          }}
        >
          Şablonlar
        </h1>
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
                  style={{ backgroundColor: colors.bgsoft, color: colors.text }}
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

                  <div className="flex justify-center gap-2 text-sm mt-auto">
                    <button
                      onClick={() => navigate(`/sablon-detay/${wf.id}`)}
                      className="px-3 py-1 border rounded"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      Detay
                    </button>
                    <button
                      onClick={() => openEdit(wf)}
                      className="px-3 py-1 rounded"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(wf.id)}
                      className="px-3 py-1 rounded bg-red-900 text-white"
                    >
                      Sil
                    </button>
                    <button
                      onClick={() => openAssignModal(wf)}
                      className="px-3 py-1 rounded"
                      style={{ backgroundColor: colors.text, color: colors.bg }}
                    >
                      Adaya Ata
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

      {/* Düzenleme Modal */}
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

      {/* Adaya Atama Modal */}
      {assignModal && (
        <>
          <div
            onClick={() => setAssignModal(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50">
            <h2 className="text-lg font-semibold mb-4">Workflow'u Adaya Ata</h2>
            <label className="block mb-2 text-sm font-medium">Aday Seç</label>
            <select
              value={selectedCandidate?.id || ""}
              onChange={(e) => {
                const cand = candidates.find(
                  (c) => c.id === parseInt(e.target.value)
                );
                setSelectedCandidate(cand);
              }}
              className="border border-gray-300 rounded w-full px-3 py-2 mb-4"
            >
              <option value="" className="text-black">Seçiniz</option>
              {Array.isArray(candidates) && candidates.length > 0 ? (
                candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.user.name} {c.user.surname}
                  </option>
                ))
              ) : (
                <option value="">Aday bulunamadı</option>
              )}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAssignModal(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Vazgeç
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ata
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
