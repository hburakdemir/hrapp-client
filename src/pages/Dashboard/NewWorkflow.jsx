import Layout from "../../components/layout/Layout";
import WorkflowList from "../../components/workflow/WorkflowList";
import CreateWorkflowButton from "../../components/workflow/CreateWorkflowButton";
import { useTheme } from "../../context/ThemeContext";

export default function NewWorkflow() {
  const {colors} = useTheme();
  return (
    <Layout>
      <div className="p-6 lg:p-12 min-h-screen"
      style={{
        backgroundColor:colors.bg
      }}>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Şablon Yönetimi</h1>
          <CreateWorkflowButton />
        </div>
        <WorkflowList />
      </div>
    </Layout>
  );
}
