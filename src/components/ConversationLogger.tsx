import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { saveConversationLog, generateConversationSummary } from '../utils/api';

interface ConversationLoggerProps {
  onComplete?: (logId: number) => void;
  defaultCategory?: string;
}

const ConversationLogger: React.FC<ConversationLoggerProps> = ({ 
  onComplete,
  defaultCategory 
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(defaultCategory || '');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordingUrl(audioUrl);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(t('conversation_logger.recording_error'));
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleGenerateSummary = async () => {
    if (!content.trim()) {
      setError(t('conversation_logger.content_required'));
      return;
    }
    
    try {
      setIsGeneratingSummary(true);
      setError(null);
      
      const generatedSummary = await new Promise<string>((resolve) => {
        setTimeout(() => {
          const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
          const importantSentences = sentences.filter(s => 
            s.includes('important') || 
            s.includes('agreed') || 
            s.includes('deadline') || 
            s.includes('decision') ||
            s.length > 100
          );
          
          const summary = importantSentences.length > 0 
            ? importantSentences.join('. ') + '.'
            : sentences.slice(0, Math.min(3, sentences.length)).join('. ') + '.';
            
          resolve(summary);
        }, 1500);
      });
      
      setSummary(generatedSummary);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError(t('conversation_logger.summary_error'));
    } finally {
      setIsGeneratingSummary(false);
    }
  };
  
  const handleSave = async () => {
    if (!title.trim()) {
      setError(t('conversation_logger.title_required'));
      return;
    }
    
    if (!content.trim() && !recordingUrl) {
      setError(t('conversation_logger.content_or_recording_required'));
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      const logData = {
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim(),
        recordingUrl: recordingUrl || undefined,
        date: new Date().toISOString(),
        category: category || undefined,
        tags: tags.length > 0 ? tags : undefined
      };
      
      const savedLog = await saveConversationLog(logData);
      
      setSuccess(true);
      
      if (!summary && content.trim() && savedLog.id) {
        try {
          const summaryResult = await generateConversationSummary(savedLog.id);
          setSummary(summaryResult.summary);
        } catch (summaryErr) {
          console.error('Error generating summary after save:', summaryErr);
        }
      }
      
      if (onComplete && savedLog.id) {
        onComplete(savedLog.id);
      }
      
      setTimeout(() => {
        setTitle('');
        setContent('');
        setCategory(defaultCategory || '');
        setTags([]);
        setRecordingUrl(null);
        setSummary('');
        setSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error saving conversation log:', err);
      setError(t('conversation_logger.save_error'));
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-right">{t('conversation_logger.title')}</h2>
      <p className="text-gray-600 mb-6 text-right">{t('conversation_logger.description')}</p>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
          <p className="text-green-700">{t('conversation_logger.save_success')}</p>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 text-right mb-1">
            {t('conversation_logger.log_title')} *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 rtl:text-right"
            placeholder={t('conversation_logger.title_placeholder')}
            dir="rtl"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 text-right mb-1">
            {t('conversation_logger.category')}
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 rtl:text-right"
            dir="rtl"
          >
            <option value="">{t('conversation_logger.select_category')}</option>
            <option value="Health">{t('categories.health')}</option>
            <option value="Finance">{t('categories.finance')}</option>
            <option value="Legal">{t('categories.legal')}</option>
            <option value="Education">{t('categories.education')}</option>
            <option value="Work">{t('categories.work')}</option>
            <option value="Personal">{t('categories.personal')}</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 text-right mb-1">
            {t('conversation_logger.conversation_content')}
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 rtl:text-right"
            placeholder={t('conversation_logger.content_placeholder')}
            dir="rtl"
          ></textarea>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-4 py-2 rounded-md ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
                  {t('conversation_logger.stop_recording')} ({formatTime(recordingTime)})
                </>
              ) : (
                t('conversation_logger.start_recording')
              )}
            </button>
            
            {recordingUrl && (
              <div className="mt-2">
                <audio src={recordingUrl} controls className="w-full"></audio>
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary || !content.trim()}
            className={`px-4 py-2 rounded-md ${
              isGeneratingSummary || !content.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isGeneratingSummary ? (
              <>
                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
                {t('conversation_logger.generating')}
              </>
            ) : (
              t('conversation_logger.generate_summary')
            )}
          </button>
        </div>
        
        {summary && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2 text-right">{t('conversation_logger.summary')}</h3>
            <p className="text-blue-700 text-right">{summary}</p>
          </div>
        )}
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 text-right mb-1">
            {t('conversation_logger.tags')}
          </label>
          <div className="flex">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2 border rounded-r-none rounded-md focus:ring-blue-500 focus:border-blue-500 rtl:text-right"
              placeholder={t('conversation_logger.tags_placeholder')}
              dir="rtl"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-500 text-white rounded-l-none rounded-md hover:bg-blue-600"
            >
              {t('common.add')}
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="mr-1 ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-md ${
              isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isSaving ? (
              <>
                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
                {t('common.saving')}
              </>
            ) : (
              t('common.save')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationLogger;
