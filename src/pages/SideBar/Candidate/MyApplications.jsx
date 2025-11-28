import React, { useEffect, useState } from 'react';
import { assignAPI } from '../../../api/modules/assign';
import { authAPI } from '../../../api/modules/auth';
import { useTheme } from '../../../context/ThemeContext';
import Layout from '../../../components/layout/Layout';
import { 
  ChevronRight, 
  User, 
  Calendar, 
  Building2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Briefcase,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const [profileComplete, setProfileComplete] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedStages, setExpandedStages] = useState({});
  const { colors } = useTheme();

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const res = await authAPI.getProfileStatus();
        setProfileComplete(res.data.data.isProfileComplete);
      } catch (err) {
        console.error(err);
      }
    };

    checkProfileStatus();
  }, []);

  useEffect(() => {
    if (profileComplete) {
      fetchAssignment();
    }
  }, [profileComplete]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const res = await assignAPI.myAssign();
      setAssignment(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Başvuru bilgileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const toggleStage = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const getStatusBadge = (stages) => {
    if (!stages || stages.length === 0) {
      return {
        text: 'Başlamadı',
        icon: <Clock size={16} />,
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-800'
      };
    }

    const hasApproved = stages.some(s => s.status === 'APPROVED');
    const hasDenied = stages.some(s => s.status === 'DENIED');
    const allPending = stages.every(s => s.status === 'PENDING');

    if (hasDenied) {
      return {
        text: 'Reddedildi',
        icon: <XCircle size={16} />,
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      };
    }

    if (hasApproved) {
      return {
        text: 'Devam Ediyor',
        icon: <Clock size={16} />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20'
      };
    }

    if (allPending) {
      return {
        text: 'Beklemede',
        icon: <Clock size={16} />,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
      };
    }

    return {
      text: 'İşlemde',
      icon: <Clock size={16} />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    };
  };

  const getStageStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'DENIED':
        return <XCircle size={20} className="text-red-600" />;
      case 'PENDING':
      default:
        return <Clock size={20} className="text-yellow-600" />;
    }
  };

  const getTaskStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          text: 'Tamamlandı',
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900/20'
        };
      case 'DENIED':
        return {
          text: 'Reddedildi',
          color: 'text-red-600',
          bgColor: 'bg-red-100 dark:bg-red-900/20'
        };
      case 'PENDING':
      default:
        return {
          text: 'Beklemede',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
        };
    }
  };

  if (!profileComplete) {
    return (
      <Layout>
        <div
          className="flex justify-center items-center min-h-screen"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          <div className="text-center p-8 rounded-2xl shadow-lg" style={{ backgroundColor: colors.bgsoft }}>
            <Building2 size={64} className="mx-auto mb-4" style={{ color: colors.primary }} />
            <p className="text-xl font-semibold" style={{ color: colors.text }}>
              Profilinizi tamamlamanız gerekmektedir.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div
          className="flex justify-center items-center min-h-screen"
          style={{ backgroundColor: colors.bg }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!assignment) {
    return (
      <Layout>
        <div
          className="min-h-screen p-4 md:p-6 lg:p-8"
          style={{ backgroundColor: colors.bg }}
        >
          <div className="max-w-7xl mx-auto">
            <div
              className="rounded-2xl shadow-lg p-12 text-center"
              style={{ backgroundColor: colors.bgsoft }}
            >
              <Briefcase
                size={64}
                className="mx-auto mb-4 text-gray-400"
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: colors.text }}
              >
                Henüz Başvurunuz Bulunmuyor
              </h3>
              <p className="text-gray-500">
                Size atanmış herhangi bir iş başvurusu bulunmamaktadır.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const status = getStatusBadge(assignment.workflow?.stages);
  const stages = assignment.workflow?.stages || [];

  return (
    <Layout>
      <div
        className="min-h-screen p-4 md:p-6 lg:p-8"
        style={{ backgroundColor: colors.bg }}
      >
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase size={32} style={{ color: colors.primary }} />
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: colors.text }}
            >
              Başvurularım
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            İş başvurunuzu ve görevlerinizi buradan takip edebilirsiniz
          </p>
        </div>

        {/* Application Card */}
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border"
            style={{
              backgroundColor: colors.bgsoft,
              borderColor: colors.bg
            }}
          >
            {/* Card Header */}
            <div
              className="p-6 md:p-8"
              style={{
                background: `linear-gradient(135deg, ${colors.bg}, ${colors.bgsoft})`
              }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h2
                    className="text-2xl md:text-3xl font-bold mb-3"
                    style={{ color: colors.text }}
                  >
                    {assignment.workflow?.name}
                  </h2>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${status.bgColor} ${status.color}`}
                  >
                    {status.icon}
                    <span>{status.text}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                    <Calendar size={16} style={{ color: colors.primary }} />
                    <span>
                      <span className="opacity-70">Başvuru:</span>{' '}
                      <span className="font-medium">
                        {new Date(assignment.assignedAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stages Section */}
            <div className="p-6 md:p-8">
              <h3
                className="text-xl font-semibold mb-6 flex items-center gap-2"
                style={{ color: colors.text }}
              >
                <CheckCircle size={24} style={{ color: colors.primary }} />
                Aşamalar ve Görevler
              </h3>

              {stages.length > 0 ? (
                <div className="space-y-4">
                  {stages.map((stage, index) => {
                    const isExpanded = expandedStages[stage.id];
                    const hasTasks = stage.tasks && stage.tasks.length > 0;

                    return (
                      <div
                        key={stage.id}
                        className="rounded-xl overflow-hidden border"
                        style={{
                          backgroundColor: colors.bg,
                          borderColor: colors.bgsoft
                        }}
                      >
                        {/* Stage Header */}
                        <div
                          className="p-4 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => hasTasks && toggleStage(stage.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                style={{
                                  backgroundColor: colors.primary,
                                  color: colors.bgsoft
                                }}
                              >
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4
                                  className="text-lg font-semibold"
                                  style={{ color: colors.text }}
                                >
                                  {stage.name}
                                  
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStageStatusIcon(stage.status)}
                                  <span className="text-sm text-gray-500">
                                    {hasTasks ? `${stage.tasks.length} görev` : 'Görev yok'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {hasTasks && (
                              <div className="ml-2">
                                {isExpanded ? (
                                  <ChevronUp size={24} className="text-gray-400" />
                                ) : (
                                  <ChevronDown size={24} className="text-gray-400" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tasks List */}
                        {hasTasks && isExpanded && (
                          <div
                            className="border-t p-4 space-y-3"
                            style={{ borderColor: colors.bgsoft }}
                          >
                            {stage.tasks.map((task) => {
                              const isOverdue = task.deadline && new Date(task.deadline) < new Date();
                              const taskStatus = getTaskStatusBadge(task.status);

                              return (
                                <div
                                  key={task.id}
                                  className="rounded-lg p-4 border-l-4 shadow-sm hover:shadow-md transition-shadow"
                                  style={{
                                    backgroundColor: colors.bgsoft,
                                    borderLeftColor: task.isRequired ? colors.primary : colors.text
                                  }}
                                >
                                  <div className="flex items-start gap-3">
                                    <FileText
                                      size={20}
                                      className="mt-1 flex-shrink-0"
                                      style={{ color: colors.primary }}
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <h5
                                          className="font-semibold text-base"
                                          style={{ color: colors.text }}
                                        >
                                          {task.title}
                                        </h5>
                                        <span
                                          className={`text-xs px-2 py-1 rounded whitespace-nowrap ${taskStatus.bgColor} ${taskStatus.color}`}
                                        >
                                          {taskStatus.text}
                                        </span>
                                      </div>

                                      {task.isRequired && (
                                        <div className="mb-2">
                                          <span className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/20 text-red-600 font-medium">
                                            Zorunlu Görev
                                          </span>
                                        </div>
                                      )}

                                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {task.description || 'Açıklama bulunmuyor'}
                                      </p>

                                      {task.deadline && (
                                        <div
                                          className={`flex items-center gap-2 text-sm ${
                                            isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
                                          }`}
                                        >
                                          <Calendar size={14} />
                                          <span>
                                            <span className="font-medium">Son Tarih:</span>{' '}
                                            {new Date(task.deadline).toLocaleDateString('tr-TR', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                            {isOverdue && (
                                              <span className="ml-2 font-semibold">(Gecikmiş!)</span>
                                            )}
                                          </span>
                                        </div>
                                      )}

                                      {task.status === 'PENDING' && (
                                        <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: colors.primary }}>
                                          <AlertCircle size={16} />
                                          <span className="font-medium">Bu görevi tamamlamanız bekleniyor</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* No Tasks Message */}
                        {!hasTasks && (
                          <div
                            className="border-t p-4 text-center text-sm text-gray-500"
                            style={{ borderColor: colors.bgsoft }}
                          >
                            Bu aşamada görev bulunmuyor
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  Bu başvuru için henüz aşama tanımlanmamış
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyApplications;