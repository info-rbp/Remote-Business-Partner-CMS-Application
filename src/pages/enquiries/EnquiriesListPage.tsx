import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCmsCollection } from '../../hooks/useCmsCollection';
import { CMS_COLLECTIONS } from '../../lib/cmsCollections';
import { updateCmsRecord } from '../../lib/cmsRepository';
import type { CmsLeadEnquiry } from '../../types/cms';
import { Search, Loader2, MessageSquare, Mail, Calendar, Eye } from 'lucide-react';
import { useState } from 'react';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  closed: 'bg-slate-100 text-slate-600',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export function EnquiriesListPage() {
  const navigate = useNavigate();
  const { adminData } = useAuth();
  const { data: enquiries, loading, refetch } = useCmsCollection<CmsLeadEnquiry>(CMS_COLLECTIONS.leadEnquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = enq.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          enq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          enq.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    if (!adminData) return;
    await updateCmsRecord(CMS_COLLECTIONS.leadEnquiries, id, { status: newStatus }, adminData);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads & Enquiries</h1>
          <p className="text-sm text-slate-500">Track and manage inbound interest from the public website.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            No enquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Received</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{enq.name || 'Anonymous'}</span>
                        <span className="text-xs text-slate-500 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" /> {enq.email || 'N/A'}
                        </span>
                        {enq.company && (
                          <span className="text-xs text-slate-400 mt-0.5">{enq.company}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md capitalize">
                        {enq.enquiryType}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${PRIORITY_COLORS[enq.priority || 'normal']}`}>
                        {enq.priority || 'normal'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={enq.status} 
                        onChange={(e) => handleUpdateStatus(enq.id!, e.target.value)}
                        className={`text-xs font-bold rounded-full px-2 py-0.5 border-none outline-none appearance-none cursor-pointer ${STATUS_COLORS[enq.status || 'new']}`}
                      >
                        <option value="new">NEW</option>
                        <option value="in-progress">IN PROGRESS</option>
                        <option value="closed">CLOSED</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col text-xs text-slate-500">
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {enq.createdAt ? new Date((enq.createdAt as any).toDate()).toLocaleDateString() : 'Just now'}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{enq.sourcePath || '/'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/enquiries/${enq.id}`)}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
