import React, { useEffect, useState } from 'react';
import { assignAPI } from '../../../api/modules/assign';
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
  ChevronUp,
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

const AllAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAssignments, setExpandedAssignments] = useState({});
  const [expandedStages, setExpandedStages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { colors } = useTheme();

  useEffect(() => {
    fetchAllAssignments();
  }, []);

  const fetchAllAssignments = async () => {
    try {
      setLoading(true);
      const res = await assignAPI.all();
      setAssignments(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Başvurular yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const toggleAssignment = (assignmentId) => {
    setExpandedAssignments(prev => ({
      ...prev,
      [assignmentId]: !prev[assignmentId]
    }));
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

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.candidate.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.candidate.user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.candidate.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.workflow.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    
    const status = getStatusBadge(assignment.stages);
    return matchesSearch && status.text.toLowerCase().includes(statusFilter.toLowerCase());
  });

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

  return (
    <Layout>
      <div
        className="min-h-screen p-4 md:p-6 lg:p-8"
        style={{ backgroundColor: colors.bg }}
      >
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users size={32} style={{ color: colors.primary }} />
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: colors.text }}
            >
              Tüm Başvurular
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Sisteme kayıtlı tüm aday başvurularını görüntüleyin ve yönetin
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto mb-6">
          <div
            className="rounded-xl p-4 shadow-md"
            style={{ backgroundColor: colors.bgsoft }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Aday adı, email veya iş akışı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.bg,
                    color: colors.text
                  }}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter size={20} style={{ color: colors.primary }} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.bg,
                    color: colors.text
                  }}
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="beklemede">Beklemede</option>
                  <option value="devam">Devam Ediyor</option>
                  <option value="reddedildi">Reddedildi</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className="rounded-xl p-4 shadow-md"
              style={{ backgroundColor: colors.bgsoft }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Toplam Başvuru</p>
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>
                    {assignments.length}
                  </p>
                </div>
                <Briefcase size={32} style={{ color: colors.primary }} />
              </div>
            </div>

            <div
              className="rounded-xl p-4 shadow-md"
              style={{ backgroundColor: colors.bgsoft }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Beklemede</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {assignments.filter(a => getStatusBadge(a.stages).text === 'Beklemede').length}
                  </p>
                </div>
                <Clock size={32} className="text-yellow-500" />
              </div>
            </div>

            <div
              className="rounded-xl p-4 shadow-md"
              style={{ backgroundColor: colors.bgsoft }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Devam Eden</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {assignments.filter(a => getStatusBadge(a.stages).text === 'Devam Ediyor').length}
                  </p>
                </div>
                <CheckCircle size={32} className="text-blue-500" />
              </div>
            </div>

            <div
              className="rounded-xl p-4 shadow-md"
              style={{ backgroundColor: colors.bgsoft }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Reddedilen</p>
                  <p className="text-2xl font-bold text-red-500">
                    {assignments.filter(a => getStatusBadge(a.stages).text === 'Reddedildi').length}
                  </p>
                </div>
                <XCircle size={32} className="text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="max-w-7xl mx-auto">
          {filteredAssignments.length > 0 ? (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => {
                const isExpanded = expandedAssignments[assignment.id];
                const status = getStatusBadge(assignment.stages);
                const stages = assignment.stages || [];

                return (
                  <div
                    key={assignment.id}
                    className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border"
                    style={{
                      backgroundColor: colors.bgsoft,
                      borderColor: colors.bg
                    }}
                  >
                    {/* Assignment Header */}
                    <div
                      className="p-6 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => toggleAssignment(assignment.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Avatar */}
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                            style={{
                              backgroundColor: colors.primary,
                              color: colors.bgsoft
                            }}
                          >
                            {assignment.candidate.user.name.charAt(0)}
                            {assignment.candidate.user.surname.charAt(0)}
                          </div>

                          {/* Candidate Info */}
                          <div className="flex-1">
                            <h3
                              className="text-xl font-bold mb-1"
                              style={{ color: colors.text }}
                            >
                              {assignment.candidate.user.name} {assignment.candidate.user.surname}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Mail size={14} />
                                {assignment.candidate.user.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone size={14} />
                                {assignment.candidate.phone}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                {assignment.candidate.city}
                              </div>
                            </div>
                            <div className="mt-2">
                              <span
                                className="text-sm font-medium px-3 py-1 rounded-lg"
                                style={{
                                  backgroundColor: colors.bg,
                                  color: colors.primary
                                }}
                              >
                                {assignment.workflow.name}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status and Date */}
                        <div className="flex flex-col items-end gap-3">
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${status.bgColor} ${status.color}`}
                          >
                            {status.icon}
                            <span>{status.text}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={14} />
                            {new Date(assignment.assignedAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          {isExpanded ? (
                            <ChevronUp size={24} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={24} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content - Stages */}
                    {isExpanded && (
                      <div
                        className="border-t p-6"
                        style={{ borderColor: colors.bg }}
                      >
                        <h4
                          className="text-lg font-semibold mb-4 flex items-center gap-2"
                          style={{ color: colors.text }}
                        >
                          <CheckCircle size={20} style={{ color: colors.primary }} />
                          Aşamalar ({stages.length})
                        </h4>

                        {stages.length > 0 ? (
                          <div className="space-y-3">
                            {stages.map((stage, index) => {
                              const isStageExpanded = expandedStages[stage.id];
                              const hasTasks = stage.tasks && stage.tasks.length > 0;

                              return (
                                <div
                                  key={stage.id}
                                  className="rounded-lg border overflow-hidden"
                                  style={{
                                    backgroundColor: colors.bg,
                                    borderColor: colors.bgsoft
                                  }}
                                >
                                  <div
                                    className="p-3 cursor-pointer hover:opacity-90"
                                    onClick={() => hasTasks && toggleStage(stage.id)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                          style={{
                                            backgroundColor: colors.primary,
                                            color: colors.bgsoft
                                          }}
                                        >
                                          {index + 1}
                                        </div>
                                        <div>
                                          <h5
                                            className="font-semibold"
                                            style={{ color: colors.text }}
                                          >
                                            {stage.stageName}
                                          </h5>
                                          <div className="flex items-center gap-2 mt-1">
                                            {getStageStatusIcon(stage.status)}
                                            <span className="text-xs text-gray-500">
                                              {hasTasks ? `${stage.tasks.length} görev` : 'Görev yok'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      {hasTasks && (
                                        isStageExpanded ? (
                                          <ChevronUp size={20} className="text-gray-400" />
                                        ) : (
                                          <ChevronDown size={20} className="text-gray-400" />
                                        )
                                      )}
                                    </div>
                                  </div>

                                  {hasTasks && isStageExpanded && (
                                    <div
                                      className="border-t p-3 space-y-2"
                                      style={{ borderColor: colors.bgsoft }}
                                    >
                                      {stage.tasks.map((task) => (
                                        <div
                                          key={task.id}
                                          className="rounded p-2 text-sm flex items-center justify-between"
                                          style={{ backgroundColor: colors.bgsoft }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <FileText size={16} style={{ color: colors.primary }} />
                                            <span style={{ color: colors.text }}>
                                              Görev ID: {task.stageTasksId}
                                            </span>
                                          </div>
                                          {getStageStatusIcon(task.status)}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            Bu başvuru için henüz aşama tanımlanmamış
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="rounded-2xl shadow-lg p-12 text-center"
              style={{ backgroundColor: colors.bgsoft }}
            >
              <Briefcase size={64} className="mx-auto mb-4 text-gray-400" />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: colors.text }}
              >
                Başvuru Bulunamadı
              </h3>
              <p className="text-gray-500">
                Arama kriterlerinize uygun başvuru bulunmamaktadır.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllAssignments;