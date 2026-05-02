import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Activity, CreditCard, Users, Download, Upload } from 'lucide-react';

export function Dashboard() {
  const { activeProject } = useAppStore();

  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <Activity className="w-16 h-16 mb-4 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">No Project Selected</h2>
        <p className="mt-2 text-sm">Select a project from the sidebar to view its dashboard.</p>
      </div>
    );
  }

  const projectName = activeProject.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{projectName} Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your primary metrics and active records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Bulk Export
          </button>
          <button className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Listings</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">-</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500">
              <span className="font-medium">No data</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Requests</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">-</h3>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500">
              <span className="font-medium">No data</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Monthly Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">-</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500">
              <span className="font-medium">No data</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Documents</CardTitle>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                No documents found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
