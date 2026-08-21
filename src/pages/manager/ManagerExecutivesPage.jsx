import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import FilterTabs from '../../components/common/FilterTabs';
import {
  Users,
  Search,
  Edit,
  Save,
  X,
  Package,
  Wallet,
  Target,
  Trophy,
  ShieldCheck,
  Bike,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ManagerExecutivesPage() {
  const { data, updateExecutive, getOrdersForExecutive } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingExecutive, setEditingExecutive] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const executives = data.executives || [];

  // Check URL param if ?edit=EXE12345
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const target = executives.find((e) => e.id === editId);
      if (target) {
        handleOpenEdit(target);
      }
    }
  }, [searchParams, executives]);

  const filteredExecutives = executives.filter((exec) => {
    if (statusFilter !== 'all' && exec.accountStatus?.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = exec.name.toLowerCase().includes(q);
      const matchId = exec.id.toLowerCase().includes(q);
      const matchMobile = exec.mobile.includes(q);
      const matchVehicle = exec.vehicleInfo?.regNumber?.toLowerCase().includes(q);
      return matchName || matchId || matchMobile || matchVehicle;
    }
    return true;
  });

  const handleOpenEdit = (exec) => {
    setEditingExecutive(exec);
    setEditFormData({
      name: exec.name,
      mobile: exec.mobile,
      email: exec.email,
      accountStatus: exec.accountStatus || "Active",
      kycStatus: exec.kycStatus || "Verified",
      rating: exec.rating || 4.88,
      weeklyOrders: exec.stats?.weeklyOrders ?? 42,
      weeklyTarget: exec.stats?.weeklyTarget ?? 50,
      deliveryEarnings: exec.stats?.deliveryEarnings ?? 4200,
      bonusEarnings: exec.stats?.bonusEarnings ?? 500,
      referralEarnings: exec.stats?.referralEarnings ?? 300,
      rank: exec.stats?.rank ?? 7,
      vehicleModel: exec.vehicleInfo?.model || "Honda Activa 6G",
      vehicleRegNumber: exec.vehicleInfo?.regNumber || "AP 26 BP 4589"
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editingExecutive) return;

    const updatedStats = {
      weeklyOrders: Number(editFormData.weeklyOrders),
      weeklyTarget: Number(editFormData.weeklyTarget),
      deliveryEarnings: Number(editFormData.deliveryEarnings),
      bonusEarnings: Number(editFormData.bonusEarnings),
      referralEarnings: Number(editFormData.referralEarnings),
      weeklyEarnings: Number(editFormData.deliveryEarnings) + Number(editFormData.bonusEarnings),
      totalEarnings: Number(editFormData.deliveryEarnings) + Number(editFormData.bonusEarnings) + Number(editFormData.referralEarnings),
      rank: Number(editFormData.rank),
      completedOrders: Number(editFormData.weeklyOrders)
    };

    updateExecutive(editingExecutive.id, {
      name: editFormData.name,
      mobile: editFormData.mobile,
      email: editFormData.email,
      accountStatus: editFormData.accountStatus,
      kycStatus: editFormData.kycStatus,
      rating: Number(editFormData.rating),
      vehicleInfo: {
        ...editingExecutive.vehicleInfo,
        model: editFormData.vehicleModel,
        regNumber: editFormData.vehicleRegNumber
      },
      stats: updatedStats
    });

    showToast(`Updated performance data for ${editFormData.name}`, "success");
    setEditingExecutive(null);
    setSearchParams({});
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Delivery Executives Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an executive to maintain their orders, earnings, rank, and milestone targets.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, ID, phone, vehicle..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <FilterTabs
        tabs={[
          { id: "all", label: "All Executives", count: executives.length },
          { id: "active", label: "Active", count: executives.filter((e) => e.accountStatus === 'Active').length },
          { id: "on leave", label: "On Leave", count: executives.filter((e) => e.accountStatus === 'On Leave').length },
          { id: "suspended", label: "Suspended", count: executives.filter((e) => e.accountStatus === 'Suspended').length },
        ]}
        activeTab={statusFilter}
        onChange={setStatusFilter}
      />

      {/* Executives List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExecutives.map((exec) => (
          <div
            key={exec.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={exec.avatar}
                    alt={exec.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-navy-900 text-sm leading-tight">{exec.name}</h3>
                    <p className="font-mono text-slate-400 text-xs mt-0.5">{exec.id}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={exec.accountStatus || "Active"} size="sm" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    KYC: {exec.kycStatus || "Verified"}
                  </span>
                </div>
              </div>

              {/* Performance Metrics Box */}
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Orders</span>
                  <p className="font-extrabold text-navy-900 mt-0.5">
                    {exec.stats?.weeklyOrders || 0} / {exec.stats?.weeklyTarget || 50}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Earnings</span>
                  <p className="font-extrabold text-emerald-700 mt-0.5">
                    ₹{exec.stats?.weeklyEarnings?.toLocaleString('en-IN') || 0}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rank</span>
                  <p className="font-extrabold text-purple-700 mt-0.5">
                    #{exec.stats?.rank || "-"}
                  </p>
                </div>
              </div>

              {/* Meta details */}
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>📞 {exec.mobile}</p>
                <p>📍 {exec.zone}</p>
                <p>🛵 {exec.vehicleInfo?.model} ({exec.vehicleInfo?.regNumber})</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleOpenEdit(exec)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Executive Data</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Executive Drawer / Modal */}
      {editingExecutive && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Data Administration
                  </span>
                  <h3 className="text-lg font-bold text-navy-900 mt-1">
                    Maintain Data for {editingExecutive.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {editingExecutive.id}</p>
                </div>

                <button
                  onClick={() => setEditingExecutive(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                {/* Performance Stats Group */}
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3">
                  <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>Weekly Performance & Milestone Metrics</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Completed Orders
                      </label>
                      <input
                        type="number"
                        value={editFormData.weeklyOrders}
                        onChange={(e) => setEditFormData({ ...editFormData, weeklyOrders: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-navy-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Weekly Milestone Target
                      </label>
                      <input
                        type="number"
                        value={editFormData.weeklyTarget}
                        onChange={(e) => setEditFormData({ ...editFormData, weeklyTarget: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-navy-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Delivery Pay (₹)
                      </label>
                      <input
                        type="number"
                        value={editFormData.deliveryEarnings}
                        onChange={(e) => setEditFormData({ ...editFormData, deliveryEarnings: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-navy-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Bonus (₹)
                      </label>
                      <input
                        type="number"
                        value={editFormData.bonusEarnings}
                        onChange={(e) => setEditFormData({ ...editFormData, bonusEarnings: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-navy-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Referral (₹)
                      </label>
                      <input
                        type="number"
                        value={editFormData.referralEarnings}
                        onChange={(e) => setEditFormData({ ...editFormData, referralEarnings: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-navy-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Zone Leaderboard Rank
                      </label>
                      <input
                        type="number"
                        value={editFormData.rank}
                        onChange={(e) => setEditFormData({ ...editFormData, rank: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-navy-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Partner Rating (1.0 - 5.0)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editFormData.rating}
                        onChange={(e) => setEditFormData({ ...editFormData, rating: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-navy-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile & Status Details */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Personal & Administrative Status
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Account Status
                      </label>
                      <select
                        value={editFormData.accountStatus}
                        onChange={(e) => setEditFormData({ ...editFormData, accountStatus: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        KYC Informational Status
                      </label>
                      <select
                        value={editFormData.kycStatus}
                        onChange={(e) => setEditFormData({ ...editFormData, kycStatus: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
                      >
                        <option value="Verified">Verified</option>
                        <option value="Pending">Pending</option>
                        <option value="Not Verified">Not Verified</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={editFormData.mobile}
                        onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Vehicle Model
                      </label>
                      <input
                        type="text"
                        value={editFormData.vehicleModel}
                        onChange={(e) => setEditFormData({ ...editFormData, vehicleModel: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Vehicle Reg Number
                      </label>
                      <input
                        type="text"
                        value={editFormData.vehicleRegNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, vehicleRegNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingExecutive(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
