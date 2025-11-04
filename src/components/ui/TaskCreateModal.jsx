import { useState } from 'react';
import { taskAPI } from '../../api/modules/task';
import toast from 'react-hot-toast';

const TaskCreateModal = ({ stageId, onClose, onTaskCreated, colors }) => {
  const [formData, setFormData] = useState({
    type: 'FILE_UPLOAD',
    title: '',
    description: '',
    deadline: '',
    scheduledDate: '',
    caseContent: '',
    isRequired: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskTypes = [
    { value: 'FILE_UPLOAD', label: 'Dosya Yükleme', icon: '📁' },
    { value: 'IMAGE_UPLOAD', label: 'Resim Yükleme', icon: '🖼️' },
    { value: 'DATE_SELECTION', label: 'Tarih Seçimi', icon: '📅' },
    { value: 'CASE_ASSIGNMENT', label: 'Case Çalışması', icon: '📋' },
    { value: 'MESSAGE', label: 'Mesaj/Soru', icon: '💬' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatDateTimeLocal = (date) => {
    if (!date) return '';
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Görev başlığı zorunludur');
      return;
    }

    if (formData.type === 'CASE_ASSIGNMENT' && !formData.caseContent.trim()) {
      toast.error('Case çalışması için içerik zorunludur');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        caseContent: formData.caseContent.trim() || undefined,
        deadline: formData.deadline || undefined,
        scheduledDate: formData.scheduledDate || undefined
      };

      await taskAPI.createTask(stageId, payload);
      toast.success('Görev başarıyla oluşturuldu');
      onTaskCreated();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Görev oluşturulurken hata oluştu';
      toast.error(errorMessage);
      console.error('Task creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDefaultDateTime = (hours = 23, minutes = 59) => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 1 hafta sonra
    date.setHours(hours, minutes, 0, 0);
    return formatDateTimeLocal(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.bgsoft }}
      >
        {/* Modal Header */}
        <div 
          className="flex justify-between items-center p-6 border-b"
          style={{ borderColor: colors.border }}
        >
          <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
            Yeni Görev Oluştur
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Görev Türü
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {taskTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.type === type.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ 
                    backgroundColor: formData.type === type.value 
                      ? colors.primary + '10' 
                      : colors.bg,
                    borderColor: formData.type === type.value 
                      ? colors.primary 
                      : colors.border
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-sm" style={{ color: colors.text }}>
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Görev Başlığı *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              style={{ 
                backgroundColor: colors.bg, 
                color: colors.text, 
                borderColor: colors.border 
              }}
              placeholder="Görev başlığını girin"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border rounded-lg"
              style={{ 
                backgroundColor: colors.bg, 
                color: colors.text, 
                borderColor: colors.border 
              }}
              placeholder="Görev açıklamasını girin"
            />
          </div>

          {/* Case Content (only for CASE_ASSIGNMENT) */}
          {formData.type === 'CASE_ASSIGNMENT' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Case İçeriği *
              </label>
              <textarea
                name="caseContent"
                value={formData.caseContent}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-3 border rounded-lg font-mono text-sm"
                style={{ 
                  backgroundColor: colors.bg, 
                  color: colors.text, 
                  borderColor: colors.border 
                }}
                placeholder="Case çalışması detaylarını girin. Markdown formatını kullanabilirsiniz."
                required
              />
              <p className="text-xs mt-1" style={{ color: colors.textSoft }}>
                Case çalışması türü seçildiğinde bu alan zorunludur
              </p>
            </div>
          )}

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Son Tarih
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              style={{ 
                backgroundColor: colors.bg, 
                color: colors.text, 
                borderColor: colors.border 
              }}
              min={formatDateTimeLocal(new Date())}
            />
            <p className="text-xs mt-1" style={{ color: colors.textSoft }}>
              Boş bırakılırsa son tarih olmayacak
            </p>
          </div>

          {/* Scheduled Date (only for DATE_SELECTION) */}
          {formData.type === 'DATE_SELECTION' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Önerilen Tarih
              </label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                style={{ 
                  backgroundColor: colors.bg, 
                  color: colors.text, 
                  borderColor: colors.border 
                }}
                min={formatDateTimeLocal(new Date())}
              />
              <p className="text-xs mt-1" style={{ color: colors.textSoft }}>
                Tarih seçimi görevi için önerilen tarih
              </p>
            </div>
          )}

          {/* Required */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isRequired"
              id="isRequired"
              checked={formData.isRequired}
              onChange={handleInputChange}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="isRequired" className="text-sm" style={{ color: colors.text }}>
              Bu görev zorunludur
            </label>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                deadline: getDefaultDateTime() 
              }))}
              className="text-xs px-3 py-1 rounded border"
              style={{ 
                backgroundColor: colors.bg, 
                color: colors.text, 
                borderColor: colors.border 
              }}
            >
              📅 1 Hafta Sonra
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                scheduledDate: getDefaultDateTime(14, 0) 
              }))}
              className="text-xs px-3 py-1 rounded border"
              style={{ 
                backgroundColor: colors.bg, 
                color: colors.text, 
                borderColor: colors.border 
              }}
            >
              🕐 14:00 Ayarla
            </button>
          </div>
        </form>

        {/* Modal Footer */}
        <div 
          className="flex justify-end gap-3 p-6 border-t"
          style={{ borderColor: colors.border }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            style={{ 
              color: colors.text, 
              borderColor: colors.border 
            }}
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Oluşturuluyor...' : 'Görev Oluştur'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCreateModal;