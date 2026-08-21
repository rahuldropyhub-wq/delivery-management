import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import FilterTabs from '../../components/common/FilterTabs';
import {
  Users,
  Search,
  Edit,
  Save,
  X,
  UserPlus,
  Trash2,
  Package,
  Wallet,
  Target,
  Trophy,
  ShieldCheck,
  Bike,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react';

export default function ManagerExecutivesPage() {
  const { data, updateExecutive, addExecutive, deleteExecutive } = useData();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingExecutive, setEditingExecutive] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Add Candidate / Executive Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "Nellore",
    zone: "Nellore Central Hub (Zone 3)",
    accountStatus: "Active",
    kycStatus: "Verified",
    rating: 4.9,
    vehicleType: "Two Wheeler (Bike)",
    vehicleModel: "Honda Activa 6G",
    vehicleRegNumber: "",
    drivingLicense: "",
    weeklyTarget: 50,
    weeklyOrders: 0,
    emergencyContact: "",
    bankName: "State Bank of India"
  });

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
      const matchName = exec.name?.toLowerCase().includes(q);
      const matchId = exec.id?.toLowerCase().includes(q);
      const matchMobile = exec.mobile?.includes(q);
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

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} (${id}) from the fleet?`)) {
      deleteExecutive(id);
      showToast(`Removed candidate ${name} from executive fleet`, "info");
      if (editingExecutive?.id === id) {
        setEditingExecutive(null);
      }
    }
  };

  const handleQuickFillCandidate = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setAddFormData({
      name: `Kiran Kumar (${randomNum})`,
      mobile: `98480${randomNum}`,
      email: `kiran.k${randomNum}@dropyhub.com`,
      city: "Nellore",
      zone: "Nellore Central Hub (Zone 3)",
      accountStatus: "Active",
      kycStatus: "Verified",
      rating: 4.9,
      vehicleType: "Two Wheeler (Bike)",
      vehicleModel: "Hero Splendor Plus",
      vehicleRegNumber: `AP 26 CA ${randomNum}`,
      drivingLicense: `DL-04202400${randomNum}`,
      weeklyTarget: 50,
      weeklyOrders: 0,
      emergencyContact: "+91 9848011222 (Brother)",
      bankName: "HDFC Bank"
    });
    showToast("Filled demo candidate details", "info");
  };

  const handleAddCandidateSubmit = (e) => {
    e.preventDefault();
    if (!addFormData.name.trim()) {
      showToast("Please enter Candidate Name", "error");
      return;
    }
    if (!addFormData.mobile.trim()) {
      showToast("Please enter Candidate Mobile Number", "error");
      return;
    }

    const created = addExecutive(addFormData);
    showToast(`Candidate ${created.name} onboarded with ID ${created.id}!`, "success");
    setIsAddModalOpen(false);
    // Reset form
    setAddFormData({
      name: "",
      mobile: "",
      email: "",
      city: "Nellore",
      zone: "Nellore Central Hub (Zone 3)",
      accountStatus: "Active",
      kycStatus: "Verified",
      rating: 4.9,
      vehicleType: "Two Wheeler (Bike)",
      vehicleModel: "Honda Activa 6G",
      vehicleRegNumber: "",
      drivingLicense: "",
      weeklyTarget: 50,
      weeklyOrders: 0,
      emergencyContact: "",
      bankName: "State Bank of India"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
              Fleet Operations
            </span>
            <span className="text-xs text-slate-400">Total: {executives.length} Executives</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mt-1">
            Delivery Executives Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Onboard new delivery partners, maintain KYC, order targets, earnings, and status.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, ID, phone, vehicle..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Add Candidate Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 tap-active"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Candidate / Executive</span>
          </button>
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
        {filteredExecutives.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-3 border border-amber-200">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-navy-900">0 Delivery Executives in Fleet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Your live database is clean and empty. Start building your fleet by onboarding your first delivery candidate.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Onboard First Candidate</span>
            </button>
          </div>
        ) : (
          filteredExecutives.map((exec) => (
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
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rating</span>
                    <p className="font-extrabold text-purple-700 mt-0.5">
                      ★ {exec.rating || "4.9"}
                    </p>
                  </div>
                </div>

                {/* Meta details */}
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{exec.mobile}</span>
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{exec.zone}</span>
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <Bike className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{exec.vehicleInfo?.model} ({exec.vehicleInfo?.regNumber})</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(exec)}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Executive Data</span>
                </button>

                <button
                  onClick={() => handleDelete(exec.id, exec.name)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove candidate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )))}
      </div>

      {/* ========================================================================= */}
      {/* 🚀 ONBOARD NEW CANDIDATE / EXECUTIVE MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Onboard Delivery Candidate
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Register a new delivery executive partner to the hub.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickFillCandidate}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto Fill Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddCandidateSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Quick Fill on Mobile */}
              <div className="sm:hidden">
                <button
                  type="button"
                  onClick={handleQuickFillCandidate}
                  className="w-full py-2 bg-amber-50 border border-amber-200 text-amber-800 font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Auto-Fill Test Candidate Info</span>
                </button>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Candidate Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Candidate Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kiran Varma"
                      value={addFormData.name}
                      onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9848012345"
                      value={addFormData.mobile}
                      onChange={(e) => setAddFormData({ ...addFormData, mobile: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. kiran@dropyhub.com"
                      value={addFormData.email}
                      onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Assigned Hub / Zone
                    </label>
                    <select
                      value={addFormData.zone}
                      onChange={(e) => setAddFormData({ ...addFormData, zone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Nellore Central Hub (Zone 3)">Nellore Central Hub (Zone 3)</option>
                      <option value="Nellore North Hub (Zone 1)">Nellore North Hub (Zone 1)</option>
                      <option value="Nellore South Hub (Zone 2)">Nellore South Hub (Zone 2)</option>
                      <option value="Kavali Sub-Hub (Zone 4)">Kavali Sub-Hub (Zone 4)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status & Compliance */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Account Status & Verification</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Account Status
                    </label>
                    <select
                      value={addFormData.accountStatus}
                      onChange={(e) => setAddFormData({ ...addFormData, accountStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Active">Active (On Duty)</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      KYC Status
                    </label>
                    <select
                      value={addFormData.kycStatus}
                      onChange={(e) => setAddFormData({ ...addFormData, kycStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Verified">Verified (Complete)</option>
                      <option value="Pending">Pending Documents</option>
                      <option value="Not Verified">Not Verified</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Driving License Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DL-042024009988"
                      value={addFormData.drivingLicense}
                      onChange={(e) => setAddFormData({ ...addFormData, drivingLicense: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle & Target Info */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-brand-600" />
                  <span>Vehicle Info & Weekly Target</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Honda Activa 6G"
                      value={addFormData.vehicleModel}
                      onChange={(e) => setAddFormData({ ...addFormData, vehicleModel: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Vehicle Plate Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AP 26 CA 4589"
                      value={addFormData.vehicleRegNumber}
                      onChange={(e) => setAddFormData({ ...addFormData, vehicleRegNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Weekly Orders Target
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="200"
                      value={addFormData.weeklyTarget}
                      onChange={(e) => setAddFormData({ ...addFormData, weeklyTarget: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Onboard & Create Candidate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ✏️ EDIT EXECUTIVE DRAWER / MODAL */}
      {/* ========================================================================= */}
      {editingExecutive && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={editingExecutive.avatar}
                    alt={editingExecutive.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-navy-900 text-base leading-tight">
                      Edit Executive Data
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {editingExecutive.id} • {editingExecutive.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingExecutive(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 mt-5 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                  <span className="font-bold text-amber-900 block mb-0.5">
                    ⚙️ Performance & Target Controls
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    Updates made here immediately reflect on this executive's dashboard, earnings, and milestones.
                  </p>
                </div>

                {/* Orders & Target Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Completed Orders (Weekly)
                    </label>
                    <input
                      type="number"
                      value={editFormData.weeklyOrders}
                      onChange={(e) => setEditFormData({ ...editFormData, weeklyOrders: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Weekly Order Target
                    </label>
                    <input
                      type="number"
                      value={editFormData.weeklyTarget}
                      onChange={(e) => setEditFormData({ ...editFormData, weeklyTarget: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Earnings Fields */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Delivery Pay (₹)
                    </label>
                    <input
                      type="number"
                      value={editFormData.deliveryEarnings}
                      onChange={(e) => setEditFormData({ ...editFormData, deliveryEarnings: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Bonus Pay (₹)
                    </label>
                    <input
                      type="number"
                      value={editFormData.bonusEarnings}
                      onChange={(e) => setEditFormData({ ...editFormData, bonusEarnings: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-amber-700 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Referral Pay (₹)
                    </label>
                    <input
                      type="number"
                      value={editFormData.referralEarnings}
                      onChange={(e) => setEditFormData({ ...editFormData, referralEarnings: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-blue-700 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Profile and Meta */}
                <div className="pt-2 space-y-3">
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
                        KYC Status
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
