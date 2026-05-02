import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCmsDocument } from '../../hooks/useCmsDocument';
import { CMS_COLLECTIONS } from '../../lib/cmsCollections';
import { updateCmsRecord } from '../../lib/cmsRepository';
import type { CmsLeadEnquiry } from '../../types/cms';
import { ArrowLeft, Loader2, AlertCircle, Building2, User, Globe, MessageCircle, Clock, CheckCircle2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export function EnquiryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminData } = useAuth();
  
  const { data: enquiry, loading, error: fetchError, refetch } = useCmsDocument<CmsLeadEnquiry>(
    CMS_COLLECTIONS.leadEnquiries, 
    id
  );

  const [internalNotes, setInternalNotes] = useState('');
  const [priority, setPriority] = useState<any>('normal');
  const [status, setStatus] = useState<any>('new');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (enquiry) {
      setInternalNotes(enquiry.internalNotes || '');
      setPriority(enquiry.priority || 'normal');
      setStatus(enquiry.status || 'new');
    }
  }, [enquiry]);

  const handleSave = async () => {
    if (!adminData || !id) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateCmsRecord(CMS_COLLECTIONS.leadEnquiries, id, {
        internalNotes,
        priority,
        status
      }, adminData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  if (fetchError || !enquiry) return <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center"><AlertCircle className="w-5 h-5 mr-2" />Enquiry not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/enquiries')} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Enquiry Details</h1>
            <p className="text-sm text-slate-500">Ref: {id?.substring(0, 8)}...</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider
          ${enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' : enquiry.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
          {enquiry.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Contact Info & Message */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <User className="w-3 h-3 mr-1.5" /> Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500">Full Name</span>
                    <span className="text-slate-900">{enquiry.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500">Email Address</span>
                    <a href={`mailto:${enquiry.email}`} className="text-blue-600 hover:underline">{enquiry.email || 'N/A'}</a>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500">Phone Number</span>
                    <span className="text-slate-900">{enquiry.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Building2 className="w-3 h-3 mr-1.5" /> Business Info
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500">Company Name</span>
                    <span className="text-slate-900">{enquiry.company || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500">Source Path</span>
                    <span className="text-slate-900 flex items-center"><Globe className="w-3 h-3 mr-1.5 text-slate-400" /> {enquiry.sourcePath || '/'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500">Received Date</span>
                    <span className="text-slate-900 flex items-center"><Clock className="w-3 h-3 mr-1.5 text-slate-400" /> {enquiry.createdAt ? new Date((enquiry.createdAt as any).toDate()).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center mb-4">
                <MessageCircle className="w-3 h-3 mr-1.5" /> Message / Requirements
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {enquiry.message || 'No message provided.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Management */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900">Lead Management</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Internal Notes</label>
                <textarea 
                  value={internalNotes} 
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={6}
                  placeholder="Add private notes about this lead..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                />
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isSaving ? 'Saving...' : 'Save Updates'}
              </button>

              {saveSuccess && (
                <div className="flex items-center justify-center text-emerald-600 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 className="w-3 h-3 mr-1.5" /> Updates saved successfully
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
