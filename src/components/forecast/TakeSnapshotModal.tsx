import React, { useState } from 'react';
import { Camera, X, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

interface TakeSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (version: string, author: string, summary: string) => void;
  workspaceName: string;
  projectCount: number;
}

export const TakeSnapshotModal: React.FC<TakeSnapshotModalProps> = ({
  isOpen,
  onClose,
  onSave,
  workspaceName,
  projectCount,
}) => {
  const [version, setVersion] = useState(`v1.3 - Fortnight Oct 12 Baseline`);
  const [author, setAuthor] = useState('Marcus Vance');
  const [summary, setSummary] = useState('Fortnight resource and shift baseline record for audit compliance.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!version.trim()) return;
    onSave(version.trim(), author.trim() || 'Senior Project Manager', summary.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0073ea] flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e293b]">Take Forecast Snapshot</h3>
              <p className="text-[11px] text-[#64748b]">
                {workspaceName} · {projectCount} Projects
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#64748b] hover:text-[#1e293b] rounded-md hover:bg-[#f1f5f9] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#334155] block">
              Snapshot Version Tag <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. v1.3 - Week 42 Baseline"
              required
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-xs font-medium text-[#1e293b] focus:outline-none focus:border-[#0073ea]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#334155] block">
              Created By (Author)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your Name / Role"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-xs font-medium text-[#1e293b] focus:outline-none focus:border-[#0073ea]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#334155] block">
              Summary / Adjustment Rationale
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="e.g. Approved shift reallocations for excavation sequence."
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-xs font-medium text-[#1e293b] focus:outline-none focus:border-[#0073ea]"
            />
          </div>

          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] text-[11px] text-[#64748b] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00c875] shrink-0" />
            <span>
              This will create an immutable audit record of current budget and roster allocations.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#cbd5e1] rounded-lg text-xs font-semibold text-[#64748b] hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0073ea] hover:bg-[#0060c0] text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Record Snapshot</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
