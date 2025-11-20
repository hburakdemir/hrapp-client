import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { workflowAPI } from "../../../api/modules/workflow";
import { stageAPI } from "../../../api/modules/stage";
import toast from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";
import Layout from "../../../components/layout/Layout";

const WfDetails = () => {
  const { colors } = useTheme();
  const { id } = useParams();
  const [template, setTemplate] = useState();
  const [stages, setStages] = useState();

  const fetchTemplate = async () => {
    try {
      const response = await workflowAPI.getById(id);
      setTemplate(response.data.data);
      // console.log("123", response.data);
      // console.log("123123", response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStages = async () => {
    try {
      const res = await stageAPI.getAll();
      const stageList = Array.isArray(res.data?.data) ? res.data.data : [];
      console.log("111", res.data.data);
      setStages(stageList);
    } catch (err) {
      console.error(err);
      toast.error("Aşamalar alınamadı.");
    }
  };

  useEffect(() => {
    fetchTemplate();
    fetchStages();
  }, [id]);

  if (!template) return <div> Yükleniyor...</div>;

  const filteredStages = stages
    ? stages.filter((stage) => stage.workflowId === Number(id))
    : [];

  return (
    <Layout>
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.bg,
      }}
    >
      <h1
        style={{
          color: colors.text,
        }}
      >
        {template.name}
      </h1>
      <h1
        style={{
          color: colors.text,
        }}
      >
        {template.id}
      </h1>
      <h1
        style={{
          color: colors.text,
        }}
      >
        {template.creator.name} {template.creator.surname}
      </h1>

      {filteredStages.length > 0 ? (
        filteredStages.map((stage) => (
          <h1
            key={stage.id}
            style={{
              color: colors.text,
            }}
          >
            {stage.name}{" "}
          </h1>
        ))
      ) : (
        <div
          style={{
            color: colors.text,
          }}
        >
          Henüz Aşama Yüklenmemiş
        </div>
      )}
    </div>
    </Layout>
  );
};

export default WfDetails;
