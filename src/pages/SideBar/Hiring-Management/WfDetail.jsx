import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { workflowAPI } from "../../../api/modules/workflow";
import { stageAPI } from "../../../api/modules/stage";
import { taskAPI } from "../../../api/modules/task";
import toast from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";
import Layout from "../../../components/layout/Layout";
import {ChevronLeft,ChevronRight,Edit2,Trash2,X,User,CalendarCheckIcon,Plus,} from "lucide-react";

const WfDetails = () => {
  const { colors } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [workflow, setWorkflow] = useState(null);
  
  const [tasks, setTasks] = useState({});
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentStageId, setCurrentStageId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    status: "PENDING",
    deadline: "",
    isRequired: false,
  });
  
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [stages, setStages] = useState([]);
  const [editingStage, setEditingStage] = useState(null);
  const [stageFormData, setStageFormData] = useState({
    name: "",
  });


  const statusMap = {
    PENDING: "Bekliyor",
    APPROVED: "Onaylandı",
    DENIED: "Reddedildi",
  };
  
  const turnBack = () => {
    navigate(-1);
  };

  const fetchWorkflow = async () => {
    try {
      const res = await workflowAPI.getById(id);
      setWorkflow(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Workflow alınamadı");
    }
  };

 const fetchStages = async () => {
  try {
    const res = await stageAPI.getAll();
    const stageList = Array.isArray(res.data?.data) ? res.data.data : [];

    const filteredStages = stageList.filter(
      (s) => Number(s.workflowId) === Number(id)
    );

    setStages(filteredStages);

    filteredStages.forEach((stage) => fetchTasksForStage(stage.id));
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Aşamalar alınamadı");
  }
};

  const handleUpdateStage = async (e) => {
    e.preventDefault();
    try {
      await stageAPI.update(editingStage, { name: stageFormData.name });
      toast.success("Aşama başarıyla güncellendi");
      setIsStageModalOpen(false);
      setEditingStage(null);
      fetchStages();
    } catch (err) {
      console.error(err);
      toast.error("Aşama güncellenemedi");
    }
  };

  const fetchTasksForStage = async (stageId) => {
    try {
      const res = await taskAPI.getTasksByStage(stageId);
      setTasks((prev) => ({ ...prev, [stageId]: res.data.data || [] }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Görevler alınamadı");
    }
  };

  const openStageModal = (stage) => {
    setEditingStage(stage.id);
    setStageFormData({ name: stage.name || "" });
    setIsStageModalOpen(true);
  };

  const openTaskModal = (stageId, task = null) => {
    setCurrentStageId(stageId);
    if (task) {
      setEditingTaskId(task.id);
      setTaskFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        deadline: task.deadline
          ? new Date(task.deadline).toISOString().slice(0, 16)
          : "",
        isRequired: task.isRequired,
      });
    } else {
      setEditingTaskId(null);
      setTaskFormData({
        title: "",
        description: "",
        status: "PENDING",
        deadline: "",
        isRequired: false,
      });
    }
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setCurrentStageId(null);
    setEditingTaskId(null);
    setTaskFormData({
      title: "",
      description: "",
      status: "PENDING",
      deadline: "",
      isRequired: false,
    });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...taskFormData,
      deadline: taskFormData.deadline
        ? new Date(taskFormData.deadline).toISOString()
        : null,
    };

    try {
      if (editingTaskId) {
        const res = await taskAPI.updateTask(editingTaskId, payload);
        toast.success(res.data?.message || "Görev başarıyla güncellendi");
      } else {
        const res = await taskAPI.createTask(currentStageId, payload);
        toast.success(res.data?.message || "Görev başarıyla oluşturuldu");
      }
      closeTaskModal();
      fetchTasksForStage(currentStageId);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Görev kaydedilemedi");
    }
  };

  const handleDeleteTask = async (taskId, stageId) => {
    if (!window.confirm("Bu görevi silmek istediğinizden emin misiniz?"))
      return;

    try {
      const res = await taskAPI.deleteTask(taskId);
      toast.success(res.data?.message || "Görev başarıyla silindi");
      fetchTasksForStage(stageId);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Görev silinemedi");
    }
  };


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchWorkflow();
      await fetchStages();
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div
          className="flex justify-center items-center h-screen"
          style={{ color: colors.text }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!workflow) return null;

  const allTasks = Object.values(tasks).flat();
  const totalTasks = allTasks.length;

  return (
    <Layout>
      <div
        className="min-h-screen p-4 md:p-6 lg:p-8"
        style={{ backgroundColor: colors.bg }}
      >
        <ChevronLeft
          className="text-black dark:text-white cursor-pointer"
          onClick={turnBack}
        ></ChevronLeft>
        {/* Ana Kart */}
        <div
          className="max-w-7xl mx-auto rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: colors.bgsoft }}
        >
          {/* Header Bölümü */}
          <div
            className="p-6 md:p-8"
            style={{
              background: `linear-gradient(90deg, ${colors.bg}, ${colors.text})`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1
                  className="text-2xl md:text-4xl font-bold mb-3"
                  style={{ color: colors.text }}
                >
                  {workflow.name}
                </h1>
                <div
                  className="flex items-center gap-2"
                  style={{ color: colors.text }}
                >
                  <User size={18} />
                  <span className="text-sm md:text-base">
                    {workflow.creator?.name} {workflow.creator?.surname}
                  </span>
                </div>
              </div>

              {/* Sağ Üst - Task Sayısı ve Butonlar */}
              <div className="flex flex-col items-end gap-3">
                <div
                  className="backdrop-blur-sm rounded-lg px-4 py-2"
                  style={{ color: colors.text, backgroundColor: colors.bgsoft }}
                >
                  <div className="text-xs uppercase tracking-wide opacity-80">
                    Toplam Görev
                  </div>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stages Bölümü */}
          <div className="p-6 md:p-8">
            <h2
              className="text-xl md:text-2xl font-semibold mb-6"
              style={{ color: colors.text }}
            >
              Aşamalar
            </h2>

            {stages.length > 0 ? (
              <div className="space-y-6">
                {stages.map((stage) => {
                  const stageTasks = tasks[stage.id] || [];
                  const stageTotalCount = stageTasks.length;

                  return (
                    <div
                      key={stage.id}
                      className="rounded-xl p-5 shadow-md"
                      style={{
                        backgroundColor: colors.bg,
                      }}
                    >
                      {/* Stage Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                          <button
                            onClick={() => openStageModal(stage)}
                            className="flex items-center p-2 mb-2 border rounded-lg transition-colors shadow-md hover:shadow-lg"
                            style={{
                              color: colors.text,
                            }}
                          >
                            <Edit2 size={18} />
                            <span className="hidden sm:inline">Düzenle</span>
                          </button>
                          <h3
                            className="text-lg md:text-xl font-semibold"
                            style={{ color: colors.text }}
                          >
                            {stage.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span style={{ color: colors.text }}>
                              {statusMap[stage.status]}
                            </span>
                            <span className="text-sm text-gray-500">
                              {stageTotalCount} görev
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openTaskModal(stage.id)}
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors shadow-md hover:shadow-lg"
                            style={{
                              backgroundColor: colors.bgsoft,
                              borderColor: colors.primary,
                              color: colors.text,
                            }}
                          >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Yeni Görev</span>
                          </button>
                        </div>
                      </div>

                      {/* Tasks List */}
                      <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {stageTasks.length > 0 ? (
                            stageTasks.map((task) => {
                              const isOverdue =
                                task.deadline &&
                                new Date(task.deadline) < new Date();
                              return (
                                <div
                                  key={task.id}
                                  className="rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 border-l-4"
                                  style={{
                                    borderLeftColor: task.isRequired
                                      ? colors.primary
                                      : colors.text,
                                    backgroundColor: colors.bgsoft,
                                  }}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <h4
                                      className="font-semibold text-base flex-1 pr-2"
                                      style={{ color: colors.text }}
                                    >
                                      {task.title}
                                    </h4>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() =>
                                          openTaskModal(stage.id, task)
                                        }
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                        style={{ color: colors.text }}
                                      >
                                        <Edit2 size={16} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteTask(task.id, stage.id)
                                        }
                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors text-red-500"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>

                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3">
                                    {task.description || "Açıklama bulunmuyor"}
                                  </p>

                                  <div className="flex items-center justify-between">
                                    <span
                                      className="text-xs px-2 py-1 rounded"
                                      style={{
                                        backgroundColor: colors.bg,
                                        color: colors.text,
                                      }}
                                    >
                                      {statusMap[task.status]}
                                    </span>

                                    {task.deadline && (
                                      <div
                                        className={`text-xs flex items-center gap-1 ${
                                          isOverdue
                                            ? "text-red-600"
                                            : "text-gray-600 dark:text-gray-400"
                                        }`}
                                      >
                                        <CalendarCheckIcon size={14} />
                                        <span className="font-medium">
                                          {new Date(
                                            task.deadline
                                          ).toLocaleDateString("tr-TR", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })}
                                        </span>
                                        {isOverdue && (
                                          <span className="text-red-600 font-semibold ml-1">
                                            (Gecikmiş)
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="col-span-full text-center py-8 text-gray-400">
                              Bu aşamada henüz görev bulunmuyor
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                Bu workflow'da henüz aşama bulunmuyor
              </div>
            )}
          </div>
        </div>

      

        {isStageModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
              className="rounded-2xl shadow-2xl max-w-md w-full p-6"
              style={{
                backgroundColor: colors.bg,
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  Aşama Düzenle
                </h3>
                <button onClick={() => setIsStageModalOpen(false)}>
                  <X size={24} style={{ color: colors.text }} />
                </button>
              </div>

              <form onSubmit={handleUpdateStage} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Aşama Adı
                  </label>
                  <input
                    type="text"
                    value={stageFormData.name}
                    onChange={(e) =>
                      setStageFormData({
                        ...stageFormData,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.bgsoft,
                      border: `1px solid ${colors.primary}`,
                    }}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsStageModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg transition-colors"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.bgsoft}`,
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                 
                    className="flex-1 px-4 py-2 transition-colors font-medium rounded-lg"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.text,
                    }}
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task Modal */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
              className="rounded-2xl shadow-2xl max-w-lg w-full p-6"
              style={{ backgroundColor: colors.bg }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  {editingTaskId ? "Görevi Düzenle" : "Yeni Görev Ekle"}
                </h3>
                <button onClick={closeTaskModal}>
                  <X size={24} style={{ color: colors.text }} />
                </button>
              </div>

              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Görev Başlığı
                  </label>
                  <input
                    type="text"
                    value={taskFormData.title}
                    onChange={(e) =>
                      setTaskFormData({
                        ...taskFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.bgsoft,
                      border: `1px solid ${colors.primary}`,
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Açıklama
                  </label>
                  <textarea
                    value={taskFormData.description}
                    onChange={(e) =>
                      setTaskFormData({
                        ...taskFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg resize-y"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.bgsoft,
                      border: `1px solid ${colors.primary}`,
                    }}
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Durum
                    </label>
                    <select
                      value={taskFormData.status}
                      onChange={(e) =>
                        setTaskFormData({
                          ...taskFormData,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg"
                      style={{
                        color: colors.text,
                        backgroundColor: colors.bgsoft,
                        border: `1px solid ${colors.primary}`,
                      }}
                    >
                      <option value="DENIED">Reddet</option>
                      <option value="PENDING">Beklemede</option>
                      <option value="APPROVED">Tamamlandı</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Son Tarih
                    </label>
                    <input
                      type="datetime-local"
                      value={taskFormData.deadline}
                      onChange={(e) =>
                        setTaskFormData({
                          ...taskFormData,
                          deadline: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg"
                      style={{
                        color: colors.text,
                        backgroundColor: colors.bgsoft,
                        border: `1px solid ${colors.primary}`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRequired"
                    checked={taskFormData.isRequired}
                    onChange={(e) =>
                      setTaskFormData({
                        ...taskFormData,
                        isRequired: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded"
                    style={{ accentColor: colors.primary }}
                  />
                  <label
                    htmlFor="isRequired"
                    className="text-sm"
                    style={{ color: colors.text }}
                  >
                    Zorunlu görev
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeTaskModal}
                    className="flex-1 px-4 py-2 rounded-lg transition-colors"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.bgsoft}`,
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 transition-colors font-medium rounded-lg"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.text,
                    }}
                  >
                    {editingTaskId ? "Güncelle" : "Oluştur"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WfDetails;
