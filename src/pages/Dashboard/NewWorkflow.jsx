import Layout from "../../components/layout/Layout";
import WorkflowList from "../../components/workflow/WorkflowList";
import CreateWorkflowButton from "../../components/workflow/CreateWorkflowButton";

export default function NewWorkflow() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* başlık ve oluştur button */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-2xl font-semibold text-gray-800">Şablon Yönetimi</h1>
          <CreateWorkflowButton />
        </div>
        <WorkflowList />
      </div>
    </Layout>
  );
}
