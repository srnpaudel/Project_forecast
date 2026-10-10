import React, { useState } from 'react';
import { ForecastSnapshot, Project } from '../../types/resourceForecast';
import {
  History,
  Camera,
  CheckCircle2,
  Calendar,
  User,
  Clock,
  TrendingUp,
  FileText,
  Plus,
  ArrowRight,
  ShieldCheck,
  Eye,
  X
} from 'lucide-react';

interface SnapshotsViewProps {
  snapshots: ForecastSnapshot[];
  onTakeSnapshot: (version: string, author: string, summary: string) => void;
  currentProjects: Project[];
  totalBudget: number;
  totalConsumed: number;
  totalRemaining: number;
  onNavigateToBoard: () => void;
}

export const SnapshotsView: React.FC<SnapshotsViewProps> = ({
  snapshots,
  onTakeSnapshot,
  currentProjects,
  totalBudget,
  totalConsumed,
  totalRemaining,
  onNavigateToBoard,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<ForecastSnapshot | null>(null);

  const [versionInput, setVersionInput] = useState('');
  const [authorInput, setAuthorInput] = useState('Marcus Vance');
  const [summaryInput, setSummaryInput] = useState('');

  const handleSubmitSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionInput.trim()) return;

    onTakeSnapshot(
      versionInput.trim(),
      authorInput.trim() || 'Site Superintendent',
      summaryInput.trim() || 'Baseline milestone update'
    );

    setVersionInput('');
    setSummaryInput('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#e6e9ef] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-[#f0f7ff] text-[#0073ea] font-semibold border border-[#b2d9fc]">
              PRD SECTION 8 COMPLIANCE
            </span>
            <span className="text-[#808294]">·</span>
            <span className="text-[#676879]">Immutable Audit Trail</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0073ea] hover:bg-[#0060c0] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture New Snapshot</span>
            </button>

            <button
              onClick={onNavigateToBoard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#475569] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg transition-colors cursor-pointer"
            >
              <span>Back to Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-[#0073ea]" />
            <span>Forecast History & Version Baselines</span>
          </h1>
          <p className="mt-1 text-sm text-[#64748b] leading-relaxed max-w-3xl">
            Immutable snapshot log capturing historical budget allocations, shift rostering, and site supervisor notes.
            Provides auditable evidence for tender milestones and contractor variation claims without touching WPX ERP.
          </p>
        </div>

        {/* Current State Summary Pill */}
        <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 font-sans font-bold text-[#1e293b]">
            <Clock className="w-4 h-4 text-[#0073ea]" />
            <span>Current Live Baseline:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[#475569]">
            <span>Active Projects: <strong className="text-[#1e293b]">{currentProjects.length}</strong></span>
            <span>Total Budget: <strong className="text-[#1e293b]">{totalBudget.toLocaleString()}h</strong></span>
            <span>Total Consumed: <strong className="text-[#0073ea]">{totalConsumed.toLocaleString()}h</strong></span>
            <span>
              Remaining:{' '}
              <strong className={totalRemaining < 0 ? 'text-[#e2445c]' : 'text-[#059669]'}>
                {totalRemaining < 0 ? `-${Math.abs(totalRemaining).toLocaleString()}h` : `+${totalRemaining.toLocaleString()}h`}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Snapshots Timeline Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider text-xs">
          Historical Version Milestones ({snapshots.length})
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {snapshots.map((snap) => {
            const isSelected = selectedSnapshot?.id === snap.id;

            return (
              <div
                key={snap.id}
                className={`bg-white border rounded-xl p-5 shadow-2xs transition-all space-y-4 ${
                  isSelected ? 'border-[#0073ea] ring-2 ring-[#0073ea]/10' : 'border-[#e6e9ef] hover:border-[#b2d9fc]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f1f5f9] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00c875]" />
                    <h3 className="font-bold text-sm text-[#1e293b] font-mono">{snap.version}</h3>
                    <span className="text-[11px] font-mono text-[#64748b] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#e2e8f0]">
                      {snap.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#64748b]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0073ea]" />
                      <span>{snap.createdAt}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#7c3aed]" />
                      <span>{snap.createdBy}</span>
                    </span>
                    <button
                      onClick={() => setSelectedSnapshot(isSelected ? null : snap)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#0073ea] hover:bg-[#f0f7ff] rounded-md transition-colors cursor-pointer border border-[#b2d9fc]"
                    >
                      {isSelected ? 'Hide Details' : 'View Snapshot Details'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#475569] leading-relaxed">{snap.summary}</p>

                {/* Metrics Pill */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
                  <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                    <div className="text-[10px] text-[#64748b] uppercase">Projects</div>
                    <div className="text-sm font-bold text-[#1e293b]">{snap.projectCount}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                    <div className="text-[10px] text-[#64748b] uppercase">Total Budget</div>
                    <div className="text-sm font-bold text-[#1e293b]">{snap.totalBudget.toLocaleString()}h</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                    <div className="text-[10px] text-[#64748b] uppercase">Total Consumed</div>
                    <div className="text-sm font-bold text-[#0073ea]">{snap.totalConsumed.toLocaleString()}h</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                    <div className="text-[10px] text-[#64748b] uppercase">Net Remaining</div>
                    <div className={`text-sm font-bold ${snap.totalRemaining < 0 ? 'text-[#e2445c]' : 'text-[#059669]'}`}>
                      {snap.totalRemaining < 0 ? `-${Math.abs(snap.totalRemaining).toLocaleString()}h` : `+${snap.totalRemaining.toLocaleString()}h`}
                    </div>
                  </div>
                </div>

                {/* Expanded Snapshot Project Table */}
                {isSelected && snap.projectsState && (
                  <div className="mt-4 pt-4 border-t border-[#f1f5f9] space-y-3">
                    <h4 className="text-xs font-bold text-[#1e293b] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#00c875]" />
                      <span>Captured Project States at this Baseline</span>
                    </h4>

                    <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8fafc] text-[#475569] font-bold border-b border-[#e2e8f0]">
                          <tr>
                            <th className="py-2 px-3">Code</th>
                            <th className="py-2 px-3">Project Name</th>
                            <th className="py-2 px-3">Builder</th>
                            <th className="py-2 px-3 text-right">Budget</th>
                            <th className="py-2 px-3 text-right">Consumed</th>
                            <th className="py-2 px-3 text-right">Remaining</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9]">
                          {snap.projectsState.map((p) => {
                            const b = (p.budgetHours || 0) + (p.variationHours || 0);
                            const rem = b - p.consumedHours;
                            return (
                              <tr key={p.id} className="hover:bg-[#f8fafc]">
                                <td className="py-2 px-3 font-mono font-bold text-[#0073ea]">{p.code}</td>
                                <td className="py-2 px-3 font-medium text-[#1e293b]">{p.name}</td>
                                <td className="py-2 px-3 text-[#64748b]">{p.builder}</td>
                                <td className="py-2 px-3 text-right font-mono">{p.budgetHours ? `${b.toLocaleString()}h` : '—'}</td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-[#0073ea]">{p.consumedHours.toLocaleString()}h</td>
                                <td className="py-2 px-3 text-right font-mono font-bold">
                                  {p.budgetHours ? (
                                    <span className={rem < 0 ? 'text-[#e2445c]' : 'text-[#059669]'}>
                                      {rem < 0 ? `-${Math.abs(rem)}h` : `+${rem}h`}
                                    </span>
                                  ) : '—'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Capture New Snapshot Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-[#e6e9ef] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e6e9ef] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#0073ea]" />
                <h3 className="font-bold text-base text-[#1e293b]">Capture Workspace Snapshot</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitSnapshot} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1e293b] mb-1">
                  Milestone Version Tag *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. v1.3 - Week 42 Groundworks Signoff"
                  value={versionInput}
                  onChange={(e) => setVersionInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg focus:outline-none focus:border-[#0073ea]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1e293b] mb-1">
                  Author / Reviewer
                </label>
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg focus:outline-none focus:border-[#0073ea]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1e293b] mb-1">
                  Summary & Context Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain baseline updates, contingency shifts, or weather contingencies..."
                  value={summaryInput}
                  onChange={(e) => setSummaryInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg focus:outline-none focus:border-[#0073ea]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#f0f7ff] border border-[#b2d9fc] text-[#0073ea] space-y-1">
                <div className="font-bold">What will be saved:</div>
                <div>Current {currentProjects.length} projects, {totalBudget.toLocaleString()}h budget, {totalConsumed.toLocaleString()}h consumed.</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 font-medium text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0073ea] hover:bg-[#0060c0] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Save Snapshot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
