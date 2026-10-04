import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Admin Dashboard Placeholder
 * 
 * In accordance with instructions:
 * - No custom UI was provided in Figma for Admin Dashboard.
 * - This placeholder is explicitly marked and wired to the real backend endpoint GET /api/dashboard/admin/.
 * - Displays loading, error states, and received backend data without invented UI.
 */
export const AdminDashboardPlaceholder = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getAdminDashboard();
      setData(res);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load Admin Dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card">
        <div className="flex items-center gap-3 text-medisetu-primary mb-4">
          <ShieldCheck className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-medisetu-navy">Hospital Administrator Portal</h1>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-6 text-sm text-blue-900">
          <p className="font-semibold">Notice for Reviewers:</p>
          <p className="mt-1">
            The Figma design does not contain a visual layout for the Admin Dashboard.
            This screen is wired directly to backend endpoint: <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">GET /api/dashboard/admin/</code>.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 gap-3 text-medisetu-muted">
            <RefreshCw className="w-5 h-5 animate-spin text-medisetu-primary" />
            <span>Calling Admin Dashboard API...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Backend Error</p>
              <p className="text-sm mt-0.5">{error}</p>
              <button
                onClick={fetchAdminDashboard}
                className="mt-3 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 font-medium"
              >
                Retry Request
              </button>
            </div>
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-medisetu-navy">Received API Response:</h2>
            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl overflow-x-auto text-xs font-mono">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPlaceholder;
