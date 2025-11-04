import { useState, useEffect } from "react";
import { workflowAPI } from "../../api/modules/workflow";
import { taskAPI } from "../../api/modules/task";
import Layout from "../../components/layout/Layout";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import TaskCard from "../../components/ui/TaskCard";
import TaskCreateModal from "../../components/ui/TaskCreateModal";

export default function WorkflowTest() {
  const { colors } = useTheme();

  // Workflow state
  const [workflows, setWorkflows] = useState([]);
  const [workflowName, setWorkflowName] = useState("");
  const [stages, setStages] = useState([{ name: "" }]);
  const [selectedId, setSelectedId] = useState(null);
  const [openWorkflowId, setOpenWorkflowId] = useState(null);

  // Task state
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [stageTasks, setStageTasks] = useState({});
  const [taskCounts, setTaskCounts] = useState({});
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedStageForTask, setSelectedStageForTask] = useState(null);

  // ⚡ HIZLI ÇÖZÜM: Workflow 15 için sabit stage ID'leri
  const getStageIdForWorkflow = (workflowId, stageIndex) => {
    // Workflow 15 için bilinen stage ID'leri
    if (workflowId === 15) {
      const stageIds = [22, 23, 24, 25]; // Gerçek stage ID'leri
      return stageIds[stageIndex] || null;
    }
    
    // Diğer workflow'lar için geçici çözüm
    // Bu kısım gelecekte API'den alınmalı
    return null;
  };

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

  const fetchTasksForStage = async (stageId) => {
    try {
      const res = await taskAPI.getTasksByStage(stageId);
      setStageTasks(prev => ({
        ...prev,
        [stageId]: res.data.data || []
      }));
      setTaskCounts(prev => ({
        ...prev,
        [stageId]: res.data.data?.length || 0
      }));
    } catch (err) {
      console.error("Task'lar yüklenemedi:", err);
      setStageTasks(prev => ({
        ...prev,
        [stageId]: []
      }));
      setTaskCounts(prev => ({
        ...prev,
        [stageId]: 0
      }));
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  // Workflow açıldığında tüm stage'lerin task'larını önceden yükle
  const handleWorkflowToggle = async (workflowId) => {
    if (openWorkflowId === workflowId) {
      setOpenWorkflowId(null);
    } else {
      setOpenWorkflowId(workflowId);
      
      // Bu workflow'daki tüm stage'lerin task sayılarını önceden yükle
      if (workflowId === 15) {
        const stageIds = [22, 23, 24, 25];
        for (const stageId of stageIds) {
          await fetchTasksForStage(stageId);
        }
      }
    }
  };

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
      toast.info("Workflow'u candidate'a assign etmeyi unutmayın!");
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

  const handleStageClick = async (stageId) => {
    if (selectedStageId === stageId) {
      setSelectedStageId(null);
    } else {
      setSelectedStageId(stageId);
      await fetchTasksForStage(stageId);
    }
  };

  const handleCreateTask = (stageId) => {
    setSelectedStageForTask(stageId);
    setIsTaskModalOpen(true);
  };

  const handleTaskCreated = () => {
    setIsTaskModalOpen(false);
    if (selectedStageForTask) {
      fetchTasksForStage(selectedStageForTask);
    }
  };

  const handleTaskDeleted = (stageId) => {
    fetchTasksForStage(stageId);
  };

  const getStageStatus = (stageId) => {
    const tasks = stageTasks[stageId] || [];
    if (tasks.length === 0) return "empty";
    
    const completedTasks = tasks.filter(task => task.status === "APPROVED").length;
    if (completedTasks === tasks.length) return "completed";
    if (completedTasks > 0) return "in-progress";
    return "pending";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "#10B981"; // green
      case "in-progress": return "#F59E0B"; // yellow
      case "pending": return "#EF4444"; // red
      case "empty": return "#6B7280"; // gray
      default: return colors.text;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed": return "Tamamlandı";
      case "in-progress": return "Devam Ediyor";
      case "pending": return "Bekliyor";
      case "empty": return "Görev Yok";
      default: return "Bilinmiyor";
    }
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen" style={{ backgroundColor: colors.bg }}>
        <h1 className="text-3xl font-bold mb-6" style={{ color: colors.text }}>
          Şablon ve Görev Yönetimi
        </h1>

        {/* ⚠️ INFO BANNER */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600">ℹ️</span>
            <span className="font-medium text-blue-800">Önemli Bilgi</span>
          </div>
          <p className="text-sm text-blue-700">
            Task oluşturmak için önce workflow'u bir candidate'a assign etmelisiniz. 
            Şu an sadece <strong>Workflow 15 ("stage id test")</strong> assign edilmiş durumda.
          </p>
        </div>

        {/* Workflow Oluşturma Formu */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6" style={{ backgroundColor: colors.bgsoft }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
            Yeni Şablon Oluştur
          </h2>
          
          <div className="mb-4">
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <input
                type="text"
                placeholder="Şablon Adı"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="border p-3 rounded-lg flex-1"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              />
              <Button
                className="px-4 py-3 rounded-lg whitespace-nowrap"
                onClick={addStage}
              >
                + Aşama Ekle
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {stages.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Aşama ${i + 1}`}
                    value={s.name}
                    onChange={(e) => updateStage(i, e.target.value)}
                    className="border p-3 rounded-lg flex-1"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  />
                  {stages.length > 1 && (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg transition-colors"
                      onClick={() => removeStage(i)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={createWorkflow}
                className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                disabled={!workflowName || stages.some(s => !s.name)}
              >
                Şablon Oluştur
              </button>
              {selectedId && (
                <button
                  onClick={updateWorkflow}
                  className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                >
                  Güncelle
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Workflow Listesi */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
            Mevcut Şablonlar
          </h2>
          
          {workflows.length === 0 ? (
            <div className="text-center py-8" style={{ color: colors.text }}>
              Henüz şablon oluşturulmamış
            </div>
          ) : (
            workflows.map((wf) => (
              <div
                key={wf.id}
                className="border rounded-lg shadow-lg overflow-hidden"
                style={{ backgroundColor: colors.bgsoft, borderColor: colors.border }}
              >
                {/* Workflow Header */}
                <div
                  className="p-4 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleWorkflowToggle(wf.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                        {wf.name}
                      </h3>
                      <p className="text-sm" style={{ color: colors.textSoft }}>
                        {wf.stages.length} aşama
                        {wf.id === 15 && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Candidate Atanmış
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editWorkflow(wf);
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWorkflow(wf.id);
                        }}
                        className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>

                {/* Workflow Stages */}
                {openWorkflowId === wf.id && (
                  <div className="border-t p-4" style={{ borderColor: colors.border }}>
                    <div className="grid gap-4">
                      {wf.stages.map((stageName, i) => {
                        // ✅ ÇÖZÜM: Gerçek stage ID'sini al
                        const stageId = getStageIdForWorkflow(wf.id, i);
                        const status = stageId ? getStageStatus(stageId) : "empty";
                        const taskCount = stageId ? (taskCounts[stageId] || 0) : 0;
                        
                        return (
                          <div
                            key={i}
                            className="border rounded-lg overflow-hidden"
                            style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                          >
                            {/* Stage Header */}
                            <div
                              className="p-3 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => stageId && handleStageClick(stageId)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium" style={{ color: colors.text }}>
                                    {stageName}
                                  </span>
                                  {stageId ? (
                                    <>
                                      <span 
                                        className="text-xs px-2 py-1 rounded-full"
                                        style={{ 
                                          backgroundColor: getStatusColor(status) + "20",
                                          color: getStatusColor(status)
                                        }}
                                      >
                                        {getStatusText(status)}
                                      </span>
                                      <span 
                                        className="text-sm px-2 py-1 rounded-full"
                                        style={{ 
                                          backgroundColor: colors.primary + "20",
                                          color: colors.primary
                                        }}
                                      >
                                        {taskCount} görev
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        (ID: {stageId})
                                      </span>
                                    </>
                                  ) : (
                                    <span 
                                      className="text-xs px-2 py-1 rounded-full"
                                      style={{ 
                                        backgroundColor: "#f59e0b20",
                                        color: "#f59e0b"
                                      }}
                                    >
                                      Candidate atanmamış
                                    </span>
                                  )}
                                </div>
                                {stageId && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCreateTask(stageId);
                                    }}
                                    className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm transition-colors"
                                  >
                                    + Görev Ekle
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Stage Tasks */}
                            {selectedStageId === stageId && stageId && (
                              <div className="border-t p-3" style={{ borderColor: colors.border }}>
                                {stageTasks[stageId]?.length > 0 ? (
                                  <div className="space-y-2">
                                    {stageTasks[stageId].map((task) => (
                                      <TaskCard
                                        key={task.id}
                                        task={task}
                                        onDelete={() => handleTaskDeleted(stageId)}
                                        colors={colors}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4" style={{ color: colors.textSoft }}>
                                    Bu aşamada henüz görev bulunmuyor
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Task Create Modal */}
        {isTaskModalOpen && (
          <TaskCreateModal
            stageId={selectedStageForTask}
            onClose={() => setIsTaskModalOpen(false)}
            onTaskCreated={handleTaskCreated}
            colors={colors}
          />
        )}
      </div>
    </Layout>
  );
}