import { useState } from 'react';
import { taskAPI } from '../../api/modules/task';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onDelete, colors }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getTaskTypeIcon = (type) => {
    switch (type) {
      case 'FILE_UPLOAD': return '📁';
      case 'IMAGE_UPLOAD': return '🖼️';
      case 'DATE_SELECTION': return '📅';
      case 'CASE_ASSIGNMENT': return '📋';
      case 'MESSAGE': return '💬';
      default: return '📝';
    }
  };

  const getTaskTypeName = (type) => {
    switch (type) {
      case 'FILE_UPLOAD': return 'Dosya Yükleme';
      case 'IMAGE_UPLOAD': return 'Resim Yükleme';
      case 'DATE_SELECTION': return 'Tarih Seçimi';
      case 'CASE_ASSIGNMENT': return 'Case Çalışması';
      case 'MESSAGE': return 'Mesaj/Soru';
      default: return type;
    }
  };

  const getTaskStatusColor = (isRequired) => {
    return isRequired ? '#EF4444' : '#10B981'; // red : green
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await taskAPI.deleteTask(task.id);
      toast.success('Görev başarıyla silindi');
      onDelete();
    } catch (err) {
      toast.error('Görev silinirken hata oluştu');
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="border rounded-lg overflow-hidden transition-all duration-200"
      style={{ 
        backgroundColor: colors.bgsoft, 
        borderColor: colors.border 
      }}
    >
      {/* Task Header */}
      <div 
        className="p-3 cursor-pointer hover:opacity-80"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-xl">{getTaskTypeIcon(task.type)}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium" style={{ color: colors.text }}>
                  {task.title}
                </h4>
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: getTaskStatusColor(task.isRequired) + '20',
                    color: getTaskStatusColor(task.isRequired)
                  }}
                >
                  {task.isRequired ? 'Zorunlu' : 'Opsiyonel'}
                </span>
              </div>
              <p className="text-sm" style={{ color: colors.textSoft }}>
                {getTaskTypeName(task.type)}
              </p>
              {task.deadline && (
                <p className="text-xs mt-1" style={{ color: colors.textSoft }}>
                  ⏰ Son tarih: {formatDate(task.deadline)}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Edit functionality eklenebilir
                toast.info('Düzenleme özelliği yakında eklenecek');
              }}
              className="px-2 py-1 rounded text-xs bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Düzenle
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="px-2 py-1 rounded text-xs bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Siliniyor...' : 'Sil'}
            </button>
          </div>
        </div>
      </div>

      {/* Task Details */}
      {isExpanded && (
        <div 
          className="border-t p-3 space-y-3"
          style={{ borderColor: colors.border }}
        >
          {task.description && (
            <div>
              <h5 className="font-medium text-sm mb-1" style={{ color: colors.text }}>
                Açıklama:
              </h5>
              <p className="text-sm" style={{ color: colors.textSoft }}>
                {task.description}
              </p>
            </div>
          )}

          {task.caseContent && (
            <div>
              <h5 className="font-medium text-sm mb-1" style={{ color: colors.text }}>
                Case İçeriği:
              </h5>
              <div 
                className="text-sm p-2 rounded whitespace-pre-wrap"
                style={{ 
                  backgroundColor: colors.bg, 
                  color: colors.textSoft,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                {task.caseContent}
              </div>
            </div>
          )}

          {task.scheduledDate && (
            <div>
              <h5 className="font-medium text-sm mb-1" style={{ color: colors.text }}>
                Planlanan Tarih:
              </h5>
              <p className="text-sm" style={{ color: colors.textSoft }}>
                📅 {formatDate(task.scheduledDate)}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: colors.border }}>
            <div className="text-xs" style={{ color: colors.textSoft }}>
              Oluşturulma: {formatDate(task.createdAt)}
            </div>
            <div className="text-xs" style={{ color: colors.textSoft }}>
              ID: {task.id}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;