import { useState, useEffect } from "react";
import { workflowAPI } from "../../api/modules/workflow";
import Layout from "../../components/layout/Layout";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function WorkflowTest() {
  const { colors } = useTheme();

  const [workflows, setWorkflows] = useState([]);
  const [workflowName, setWorkflowName] = useState("");
  const [stages, setStages] = useState([{ name: "" }]);
  const [selectedId, setSelectedId] = useState(null);
  const [openWorkflowId, setOpenWorkflowId] = useState(null);

  const fetchWorkflows = async () => {
    try {
      const res = await workflowAPI.getAll();
      setWorkflows(res.data.data || []);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((e) => toast.error(`${e.field}: ${e.message}`));
      } else {
        toast.error(data?.message || err.message);
      }
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const addStage = () => setStages([...stages, { name: "" }]);
  const removeStage = (index) =>
    setStages(stages.filter((_, i) => i !== index));
  const updateStage = (index, value) => {
    const updated = [...stages];
    updated[index].name = value;
    setStages(updated);
  };

  const createWorkflow = async () => {
    try {
      const res = await workflowAPI.create({
        name: workflowName,
        stages: stages.map((s) => s.name),
      });
      toast.success(res.data?.message || "Workflow oluşturuldu!");
      setWorkflowName("");
      setStages([{ name: "" }]);
      fetchWorkflows();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((e) => toast.error(`${e.message}`));
      } else {
        toast.error(data?.message || err.message);
      }
    }
  };

  const updateWorkflow = async () => {
    try {
      const res = await workflowAPI.update(selectedId, {
        name: workflowName,
        stages: stages.map((s) => s.name),
      });
      toast.success(res.data?.message || "Workflow güncellendi!");
      setSelectedId(null);
      setWorkflowName("");
      setStages([{ name: "" }]);
      fetchWorkflows();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((e) => toast.error(`${e.field}: ${e.message}`));
      } else {
        toast.error(data?.message || "Workflow güncellenemedi!");
      }
    }
  };

  const deleteWorkflow = async (id) => {
    try {
      const res = await workflowAPI.delete(id);
      toast.success(res.data?.message || "Workflow silindi!");
      fetchWorkflows();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((e) => toast.error(`${e.field}: ${e.message}`));
      } else {
        toast.error(data?.message || "workflow silinemedi");
      }
    }
  };

  const editWorkflow = (wf) => {
    setSelectedId(wf.id);
    setWorkflowName(wf.name);
    setStages(wf.stages.map((s) => ({ name: s })));
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen" style={{ backgroundColor: colors.bg }}>
        <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Şablon Oluştur
        </h1>

        <div className="mb-4">
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Şablon Adı"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <Button
              className="px-3 py-2 rounded whitespace-nowrap"
              onClick={addStage}
            >
              Aşama Ekle
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            {stages.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Aşama ${i + 1}`}
                  value={s.name}
                  onChange={(e) => updateStage(i, e.target.value)}
                  className="border p-2 rounded flex-1"
                />
                {stages.length > 1 && (
                  <button
                    className="bg-red-800 text-white mr-4 gap-2 px-4 rounded "
                    onClick={() => removeStage(i)}
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={createWorkflow}
              className="px-3 py-2 rounded"
              style={{ backgroundColor: colors.bgsoft, color: colors.text }}
            >
              Oluştur
            </button>
            <button
              onClick={updateWorkflow}
              disabled={!selectedId}
              className="px-3 py-2 rounded"
              style={{ backgroundColor: colors.bgsoft, color: colors.text }}
            >
              Güncelle
            </button>
          </div>
        </div>

        <ul className="space-y-2">
          {workflows.map((wf) => (
            <li
              key={wf.id}
              className="border p-3 rounded-xl"
              style={{ color: colors.text, backgroundColor: colors.bgsoft }}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setOpenWorkflowId(openWorkflowId === wf.id ? null : wf.id)
                }
              >
                <strong>{wf.name}</strong>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editWorkflow(wf);
                    }}
                    className="px-3 py-1 rounded"
                    style={{
                      backgroundColor: colors.bgsoft,
                      color: colors.text,
                    }}
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWorkflow(wf.id);
                    }}
                    className="px-3 gap-2 py-1 rounded"
                    style={{
                      backgroundColor: colors.bgsoft,
                      color: colors.text,
                    }}
                  >
                    Sil
                  </button>
                </div>
              </div>

              {openWorkflowId === wf.id && (
                <div className="mt-2 space-y-2 rounded-3xl">
                  {wf.stages.map((stage, i) => (
                    <div
                      key={i}
                      className="border p-2 rounded-xl"
                      style={{
                        backgroundColor: colors.bg,
                      }}
                    >
                      <div className="font-semibold">{stage}</div>
                      <div
                        className="text-sm mt-1"
                        style={{
                          color: colors.primary,
                        }}
                      >
                        Formlar veya detaylar burada gösterilecek
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
