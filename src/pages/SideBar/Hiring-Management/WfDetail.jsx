import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { workflowAPI } from "../../../api/modules/workflow";
import { stageAPI } from "../../../api/modules/stage";
import { taskAPI } from "../../../api/modules/task";
import toast from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";
import Layout from "../../../components/layout/Layout";
import { ChevronLeft, ChevronRight, Edit2, Trash2, X, User, CalendarCheckIcon } from "lucide-react";

const WfDetails = () => {
  const { colors } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(null);
  const [stages, setStages] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", description: "" });
  const sliderRefs = useRef({});

  const fetchWorkflow = async () => {
    try {
      const res = await workflowAPI.getById(id);
      setWorkflow(res.data.data);
      setEditFormData({
        name: res.data.data.name || "",
        description: res.data.data.description || ""
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Workflow alınamadı");
    }
  };

  const fetchStages = async () => {
    try {
      const res = await stageAPI.getAll();
      const stageList = Array.isArray(res.data.data) ? res.data.data : [];
      const filteredStages = stageList.filter((s) => s.workflowId === Number(id));
      setStages(filteredStages);
      
      // Tüm stage'lerin tasklerini fetch et
      filteredStages.forEach(stage => fetchTasksForStage(stage.id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Aşamalar alınamadı");
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

  const handleUpdateWorkflow = async (e) => {
    e.preventDefault();
    try {
      const res = await workflowAPI.update(id, editFormData);
      toast.success(res.data?.message || "Workflow başarıyla güncellendi");
      setIsEditModalOpen(false);
      fetchWorkflow();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Workflow güncellenemedi");
    }
  };

  const handleDeleteWorkflow = async () => {
    if (!window.confirm("Bu workflow'u silmek istediğinizden emin misiniz?")) return;
    
    try {
      const res = await workflowAPI.delete(id);
      toast.success(res.data?.message || "Workflow başarıyla silindi");
      navigate("/workflows");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Workflow silinemedi");
    }
  };

  const scrollSlider = (stageId, direction) => {
    const slider = sliderRefs.current[stageId];
    if (slider) {
      const scrollAmount = 280;
      slider.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
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
      <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: colors.bg }}>
        {/* Ana Kart */}
        <div 
          className="max-w-7xl mx-auto  rounded-2xl shadow-2xl overflow-hidden"
          style={{backgroundColor:colors.bgsoft }}
        >
          {/* Header Bölümü */}
          <div className=" p-6 md:p-8"
          style={{
               background: `linear-gradient(90deg, ${colors.primary}, ${colors.bg})`,
          }}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold mb-3"
                  style={{ color: colors.text }}>
                  {workflow.name}
                </h1>
                <div className="flex items-center gap-2"
                  style={{ color: colors.text }}>
                  <User size={18} />
                  <span className="text-sm md:text-base">
                    {workflow.creator?.name} {workflow.creator?.surname}
                  </span>
                </div>
              </div>
              
              {/* Sağ Üst - Task Sayısı ve Butonlar */}
              <div className="flex flex-col items-end gap-3">
                <div className="backdrop-blur-sm rounded-lg px-4 py-2"
                  style={{ color: colors.text, backgroundColor: colors.bgsoft }}>
                  <div className="text-xs uppercase tracking-wide opacity-80">Toplam Görev</div>
                  <div className="text-2xl font-bold">
                    {totalTasks}
                  </div>
                </div>
                
                <div className="flex  gap-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors shadow-lg"
                  >
                    <Edit2 size={18} />
                    <span className="hidden sm:inline">Düzenle</span>
                  </button>
                  <button
                    onClick={handleDeleteWorkflow}
                    className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg transition-colors shadow-lg"
                  >
                    <Trash2 size={18} />
                    <span className="hidden sm:inline">Sil</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stages Bölümü */}
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-6" style={{ color: colors.text }}>
              Aşamalar
            </h2>

            {stages.length > 0 ? (
              <div className="space-y-6 ">
                {stages.map((stage) => {
                  const stageTasks = tasks[stage.id] || [];
                  const stageTotalCount = stageTasks.length;

                  return (
                    <div
                      key={stage.id}
                      className=" rounded-xl p-5 shadow-md"
                      style={{
                        backgroundColor:colors.bg
                      }}
                    >
                      {/* Stage Header */}
                      <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold" style={{ color: colors.text }}>
                            {stage.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span
                          style={{
                            color:colors.text
                          }}
                            >
                              {stage.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              {stageTotalCount} görev
                            </span>
                          </div>
                        </div>

                        {stageTasks.length > 0 && (
                          <div className="flex lg:invisible gap-2  ">
                            <button
                              onClick={() => scrollSlider(stage.id, "left")}
                              className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow hover:shadow-md transition-shadow"
                              style={{ color: colors.text }}
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button
                              onClick={() => scrollSlider(stage.id, "right")}
                              className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow hover:shadow-md transition-shadow"
                              style={{ color: colors.text }}
                            >
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Tasks Slider */}
                      <div className="relative -mx-2">
                        <div
                          ref={(el) => (sliderRefs.current[stage.id] = el)}
                          className="flex gap-4 overflow-x-auto "
                          style={{ 
                            width: "280px"
                          }}
                        >
                          {stageTasks.length > 0 ? (
                            stageTasks.map((task) => {
                              const isOverdue = task.deadline && new Date(task.deadline) < new Date();
                              return (
                                <div
                                  key={task.id}
                                  className="flex-shrink-0 f rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 border-l-4"
                                  style={{ 
                                    minWidth: "280px",
                                    maxWidth: "280px",
                                    borderLeftColor: task.isRequired ? "#ef4444" : "#3b82f6",
                                    backgroundColor:colors.bgsoft
                                  }}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-semibold text-base flex-1 pr-2" style={{ color: colors.text }}>
                                      {task.title}
                                    </h4>
                                  </div>
                                  
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3">
                                    {task.description || "Açıklama bulunmuyor"}
                                  </p>

                                  {task.deadline && (
                                    <div className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-700" : "text-gray-600 dark:text-gray-400"}`}>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <CalendarCheckIcon/>
                                      </svg>
                                      <span className="font-medium">
                                        {new Date(task.deadline).toLocaleDateString('tr-TR', { 
                                          day: 'numeric', 
                                          month: 'short',
                                          year: 'numeric'
                                        })}
                                      </span>
                                      {isOverdue && <span className="text-red-700 font-semibold ml-1">(Gecikmiş)</span>}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="w-full text-center py-8 text-gray-400">
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

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className=" rounded-2xl shadow-2xl max-w-md w-full p-6"
            style={{
            backgroundColor:colors.bg
            }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold" style={{ color: colors.text }}>
                  Workflow Düzenle
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <X size={24} style={{ color: colors.text }} />
                </button>
              </div>

              <form onSubmit={handleUpdateWorkflow} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Workflow Adı
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
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
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Açıklama
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg  resize-y"
                    style={{
                       color: colors.text,
                      backgroundColor: colors.bgsoft,
                      border: `1px solid ${colors.primary}`,                 
                      }}
                    rows="4"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg transition-colors"
                    style={{
                      color: colors.text,
                      backgroundColor:colors.bg,
                      border: `1px solid ${colors.bgsoft}`
                      }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2transition-colors font-medium rounded-lg"
                    style={{
                      backgroundColor:colors.primary,
                      colors:colors.text
                    }}
                  >
                    Kaydet
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