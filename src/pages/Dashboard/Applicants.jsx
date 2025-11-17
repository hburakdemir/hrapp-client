import { useEffect, useState } from "react";
import { workflowAPI } from "../../api/modules/workflow";
import Layout from "../../components/layout/Layout";
import { useTheme } from "../../context/ThemeContext";

function WorkflowAssignmentsList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  const fetchAssignments = async () => {
    try {
      const res = await workflowAPI.getAllAssignments();
      if (res.data?.success) {
        setAssignments(res.data.data);
      }
    } catch (err) {
      console.error("Hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);
  if (loading) return <p>Yükleniyor...</p>;

  return (
    <Layout>
      <div
        className="p-6 lg:p-12 min-h-screen relative"
        style={{ backgroundColor: colors.bg }}
      >
        <h2
          className="text-xl font-semibold mb-4 inline-block  "
          style={{ color: colors.text }}
        >
          Workflow Atamaları
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-lg" style={{ color: colors.text }}>
              Yükleniyor...
            </p>
          </div>
        ) : assignments.length === 0 ? (
          <p style={{ color: colors.text }}>Kayıt bulunamadı.</p>
        ) : (
          <div className=" lg:block">
            <div
              className="rounded-xl shadow-sm overflow-hidden"
              style={{ backgroundColor: colors.bgsoft }}
            >
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th
                      className="px-6 py-4 text-center  font-medium"
                      style={{
                        color: colors.text,
                        backgroundColor: colors.bgsoft,
                      }}
                    >
                      Aday
                    </th>
                    <th
                      className="px-6 py-4 text-center  font-medium"
                      style={{
                        color: colors.text,
                        backgroundColor: colors.bgsoft,
                      }}
                    >
                      Şablon
                    </th>
                    <th
                      className="px-6 py-4 text-center font-medium"
                      style={{
                        color: colors.text,
                        backgroundColor: colors.bgsoft,
                      }}
                    >
                      Atayan
                    </th>
                    <th
                      className="px-6 py-4 text-center  font-medium"
                      style={{
                        color: colors.text,
                        backgroundColor: colors.bgsoft,
                      }}
                    >
                      Atama Tarihi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {assignments.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t transition-colors hover:bg-opacity-50"
                      style={{
                        borderColor: colors.bg,
                        color: colors.text,
                      }}
                    >
                      {/* aday */}
                      <td className="px-6 py-4 text-center ">
                        {item.candidate?.user?.name}{" "}
                        {item.candidate?.user?.surname}
                      </td>

                      {/* wf */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className="px-4 py-2 text-sm text-center font-medium rounded-full"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.primary,
                          }}
                        >
                          {item.workflow?.name}
                        </span>
                      </td>

                      {/* assignedby */}
                      <td className="px-6 py-4 text-center ">
                        {item.assignedByUser?.name}{" "}
                        {item.assignedByUser?.surname}
                      </td>

                      {/* date time */}
                      <td className="px-6 py-4 text-center">
                        {new Date(item.assignedAt).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default WorkflowAssignmentsList;
