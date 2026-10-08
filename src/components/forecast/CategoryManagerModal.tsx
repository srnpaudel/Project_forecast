import React, { useState } from 'react';
import { ProjectCategory } from '../../types/resourceForecast';
import { X, Plus, FolderPlus } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProjectCategory[];
  onAddCategory: (category: Omit<ProjectCategory, 'id' | 'isSystem'>) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0073ea');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCategory({
      name: name.trim(),
      description: description.trim() || 'Custom forecast category.',
      color,
    });

    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white border border-[#e6e9ef] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f2f7] flex items-center justify-between bg-[#fafbfd]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#676879]">
              <FolderPlus className="w-3.5 h-3.5 text-[#0073ea]" />
              <span>PROJECT STATUS</span>
            </div>
            <h3 className="text-base font-bold text-[#323338]">
              Manage Project Statuses
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#676879] hover:text-[#323338] rounded-md hover:bg-[#f5f6f8] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-[#f0f2f7]">
          <div className="text-xs font-mono uppercase tracking-wider text-[#676879] pb-1">
            Active Project Statuses
          </div>

          {categories.map((cat) => (
            <div key={cat.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-semibold text-[#323338]">{cat.name}</span>
                  {cat.isSystem && (
                    <span className="text-[10px] font-mono text-[#808294] bg-[#f5f6f8] px-1.5 py-0.5 rounded">
                      CORE WPX
                    </span>
                  )}
                </div>
                <p className="text-[#676879] text-[11px] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="text-right font-mono text-[11px] text-[#808294]">
                {cat.id === 'cat-live' ? 'Enforces Budget Hours' : 'Planning Stage'}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Future Category Form */}
        <form onSubmit={handleSubmit} className="p-5 border-t border-[#f0f2f7] bg-[#fafbfd] space-y-3">
          <div className="text-xs font-semibold text-[#323338]">
            Add New Project Status
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-[#676879]">Status Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Commissioning & Handover"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#d0d4e4] rounded text-[#323338] placeholder-[#808294] focus:outline-none focus:border-[#0073ea]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[#676879]">Badge Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-7 h-7 rounded border border-[#d0d4e4] bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono bg-white border border-[#d0d4e4] rounded text-[#323338]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#676879]">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Post-construction testing and defect liability inspections"
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#d0d4e4] rounded text-[#323338] placeholder-[#808294] focus:outline-none focus:border-[#0073ea]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0073ea] hover:bg-[#0060c0] text-white text-xs font-semibold rounded-md transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Status</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
