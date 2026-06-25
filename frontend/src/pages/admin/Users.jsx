import React, { useState, useEffect } from 'react';
import { getUsers, createUser } from '../../api/admin';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [formData, setFormData] = useState({
    national_id: '',
    full_name: '',
    phone: '',
    email: '',
    password: '',
    role: 'customer'
  });

  const roles = ['super_admin', 'dispatcher', 'driver', 'customer', 'auditor'];
  const isAdmin = user?.role === 'super_admin' || user?.role === 'dispatcher';

  useEffect(() => { fetchUsers(); }, [filterRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(filterRole);
      setUsers(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        toast.info('Update coming soon');
        return;
      }
      await createUser(formData);
      toast.success('User created');
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create user');
    }
  };

  const resetForm = () => {
    setFormData({ national_id: '', full_name: '', phone: '', email: '', password: '', role: 'customer' });
    setEditingUser(null);
  };

  const handleEdit = (usr) => {
    setEditingUser(usr);
    setFormData({
      national_id: usr.national_id,
      full_name: usr.full_name,
      phone: usr.phone,
      email: usr.email || '',
      password: '',
      role: usr.role
    });
    setShowModal(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage all system users</p>
        </div>
        {isAdmin && (
          <GradientButton variant="primary" size="sm" icon={PlusIcon} onClick={() => { resetForm(); setShowModal(true); }}>
            Add User
          </GradientButton>
        )}
      </div>

      <GlassCard className="p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="input-field w-auto">
            <option value="">All</option>
            {roles.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
          </select>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">Total: {users.length}</span>
      </GlassCard>

      <GlassCard className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Wallet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Verified</th>
              {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{u.full_name}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.phone}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${u.role === 'super_admin' ? 'badge-danger' : u.role === 'dispatcher' ? 'badge-info' : u.role === 'driver' ? 'badge-success' : u.role === 'auditor' ? 'badge-warning' : 'badge-gray'}`}>
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">ETB {parseFloat(u.wallet_balance || 0).toFixed(2)}</td>
                <td className="px-6 py-4">{u.is_verified ? '✅' : '❌'}</td>
                {isAdmin && (
                  <td className="px-6 py-4">
                    <button onClick={() => handleEdit(u)} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {editingUser ? 'Edit User' : 'Create User'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">National ID *</label><input name="national_id" value={formData.national_id} onChange={handleChange} className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label><input name="full_name" value={formData.full_name} onChange={handleChange} className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone *</label><input name="phone" value={formData.phone} onChange={handleChange} className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label><input name="email" type="email" value={formData.email} onChange={handleChange} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password {editingUser ? '(leave blank to keep)' : '*'}</label><input name="password" type="password" value={formData.password} onChange={handleChange} className="input-field" required={!editingUser} /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role *</label><select name="role" value={formData.role} onChange={handleChange} className="input-field">{roles.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}</select></div>
              </div>
              <div className="flex gap-3 mt-6">
                <GradientButton type="submit" variant="primary" className="flex-1">{editingUser ? 'Update' : 'Create'}</GradientButton>
                <GradientButton type="button" variant="secondary" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1">Cancel</GradientButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Users;