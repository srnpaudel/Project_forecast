import React, { useState } from 'react';
import { Project, ForecastNote } from '../../types/resourceForecast';
import { X, MessageSquare, Send } from 'lucide-react';

interface ProjectNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onAddNote: (projectId: string, note: Omit<ForecastNote, 'id' | 'timestamp'>) => void;
}

export const ProjectNotesModal: React.FC<ProjectNotesModalProps> = ({
  isOpen,
  onClose,
  project,
  onAddNote,
}) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Marcus Vance');
  const [type, setType] = useState<ForecastNote['type']>('shift');

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddNote(project.id, {
      projectId: project.id,
      author,
      role: 'Project Planner',
      content: content.trim(),
      type,
    });

    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-[#e6e9ef] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f2f7] flex items-center justify-between bg-[#fafbfd]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#676879]">
              <MessageSquare className="w-3.5 h-3.5 text-[#0073ea]" />
              <span>FORECAST NOTES</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#0073ea] font-medium">{project.code}</span>
            </div>
            <h3 className="text-base font-bold text-[#323338]">
              {project.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#676879] hover:text-[#323338] rounded-md hover:bg-[#f5f6f8] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Notes Feed */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {project.notes.length === 0 ? (
            <div className="text-center py-10 text-[#808294] text-xs space-y-1">
              <p>No forecast notes recorded yet for this project.</p>
              <p className="text-[11px]">
                Record shift changes, weather disruptions, or budget remarks below.
              </p>
            </div>
          ) : (
            project.notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-lg bg-[#f9fafc] border border-[#e6e9ef] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#323338]">{note.author}</span>
                    <span className="text-[11px] text-[#808294]">({note.role})</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-medium ${
                        note.type === 'shift'
                          ? 'bg-[#fff8e1] text-[#b45309]'
                          : note.type === 'budget'
                          ? 'bg-[#eaf4fe] text-[#0073ea]'
                          : note.type === 'risk'
                          ? 'bg-[#ffebee] text-[#e2445c]'
                          : 'bg-[#f5f6f8] text-[#676879]'
                      }`}
                    >
                      {note.type}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#808294]">{note.timestamp}</span>
                </div>
                <p className="text-[#4b4d58] leading-relaxed font-sans">{note.content}</p>
              </div>
            ))
          )}
        </div>

        {/* New Note Form */}
        <form onSubmit={handleSubmit} className="p-5 border-t border-[#f0f2f7] bg-[#fafbfd] space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-[#323338]">Append Forecast Note</span>
            
            <div className="flex items-center gap-1 text-[11px] font-mono">
              {(['shift', 'budget', 'risk', 'general'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                    type === t ? 'bg-[#0073ea] text-white font-semibold' : 'text-[#676879] hover:bg-[#f5f6f8]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={2}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type note regarding shift staffing, plant availability, or budget variance..."
            className="w-full px-3 py-2 text-xs bg-white border border-[#d0d4e4] rounded-md text-[#323338] placeholder-[#808294] focus:outline-none focus:border-[#0073ea] resize-none"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#676879]">
              <span>Author:</span>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="px-2 py-0.5 text-xs bg-white border border-[#d0d4e4] rounded text-[#323338]"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0073ea] hover:bg-[#0060c0] text-white text-xs font-semibold rounded-md transition-all shadow-xs cursor-pointer"
            >
              <span>Add Note</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
