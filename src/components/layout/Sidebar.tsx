import { useAppStore, type ProjectHub } from '../../store/useAppStore';
import { 
  Server, 
  FileText, 
  Settings, 
  Briefcase, 
  PieChart, 
  Gift, 
  BookOpen, 
  AppWindow,
  Users,
  Megaphone,
  MessageSquare,
  Globe,
  FolderOpen,

  LayoutTemplate
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useLocation } from 'react-router-dom';

const projects = [
  { id: 'on-demand-hub', name: 'On-Demand Hub', icon: Server, color: 'text-blue-500' },
  { id: 'docushare', name: 'Document Nucleus', icon: FileText, color: 'text-indigo-500' },
  { id: 'managed-services', name: 'Managed Services', icon: Settings, color: 'text-purple-500' },
  { id: 'business-marketplace', name: 'Business Marketplace', icon: Briefcase, color: 'text-emerald-500' },
  { id: 'operations-finance', name: 'Operations & Finance', icon: PieChart, color: 'text-amber-500' },
  { id: 'strategic-offers', name: 'Strategic Offers', icon: Gift, color: 'text-rose-500' },
  { id: 'knowledge-hub', name: 'Knowledge Hub', icon: BookOpen, color: 'text-cyan-500' },
  { id: 'app-directory', name: 'App Directory', icon: AppWindow, color: 'text-teal-500' },
];

const platformCore = [
  { path: '/users', name: 'Users & Membership', icon: Users },
  { path: '/resources', name: 'Resources Manager', icon: FolderOpen },
  { path: '/navigation', name: 'Navigation Manager', icon: LayoutTemplate },
  { path: '/offers', name: 'Offers Manager', icon: Gift },
  { path: '/enquiries', name: 'Leads & Enquiries', icon: MessageSquare },
  { path: '/campaigns', name: 'Campaigns & SEO', icon: Megaphone },

  { path: '/settings', name: 'Global Settings', icon: Globe },
];


export function Sidebar() {
  const { activeProject, setActiveProject } = useAppStore();
  const location = useLocation();

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">RBP Hub Admin</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Manage Projects
          </h2>
          <div className="space-y-1">
            {projects.map((project) => {
              const isActive = activeProject === project.id && location.pathname === '/';
              const Icon = project.icon;
              return (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project.id as ProjectHub)}
                  className={cn(
                    "w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-slate-900 text-white" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-white" : project.color)} />
                  {project.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Platform Core
          </h2>
          <div className="space-y-1">
            {platformCore.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setActiveProject(null)}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-slate-900 text-white" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-white" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
