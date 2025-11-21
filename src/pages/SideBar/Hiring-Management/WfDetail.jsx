import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { workflowAPI } from "../../../api/modules/workflow";
import { stageAPI } from "../../../api/modules/stage";
import { taskAPI } from "../../../api/modules/task";
import toast from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";
import Layout from "../../../components/layout/Layout";

const WfDetails = () => {
  const { colors } = useTheme();
  const { id } = useParams();
  const [workflow, setWorkflow] = useState(null);
  const [stages, setStages] = useState([]);
  const [tasks, setTasks] = useState({});
  const [expandedStages, setExpandedStages] = useState({});

  const fetchWorkflow = async () => {
    try {
      const res = await workflowAPI.getById(id);
      setWorkflow(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Workflow alınamadı");
    }
  };

  const fetchStages = async () => {
    try {
      const res = await stageAPI.getAll();
      const stageList = Array.isArray(res.data.data) ? res.data.data : [];
      const filteredStages = stageList.filter(
        (s) => s.workflowId === Number(id)
      );
      setStages(filteredStages);
    } catch (err) {
      console.error(err);
      toast.error("Aşamalar alınamadı");
    }
  };

  const fetchTasksForStage = async (stageId) => {
    if (tasks[stageId]) return; // zaten alındıysa tekrar fetch etme
    try {
      const res = await taskAPI.getTasksByStage(stageId);
      setTasks((prev) => ({ ...prev, [stageId]: res.data.data || [] }));
    } catch (err) {
      console.error(err);
      toast.error("Görevler alınamadı");
    }
  };

  const toggleStage = (stageId) => {
    setExpandedStages((prev) => {
      const expanded = !prev[stageId];
      if (expanded) fetchTasksForStage(stageId);
      return { ...prev, [stageId]: expanded };
    });
  };

  useEffect(() => {
    fetchWorkflow();
    fetchStages();
  }, [id]);

  if (!workflow) return <div>Yükleniyor...</div>;

  return (
    <Layout>
      <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
        <h1 style={{ color: colors.text }}>{workflow.name}</h1>
        <h2 style={{ color: colors.text }}>
          {workflow.creator?.name} {workflow.creator?.surname}
        </h2>

        {stages.length > 0 ? (
          stages.map((stage) => (
            <div key={stage.id} style={{ marginBottom: 16 }}>
              <div
                onClick={() => toggleStage(stage.id)}
                style={{
                  color: colors.text,
                  cursor: "pointer",
                  fontWeight: "bold",
                  border: "1px solid #ccc",
                  padding: 8,
                  borderRadius: 6,
                }}
              >
                {stage.name}
              </div>

              {expandedStages[stage.id] && (
                <div style={{ marginLeft: 16, marginTop: 8 }}>
                  {tasks[stage.id]?.length > 0 ? (
                    tasks[stage.id].map((task) => (
                      <div
                        key={task.id}
                        style={{
                          border: "1px solid #eee",
                          padding: 6,
                          marginBottom: 4,
                          borderRadius: 4,
                        }}
                      >
                        <div>
                          <strong 
                           style={{
                          color:colors.text
                        }}>{task.title}</strong>
                        </div>
                        <div 
                        style={{
                          color:colors.text
                        }}>
                          {task.description || "Açıklama yok"}</div>
                        <div
                         style={{
                          color:colors.text
                        }}>Deadline: {task.deadline || "Yok"}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: colors.text }}>Task yok</div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ color: colors.text }}>Stage yok</div>
        )}
      </div>
    </Layout>
  );
};

export default WfDetails;
