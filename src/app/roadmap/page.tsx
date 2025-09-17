'use client';

import { useState, useEffect } from 'react';
import { 
  listTasks, 
  getTask, 
  upsertTask, 
  setStatus, 
  deleteTask, 
  reseed, 
  exportJSON, 
  importJSON, 
  seedIfEmpty,
  RoadmapTask 
} from '@/lib/roadmap';
import { NEXT_PUBLIC_SHOW_ROADMAP } from '@/lib/flags';

export default function RoadmapPage() {
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<RoadmapTask | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'P0' | 'P1'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'backlog' | 'in_progress' | 'done'>('all');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const taskList = listTasks();
    if (taskList.length === 0) {
      // Seed with default tasks if empty
      const defaultTasks = [
        {
          id: 'provider-model-picker',
          title: 'Provider & Model Picker UI',
          description: 'Settings page to choose provider/model (read-only if key missing)',
          files: ['src/app/settings/provider/page.tsx', 'src/lib/env.ts'],
          priority: 'P0' as const,
          status: 'backlog' as const
        },
        {
          id: 'prompt-registry-v2',
          title: 'Prompt Registry v2 (versioned & labeled)',
          description: 'Versioned prompt profiles with descriptions & change notes',
          files: ['src/lib/prompt-profiles.ts', 'docs/PROMPTS_CHANGELOG.md'],
          priority: 'P0' as const,
          status: 'backlog' as const
        },
        {
          id: 'idea-templates-vertical',
          title: 'Idea Templates by Vertical',
          description: 'Add vertical library + chips',
          files: ['src/lib/jtbd-templates.ts', 'src/app/idea/page.tsx'],
          priority: 'P1' as const,
          status: 'backlog' as const
        },
        {
          id: 'undo-redo-prd',
          title: 'Undo/Redo for PRD Editor',
          description: 'Local history capped at N',
          files: ['src/app/plan/review/[projectId]/page.tsx'],
          priority: 'P1' as const,
          status: 'backlog' as const
        },
        {
          id: 'keyboard-shortcuts',
          title: 'Keyboard Shortcuts',
          description: '? help modal',
          files: ['src/app/_components/ShortcutsHelp.tsx', 'page integrations'],
          priority: 'P1' as const,
          status: 'backlog' as const
        },
        {
          id: 'archive-tags-projects',
          title: 'Archive & Tags for Projects',
          description: 'Filters + tag editor',
          files: ['src/lib/storage.ts', 'src/app/dashboard/page.tsx (or /)'],
          priority: 'P1' as const,
          status: 'backlog' as const
        },
        {
          id: 'seo-social-previews',
          title: 'SEO & Social Previews',
          description: 'Metadata, OpenGraph images',
          files: ['src/app/layout.tsx', 'src/app/opengraph-image.tsx'],
          priority: 'P1' as const,
          status: 'backlog' as const
        },
        {
          id: 'pwa-offline',
          title: 'PWA (Local-First Offline)',
          description: 'Manifest + minimal service worker (no network caching of APIs)',
          files: ['src/app/manifest.webmanifest', 'public/icons/*', 'src/sw.ts (if applicable)'],
          priority: 'P1' as const,
          status: 'backlog' as const
        },
        {
          id: 'tour-coachmarks',
          title: 'Tour / First-Run Coachmarks',
          description: 'Subtle inline tips across the 4 steps',
          files: ['src/app/_components/Tour.tsx', 'page integrations'],
          priority: 'P1' as const,
          status: 'backlog' as const
        },
        {
          id: 'deploy-experience-polish',
          title: 'Deploy Experience Polish',
          description: 'Success page variants, copy, and link guard',
          files: ['src/app/deploy/[projectId]/page.tsx'],
          priority: 'P0' as const,
          status: 'backlog' as const
        }
      ];
      const now = new Date().toISOString();
      const tasksWithTimestamps = defaultTasks.map(task => ({
        ...task,
        createdAt: now,
        updatedAt: now
      }));
      seedIfEmpty(tasksWithTimestamps);
    }
    setTasks(listTasks());
    setIsLoading(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const tasksByStatus = {
    backlog: filteredTasks.filter(t => t.status === 'backlog'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    done: filteredTasks.filter(t => t.status === 'done')
  };

  const handleStatusChange = (taskId: string, newStatus: RoadmapTask['status']) => {
    setStatus(taskId, newStatus);
    setTasks(listTasks());
    setMessage('Status updated');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDelete = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      setTasks(listTasks());
      setMessage('Task deleted');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleReseed = () => {
    if (confirm('This will clear all current tasks and reseed with defaults. Continue?')) {
      reseed();
      setTasks(listTasks());
      setMessage('Roadmap reseeded');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleExport = () => {
    const data = exportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roadmap-tasks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = importJSON(e.target?.result as string);
      if (result.success) {
        setTasks(listTasks());
        setMessage('Tasks imported successfully');
      } else {
        setMessage(`Import failed: ${result.errors.join(', ')}`);
      }
      setTimeout(() => setMessage(''), 3000);
    };
    reader.readAsText(file);
  };

  const handleSaveTask = (taskData: Partial<RoadmapTask>) => {
    if (selectedTask) {
      upsertTask({ ...selectedTask, ...taskData });
      setTasks(listTasks());
      setSelectedTask(null);
      setIsEditing(false);
      setMessage('Task updated');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  if (!NEXT_PUBLIC_SHOW_ROADMAP) {
    return (
      <div className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">Roadmap</h1>
          <p className="text-amber-700">This feature is currently hidden by feature flag.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-amber-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-amber-100 rounded"></div>
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-32 bg-amber-100 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Roadmap</h1>
          
          {/* Toolbar */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Priorities</option>
              <option value="P0">P0 Only</option>
              <option value="P1">P1 Only</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="backlog">Backlog</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            
            <button
              onClick={handleReseed}
              className="px-4 py-2 bg-amber-200 text-amber-900 rounded-lg hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Re-seed
            </button>
            
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Export JSON
            </button>
            
            <label className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer">
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {message && (
            <div 
              className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg"
              aria-live="polite"
            >
              {message}
            </div>
          )}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['backlog', 'in_progress', 'done'] as const).map((status) => (
            <div key={status} className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-amber-900 mb-4 capitalize">
                {status.replace('_', ' ')} ({tasksByStatus[status].length})
              </h2>
              
              <div className="space-y-3">
                {tasksByStatus[status].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onEdit={(task) => {
                      setSelectedTask(task);
                      setIsEditing(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {isEditing && selectedTask && (
          <EditTaskModal
            task={selectedTask}
            onSave={handleSaveTask}
            onClose={() => {
              setSelectedTask(null);
              setIsEditing(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: RoadmapTask;
  onStatusChange: (id: string, status: RoadmapTask['status']) => void;
  onEdit: (task: RoadmapTask) => void;
  onDelete: (id: string) => void;
}

function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const priorityColor = task.priority === 'P0' ? 'bg-amber-500' : 'bg-gray-400';
  
  return (
    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
      <div className="flex items-start justify-between mb-2">
        <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${priorityColor}`}>
          {task.priority}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="text-amber-600 hover:text-amber-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 text-sm ml-2"
          >
            Delete
          </button>
        </div>
      </div>
      
      <h3 className="font-semibold text-amber-900 mb-2">{task.title}</h3>
      <p className="text-sm text-amber-700 mb-3">{task.description}</p>
      
      {task.files.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-amber-600 font-medium mb-1">Files:</p>
          <div className="text-xs text-amber-600 space-y-1">
            {task.files.map((file, index) => (
              <div key={index} className="font-mono">{file}</div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        {task.status === 'backlog' && (
          <button
            onClick={() => onStatusChange(task.id, 'in_progress')}
            className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Start
          </button>
        )}
        {task.status === 'in_progress' && (
          <button
            onClick={() => onStatusChange(task.id, 'done')}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Mark Done
          </button>
        )}
        {task.status === 'done' && (
          <button
            onClick={() => onStatusChange(task.id, 'in_progress')}
            className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Reopen
          </button>
        )}
      </div>
    </div>
  );
}

interface EditTaskModalProps {
  task: RoadmapTask;
  onSave: (taskData: Partial<RoadmapTask>) => void;
  onClose: () => void;
}

function EditTaskModal({ task, onSave, onClose }: EditTaskModalProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    files: task.files.join('\n'),
    priority: task.priority,
    status: task.status,
    notes: task.notes || '',
    blockedBy: task.blockedBy?.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      files: formData.files.split('\n').filter(f => f.trim()),
      blockedBy: formData.blockedBy ? formData.blockedBy.split(',').map(b => b.trim()).filter(b => b) : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">Edit Task</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Files (one per line)</label>
              <textarea
                value={formData.files}
                onChange={(e) => setFormData({ ...formData, files: e.target.value })}
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'P0' | 'P1' })}
                  className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="P0">P0</option>
                  <option value="P1">P1</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as RoadmapTask['status'] })}
                  className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="backlog">Backlog</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={2}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Blocked By (comma-separated task IDs)</label>
              <input
                type="text"
                value={formData.blockedBy}
                onChange={(e) => setFormData({ ...formData, blockedBy: e.target.value })}
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
