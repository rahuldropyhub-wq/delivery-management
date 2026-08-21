import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabaseService } from '../services/supabaseService';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const DataContext = createContext(null);

const STORAGE_KEY = 'dp_portal_live_data_v2';

export const supportCategories = [
  "Earnings & Payouts",
  "Order & Delivery Issues",
  "App & Technical Glitches",
  "Profile & KYC Verification",
  "Account Safety & Security",
  "Other Inquiries"
];

const emptyInitialState = {
  executives: [],
  orders: [],
  earnings: {
    summary: {
      total: 0,
      deliveryEarnings: 0,
      bonus: 0,
      referral: 0,
      nextPayoutDate: "Upcoming Sunday",
      currentCycle: "Active Week"
    },
    chartData: [],
    dailyBreakdown: [],
    payoutHistory: []
  },
  milestone: {
    id: "MS-DEFAULT",
    title: "Weekly Target",
    targetOrders: 50,
    completedOrders: 0,
    reward: "₹500 Bonus",
    rewardAmount: 500,
    percentage: 0,
    remainingOrders: 50,
    period: "Current Week",
    deadline: "Sunday, 11:59 PM",
    status: "In Progress",
    tiers: [],
    history: []
  },
  contest: {
    id: "CONT-DEFAULT",
    title: "Monsoon Delivery Challenge 🏆",
    prizePool: 3000,
    firstPrize: 1500,
    secondPrize: 1000,
    thirdPrize: 500,
    minOrdersToQualify: 25,
    status: "Active",
    daysRemaining: 4,
    hoursRemaining: 18,
    topRankings: []
  },
  leaderboard: {
    currentZone: "Nellore Central Hub (Zone 3)",
    topPerformers: [],
    userStats: {
      rank: 1,
      ordersCompleted: 0,
      customerRating: 5.0,
      acceptanceRate: "100%",
      onTimeDelivery: "100%"
    }
  },
  rewards: {
    userPoints: 0,
    items: [],
    redemptionHistory: []
  },
  referrals: {
    referralCode: "DP-JOIN",
    referralLink: "https://dropyhub.com/join",
    rewardPerReferral: 300,
    termsSummary: "Earn ₹300 for every candidate onboarded who completes 25 deliveries.",
    stats: {
      totalReferrals: 0,
      joined: 0,
      earnings: 0
    },
    invitedCandidates: []
  },
  notifications: [],
  tickets: [],
  lastUpdated: new Date().toISOString()
};

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load data from storage:", e);
    }
    return emptyInitialState;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Persist whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { }
  }, [data]);

  // -------------------------------------------------------------
  // Initial Supabase Live Data Sync & Realtime Subscription
  // -------------------------------------------------------------
  const syncSupabaseLive = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      const [execs, orders, notifs, tickets, payouts, milestones, rewards, referrals] = await Promise.all([
        supabaseService.fetchExecutives(),
        supabaseService.fetchOrders(),
        supabaseService.fetchNotifications(),
        supabaseService.fetchTickets(),
        supabaseService.fetchPayouts(),
        supabaseService.fetchMilestones(),
        supabaseService.fetchRewards(),
        supabaseService.fetchReferrals()
      ]);

      setData((prev) => {
        const next = { ...prev };

        // 1. Executives
        next.executives = (execs || []).map((e) => ({
          id: e.id,
          name: e.name,
          avatar: e.avatar,
          mobile: e.mobile,
          email: e.email,
          city: e.city || "Nellore",
          zone: e.zone,
          dob: e.dob,
          bloodGroup: e.blood_group,
          emergencyContact: e.emergency_contact,
          joiningDate: e.joining_date,
          kycStatus: e.kyc_status,
          accountStatus: e.account_status,
          rating: Number(e.rating) || 5.0,
          totalDeliveriesLifetime: Number(e.total_deliveries_lifetime) || 0,
          vehicleInfo: {
            type: e.vehicle_type || "Two Wheeler (Bike)",
            model: e.vehicle_model || "",
            regNumber: e.vehicle_reg_number || "",
            license: e.driving_license || ""
          },
          payoutAccount: {
            bankName: e.bank_name || "State Bank of India",
            accountNumberMasked: e.bank_account_masked || "•••• 4589",
            upiId: e.upi_id || ""
          },
          stats: {
            weeklyOrders: Number(e.weekly_orders) || 0,
            weeklyTarget: Number(e.weekly_target) || 50,
            weeklyEarnings: Number(e.weekly_earnings) || 0,
            deliveryEarnings: Number(e.delivery_earnings) || 0,
            bonusEarnings: Number(e.bonus_earnings) || 0,
            referralEarnings: Number(e.referral_earnings) || 0,
            totalEarnings: Number(e.weekly_earnings) || 0,
            rank: Number(e.rank) || 1,
            progressPercentage: Math.min(100, Math.round(((Number(e.weekly_orders) || 0) / (Number(e.weekly_target) || 50)) * 100)),
            remainingOrders: Math.max(0, (Number(e.weekly_target) || 50) - (Number(e.weekly_orders) || 0))
          }
        }));

        // 2. Orders
        next.orders = (orders || []).map((o) => ({
          id: o.id,
          executiveId: o.executive_id,
          executiveName: o.executive_name,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          dropArea: o.drop_area,
          pickupArea: o.pickup_area,
          distanceKm: Number(o.distance_km) || 0,
          itemsCount: Number(o.items_count) || 1,
          orderType: o.order_type,
          basePay: Number(o.base_pay) || 80,
          surgePay: Number(o.surge_pay) || 0,
          tip: Number(o.tip) || 0,
          earnings: Number(o.earnings) || 80,
          status: o.status || 'Completed',
          orderDate: o.order_date,
          orderTime: o.order_time
        }));

        // 3. Notifications
        next.notifications = (notifs || []).map((n) => ({
          id: n.id,
          recipientExecutiveId: n.recipient_executive_id || 'all',
          title: n.title,
          message: n.message,
          tag: n.tag || 'General',
          emoji: n.emoji || '📢',
          actionUrl: n.action_url || '/app/dashboard',
          isRead: Boolean(n.is_read),
          timestamp: n.timestamp
        }));

        // 4. Tickets
        next.tickets = (tickets || []).map((t) => ({
          id: t.id,
          executiveId: t.executive_id,
          executiveName: t.executive_name,
          subject: t.subject,
          category: t.category,
          priority: t.priority,
          status: t.status,
          description: t.description,
          messages: t.messages || [],
          createdAt: t.created_at
        }));

        // 5. Payouts
        if (payouts && payouts.length > 0) {
          next.earnings.payoutHistory = payouts.map((p) => ({
            id: p.id,
            date: p.payout_date,
            cycle: p.cycle_name,
            amount: Number(p.net_amount) || 0,
            status: p.status,
            utr: p.utr,
            expectedDate: p.expected_date
          }));
        } else {
          next.earnings.payoutHistory = [];
        }

        // 6. Milestones
        if (milestones && milestones.length > 0) {
          const activeMs = milestones[0];
          next.milestone = {
            ...next.milestone,
            id: activeMs.id,
            title: activeMs.title,
            targetOrders: Number(activeMs.target_orders) || 50,
            completedOrders: Number(activeMs.completed_orders) || 0,
            reward: activeMs.reward_text || `₹${activeMs.reward_amount} Bonus`,
            rewardAmount: Number(activeMs.reward_amount) || 500,
            status: activeMs.status,
            period: activeMs.period,
            deadline: activeMs.deadline,
            tiers: activeMs.tiers || []
          };
        }

        // 7. Rewards
        if (rewards && rewards.length > 0) {
          next.rewards.items = rewards.map((r) => ({
            id: r.id,
            title: r.title,
            category: r.category,
            pointsCost: Number(r.points_cost) || 100,
            discountValue: r.discount_value,
            imageUrl: r.image_url,
            isAvailable: Boolean(r.is_available),
            stockCount: Number(r.stock_count) || 0
          }));
        } else {
          next.rewards.items = [];
        }

        // 8. Referrals
        if (referrals && referrals.length > 0) {
          next.referrals.invitedCandidates = referrals.map((ref) => ({
            id: ref.id,
            candidateName: ref.candidate_name,
            mobile: ref.mobile,
            city: ref.city,
            status: ref.status,
            rewardAmount: Number(ref.reward_amount) || 300,
            ordersCompleted: Number(ref.orders_completed) || 0,
            targetOrders: Number(ref.target_orders) || 25
          }));
          next.referrals.stats.totalReferrals = referrals.length;
          next.referrals.stats.joined = referrals.filter((r) => r.status === 'Joined' || r.status === 'Target Reached').length;
          next.referrals.stats.earnings = referrals.filter((r) => r.status === 'Bonus Paid').length * 300;
        } else {
          next.referrals.invitedCandidates = [];
        }

        next.lastUpdated = new Date().toISOString();
        return next;
      });
    } catch (err) {
      console.warn("Supabase sync exception:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    syncSupabaseLive();

    let channel = null;
    if (isSupabaseConfigured) {
      try {
        channel = supabase
          .channel('public-realtime-stream')
          .on('postgres_changes', { event: '*', schema: 'public' }, () => {
            if (isMounted) syncSupabaseLive();
          })
          .subscribe();
      } catch (e) { }
    }

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [syncSupabaseLive]);

  // -------------------------------------------------------------
  // Executive Helpers & Mutations
  // -------------------------------------------------------------
  const getExecutive = useCallback((id = "EXE12345") => {
    const cleanId = String(id || '').trim().toLowerCase();
    const found = data.executives.find((e) => {
      if (e.id?.toLowerCase() === cleanId) return true;
      if (e.email?.toLowerCase() === cleanId) return true;
      const cleanPhone = e.mobile?.replace(/\D/g, '');
      const searchPhone = cleanId.replace(/\D/g, '');
      if (searchPhone && cleanPhone && cleanPhone === searchPhone) return true;
      return false;
    });

    return (
      found ||
      data.executives[0] || {
        id: id || "EXE12345",
        name: "Delivery Executive",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        mobile: "+91 9876543210",
        email: "executive@dropyhub.com",
        city: "Nellore",
        zone: "Nellore Central Hub (Zone 3)",
        kycStatus: "Verified",
        accountStatus: "Active",
        rating: 5.0,
        totalDeliveriesLifetime: 0,
        vehicleInfo: {
          type: "Two Wheeler (Bike)",
          model: "Honda Activa 6G",
          regNumber: "AP 26 BP 4589"
        },
        payoutAccount: {
          bankName: "State Bank of India",
          accountNumberMasked: "•••• 4589"
        },
        stats: {
          weeklyOrders: 0,
          weeklyTarget: 50,
          weeklyEarnings: 0,
          deliveryEarnings: 0,
          bonusEarnings: 0,
          referralEarnings: 0,
          totalEarnings: 0,
          rank: 1,
          progressPercentage: 0,
          remainingOrders: 50
        }
      }
    );
  }, [data.executives]);

  const updateExecutive = (id, updates) => {
    setData((prev) => {
      const updatedExecutives = prev.executives.map((exec) => {
        if (exec.id === id) {
          const newStats = updates.stats ? { ...exec.stats, ...updates.stats } : exec.stats;
          if (newStats) {
            const orders = newStats.weeklyOrders ?? exec.stats.weeklyOrders;
            const target = newStats.weeklyTarget ?? exec.stats.weeklyTarget;
            newStats.progressPercentage = Math.min(100, Math.round((orders / target) * 100));
            newStats.remainingOrders = Math.max(0, target - orders);
          }
          return {
            ...exec,
            ...updates,
            stats: newStats
          };
        }
        return exec;
      });

      return {
        ...prev,
        executives: updatedExecutives,
        lastUpdated: new Date().toISOString()
      };
    });

    supabaseService.updateExecutive(id, updates).catch((e) => console.warn(e));
  };

  const addExecutive = (execData) => {
    const newId = execData.id || `EXE${Math.floor(10000 + Math.random() * 90000)}`;
    const weeklyTarget = Number(execData.weeklyTarget) || 50;
    const weeklyOrders = Number(execData.weeklyOrders) || 0;
    const deliveryEarnings = Number(execData.deliveryEarnings) || (weeklyOrders * 100);
    const bonusEarnings = Number(execData.bonusEarnings) || 0;
    const weeklyEarnings = deliveryEarnings + bonusEarnings;

    const newExecutive = {
      id: newId,
      name: execData.name || "New Candidate",
      avatar: execData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      mobile: execData.mobile?.startsWith('+91') ? execData.mobile : `+91 ${execData.mobile?.replace(/^\+91\s*/, '') || '9876543210'}`,
      email: execData.email || `${execData.name?.toLowerCase().replace(/\s+/g, '.') || 'candidate'}@dropyhub.com`,
      city: execData.city || "Nellore",
      zone: execData.zone || "Nellore Central Hub (Zone 3)",
      kycStatus: execData.kycStatus || "Verified",
      accountStatus: execData.accountStatus || "Active",
      rating: Number(execData.rating) || 5.0,
      totalDeliveriesLifetime: weeklyOrders,
      vehicleInfo: {
        type: execData.vehicleType || "Two Wheeler (Bike)",
        model: execData.vehicleModel || "Honda Activa 6G",
        regNumber: execData.vehicleRegNumber || "AP 26 AB 1234",
        license: execData.drivingLicense || ""
      },
      payoutAccount: {
        bankName: execData.bankName || "State Bank of India",
        accountNumberMasked: "•••• 4412"
      },
      stats: {
        weeklyOrders: weeklyOrders,
        weeklyTarget: weeklyTarget,
        weeklyEarnings: weeklyEarnings,
        deliveryEarnings: deliveryEarnings,
        bonusEarnings: bonusEarnings,
        referralEarnings: 0,
        totalEarnings: weeklyEarnings,
        rank: (data.executives?.length || 0) + 1,
        progressPercentage: Math.min(100, Math.round((weeklyOrders / weeklyTarget) * 100)),
        remainingOrders: Math.max(0, weeklyTarget - weeklyOrders)
      }
    };

    setData((prev) => ({
      ...prev,
      executives: [newExecutive, ...prev.executives],
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.addExecutive(newExecutive).catch((e) => console.warn(e));

    return newExecutive;
  };

  const deleteExecutive = (id) => {
    setData((prev) => ({
      ...prev,
      executives: prev.executives.filter((e) => e.id !== id),
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.deleteExecutive(id).catch((e) => console.warn(e));
  };

  // -------------------------------------------------------------
  // Order Mutations
  // -------------------------------------------------------------
  const getOrdersForExecutive = (executiveId = "EXE12345") => {
    return data.orders.filter((o) => o.executiveId === executiveId);
  };

  const addOrder = (orderData) => {
    const newOrder = {
      id: orderData.id || `ORD${Math.floor(100000 + Math.random() * 900000)}`,
      orderDate: orderData.orderDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      orderTime: orderData.orderTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      customerName: orderData.customerName || "Customer",
      customerPhone: orderData.customerPhone || null,
      dropArea: orderData.dropArea || "Central Nellore",
      pickupArea: orderData.pickupArea || "Nellore Central Hub",
      distanceKm: Number(orderData.distanceKm) || 0,
      itemsCount: Number(orderData.itemsCount) || 1,
      orderType: orderData.orderType || "Standard Delivery",
      basePay: Number(orderData.basePay) || 80,
      surgePay: Number(orderData.surgePay) || 0,
      tip: Number(orderData.tip) || 0,
      earnings: (Number(orderData.basePay) || 80) + (Number(orderData.surgePay) || 0) + (Number(orderData.tip) || 0),
      status: orderData.status || "Completed",
      executiveId: orderData.executiveId || "EXE12345",
      executiveName: orderData.executiveName || "Rahul Sharma"
    };

    setData((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.createOrder(newOrder).catch((e) => console.warn(e));

    return newOrder;
  };

  const updateOrder = (orderId, updates) => {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o)),
      lastUpdated: new Date().toISOString()
    }));

    if (updates.status) {
      supabaseService.updateOrderStatus(orderId, updates.status).catch((e) => console.warn(e));
    }
  };

  const deleteOrder = (orderId) => {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.filter((o) => o.id !== orderId),
      lastUpdated: new Date().toISOString()
    }));
  };

  // -------------------------------------------------------------
  // Earnings Mutations
  // -------------------------------------------------------------
  const updateEarnings = (executiveId, earningsUpdates) => {
    updateExecutive(executiveId, {
      stats: earningsUpdates
    });
  };

  const updatePayoutStatus = (payoutId, payoutUpdates) => {
    setData((prev) => ({
      ...prev,
      earnings: {
        ...prev.earnings,
        payoutHistory: prev.earnings.payoutHistory.map((p) => (p.id === payoutId ? { ...p, ...payoutUpdates } : p))
      },
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.updatePayoutStatus(payoutId, payoutUpdates.status, payoutUpdates.utr).catch((e) => console.warn(e));
  };

  // -------------------------------------------------------------
  // Milestone Mutations
  // -------------------------------------------------------------
  const updateMilestone = (milestoneUpdates) => {
    setData((prev) => ({
      ...prev,
      milestone: {
        ...prev.milestone,
        ...milestoneUpdates
      },
      lastUpdated: new Date().toISOString()
    }));
  };

  const claimMilestoneReward = (milestoneId) => {
    setData((prev) => ({
      ...prev,
      milestone: {
        ...prev.milestone,
        status: "Claimed",
        claimedAt: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.claimMilestone(milestoneId).catch((e) => console.warn(e));
  };

  // -------------------------------------------------------------
  // Contest Mutations
  // -------------------------------------------------------------
  const updateContest = (contestUpdates) => {
    setData((prev) => ({
      ...prev,
      contest: { ...prev.contest, ...contestUpdates },
      lastUpdated: new Date().toISOString()
    }));
  };

  // -------------------------------------------------------------
  // Rewards Mutations
  // -------------------------------------------------------------
  const redeemReward = (rewardId, pointsCost) => {
    setData((prev) => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        userPoints: Math.max(0, (prev.rewards.userPoints || 0) - pointsCost)
      },
      lastUpdated: new Date().toISOString()
    }));
  };

  const updateReward = (rewardId, rewardUpdates) => {
    setData((prev) => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        items: prev.rewards.items.map((r) => (r.id === rewardId ? { ...r, ...rewardUpdates } : r))
      },
      lastUpdated: new Date().toISOString()
    }));
  };

  // -------------------------------------------------------------
  // Referral Mutations
  // -------------------------------------------------------------
  const addReferral = (referral) => {
    const newRef = {
      id: referral.id || `REF${Math.floor(1000 + Math.random() * 9000)}`,
      candidateName: referral.candidateName || referral.name,
      mobile: referral.mobile,
      city: referral.city || "Nellore",
      status: "Invited",
      rewardAmount: 300,
      ordersCompleted: 0,
      targetOrders: 25
    };

    setData((prev) => ({
      ...prev,
      referrals: {
        ...prev.referrals,
        invitedCandidates: [newRef, ...(prev.referrals.invitedCandidates || [])]
      },
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.createReferral(newRef).catch((e) => console.warn(e));
  };

  // -------------------------------------------------------------
  // Notification Mutations
  // -------------------------------------------------------------
  const addNotification = (notif) => {
    const newNotification = {
      id: `NOTIF${Date.now()}`,
      title: notif.title,
      message: notif.message,
      timestamp: "Just now",
      isRead: false,
      tag: notif.tag || "General",
      emoji: notif.emoji || "📢",
      actionUrl: notif.actionUrl || "/app/dashboard",
      recipientExecutiveId: notif.recipientExecutiveId || "all"
    };

    setData((prev) => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications],
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.createNotification(newNotification).catch((e) => console.warn(e));

    return newNotification;
  };

  const markNotificationAsRead = (id) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.markNotificationRead(id).catch((e) => console.warn(e));
  };

  const markAllNotificationsAsRead = () => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
      lastUpdated: new Date().toISOString()
    }));
  };

  // -------------------------------------------------------------
  // Support Tickets Mutations
  // -------------------------------------------------------------
  const createTicket = (ticketData) => {
    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      category: ticketData.category || "General",
      subject: ticketData.subject,
      description: ticketData.description,
      priority: ticketData.priority || "Medium",
      status: "Open",
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      executiveId: ticketData.executiveId || "EXE12345",
      executiveName: ticketData.executiveName || "Delivery Executive",
      messages: [
        {
          sender: "user",
          senderName: ticketData.executiveName || "Delivery Executive",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          message: ticketData.description,
          timestamp: "Just now"
        }
      ]
    };

    setData((prev) => ({
      ...prev,
      tickets: [newTicket, ...prev.tickets],
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.createTicket(newTicket).catch((e) => console.warn(e));

    return newTicket;
  };

  const replyTicket = (ticketId, replyObj) => {
    const newMsg = {
      sender: replyObj.sender || "user",
      senderName: replyObj.senderName,
      avatar: replyObj.avatar || (replyObj.sender === 'user' ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" : null),
      message: replyObj.message,
      timestamp: "Just now"
    };

    setData((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) => {
        if (t.id === ticketId) {
          const updatedMessages = [...(t.messages || []), newMsg];
          const newStatus = replyObj.status || (replyObj.sender === 'agent' ? 'In Progress' : t.status);
          return {
            ...t,
            status: newStatus,
            messages: updatedMessages
          };
        }
        return t;
      }),
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.addTicketMessage(ticketId, newMsg).catch((e) => console.warn(e));
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setData((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)),
      lastUpdated: new Date().toISOString()
    }));

    supabaseService.updateTicket(ticketId, { status: newStatus }).catch((e) => console.warn(e));
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isLoading,
        syncSupabaseLive,
        getExecutive,
        updateExecutive,
        addExecutive,
        deleteExecutive,
        getOrdersForExecutive,
        addOrder,
        updateOrder,
        deleteOrder,
        updateEarnings,
        updatePayoutStatus,
        updateMilestone,
        claimMilestoneReward,
        updateContest,
        redeemReward,
        updateReward,
        addReferral,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        createTicket,
        replyTicket,
        updateTicketStatus,
        supportCategories
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
