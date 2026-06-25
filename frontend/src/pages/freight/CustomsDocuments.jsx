import React, { useState, useEffect } from 'react';
import { getCustomsDocuments, uploadCustomsDocument, deleteCustomsDocument } from '../../api/freight';
import { getOrders } from '../../api/freight';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import { PlusIcon } from '@heroicons/react/24/outline';

const CustomsDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState({ freight_order_id: '', document_type: 'invoice', file_url: '', description: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, ordersRes] = await Promise.all([getCustomsDocuments(), getOrders()]);
      setDocuments(docsRes.data.data || []);
      setOrders(ordersRes.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await uploadCustomsDocument(formData);
      toast.success('Document uploaded');
      setShowUpload(false);
      setFormData({ freight_order_id: '', document_type: 'invoice', file_url: '', description: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this document?')) {
      try { await deleteCustomsDocument(id); toast.success('Deleted'); fetchData(); } catch (error) { toast.error('Failed to delete'); }
    }
  };

  const documentTypes = ['invoice', 'phytosanitary', 'certificate_of_origin', 'bill_of_lading', 'customs_declaration'];

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Customs Documents</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage pre‑clearance documentation</p>
        </div>
        <GradientButton variant="primary" icon={PlusIcon} onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? 'Cancel' : 'Upload'}
        </GradientButton>
      </div>

      {showUpload && (
        <GlassCard className="p-6">
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={formData.freight_order_id} onChange={(e) => setFormData({...formData, freight_order_id: e.target.value})} className="input-field" required>
              <option value="">Select Order</option>
              {orders.map(o => <option key={o.id} value={o.id}>Order {o.id.slice(0,8)}</option>)}
            </select>
            <select value={formData.document_type} onChange={(e) => setFormData({...formData, document_type: e.target.value})} className="input-field">
              {documentTypes.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input placeholder="File URL" value={formData.file_url} onChange={(e) => setFormData({...formData, file_url: e.target.value})} className="input-field col-span-full" required />
            <input placeholder="Description (optional)" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field col-span-full" />
            <GradientButton type="submit" variant="primary" className="col-span-full">Upload</GradientButton>
          </form>
        </GlassCard>
      )}

      <GlassCard className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr><th>Order</th><th>Type</th><th>Status</th><th>File</th><th>Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {documents.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-4 py-3">{doc.freight_order_id?.slice(0,8)}</td>
                <td className="px-4 py-3"><span className="badge badge-info">{doc.document_type}</span></td>
                <td className="px-4 py-3">
                  <span className={`badge ${doc.customs_status === 'cleared' ? 'badge-success' : doc.customs_status === 'rejected' ? 'badge-danger' : doc.customs_status === 'submitted' ? 'badge-warning' : 'badge-gray'}`}>{doc.customs_status}</span>
                </td>
                <td className="px-4 py-3"><a href={doc.file_url} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">View</a></td>
                <td className="px-4 py-3"><button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:underline">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};

export default CustomsDocuments;