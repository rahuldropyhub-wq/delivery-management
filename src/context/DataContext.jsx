import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialExecutives } from '../data/executives';
import { mockOrders } from '../data/orders';
import { earningsSummary, earningsChartData, dailyEarningsBreakdown, payoutHistory } from '../data/earnings';
import { currentMilestone, milestoneHistory } from '../data/milestones';
import { weeklyContestData } from '../data/contest';
import { leaderboardData } from '../data/leaderboard';
import { rewardsData } from '../data/rewards';
import { referralData } from '../data/referrals';
import { initialNotifications } from '../data/notifications';
import { initialTickets, supportCategories } from '../data/tickets';

const DataContext = createContext(null);

const STORAGE_KEY = 'dp_portal_data_v1';

export function DataProvider({ children }) {
  // Initialize state from localStorage or initial seed datasets
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load data from localStorage:", e);
    }

    // Default structure
    // Ensure all initial mock orders have executiveId attached
    const enrichedOrders = mockOrders.map((o) => ({
      ...o,
      executiveId: o.executiveId || "EXE12345",
      executiveName: o.executiveName || "Rahul Sharma"
    }));

    return {
      executives: initialExecutives,
      orders: enrichedOrders,
      earnings: {
        summary: earningsSummary,
        chartData: earningsChartData,
        dailyBreakdown: dailyEarningsBreakdown,
        payoutHistory: payoutHistory
      },
      milestone: {
        ...currentMilestone,
        history: milestoneHistory
      },
      contest: weeklyContestData,
      leaderboard: leaderboardData,
      rewards: rewardsData,
      referrals: referralData,
      notifications: initialNotifications,
      tickets: initialTickets,
      lastUpdated: new Date().toISOString()
    };
  });

  // Persist whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to persist data to localStorage:", e);
    }
  }, [data]);

  // -------------------------------------------------------------
  // Executive Helpers & Mutations
  // -------------------------------------------------------------
  const getExecutive = (id = "EXE12345") => {
    return data.executives.find((e) => e.id === id) || data.executives[0];
  };

  const updateExecutive = (id, updates) => {
    setData((prev) => {
      const updatedExecutives = prev.executives.map((exec) => {
        if (exec.id === id) {
          const newStats = updates.stats ? { ...exec.stats, ...updates.stats } : exec.stats;
          
          // Auto recalculate progress % and remaining orders if weeklyOrders or weeklyTarget updated
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

      // If Rahul Sharma (EXE12345) milestone orders updated, also sync milestone state
      let updatedMilestone = { ...prev.milestone };
      if (id === "EXE12345" && updates.stats?.weeklyOrders !== undefined) {
        const completed = updates.stats.weeklyOrders;
        const target = updates.stats.weeklyTarget ?? updatedMilestone.targetOrders;
        updatedMilestone.completedOrders = completed;
        updatedMilestone.targetOrders = target;
        updatedMilestone.percentage = Math.min(100, Math.round((completed / target) * 100));
        updatedMilestone.remainingOrders = Math.max(0, target - completed);
      }

      return {
        ...prev,
        executives: updatedExecutives,
        milestone: updatedMilestone,
        lastUpdated: new Date().toISOString()
      };
    });
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
      dropArea: orderData.dropArea || "Central Nellore",
      distanceKm: orderData.distanceKm || 3.5,
      itemsCount: orderData.itemsCount || 2,
      orderType: orderData.orderType || "Standard Delivery",
      basePay: Number(orderData.basePay) || 80,
      surgePay: Number(orderData.surgePay) || 20,
      tip: Number(orderData.tip) || 0,
      earnings: (Number(orderData.basePay) || 80) + (Number(orderData.surgePay) || 20) + (Number(orderData.tip) || 0),
      status: orderData.status || "Completed",
      ratingGiven: 5,
      deliveredAt: orderData.status === "Completed" ? (orderData.deliveredAt || "Just now") : null,
      timeline: [
        { step: "Order Assigned", time: "Assigned", completed: true },
        { step: "Picked from Hub", time: "Picked", completed: true },
        { step: "Delivered to Customer", time: "Delivered", completed: orderData.status === "Completed" }
      ],
      executiveId: orderData.executiveId || "EXE12345",
      executiveName: orderData.executiveName || "Rahul Sharma"
    };

    setData((prev) => {
      const updatedOrders = [newOrder, ...prev.orders];

      // Auto update executive stats if completed
      const exec = prev.executives.find((e) => e.id === newOrder.executiveId);
      let updatedExecutives = prev.executives;
      if (exec && newOrder.status === "Completed") {
        const newWeeklyOrders = (exec.stats.weeklyOrders || 0) + 1;
        const newDeliveryEarnings = (exec.stats.deliveryEarnings || 0) + newOrder.earnings;
        const newTotalEarnings = (exec.stats.totalEarnings || 0) + newOrder.earnings;
        
        updatedExecutives = prev.executives.map((e) => {
          if (e.id === exec.id) {
            return {
              ...e,
              stats: {
                ...e.stats,
                weeklyOrders: newWeeklyOrders,
                completedOrders: (e.stats.completedOrders || 0) + 1,
                deliveryEarnings: newDeliveryEarnings,
                weeklyEarnings: (e.stats.weeklyEarnings || 0) + newOrder.earnings,
                totalEarnings: newTotalEarnings,
                progressPercentage: Math.min(100, Math.round((newWeeklyOrders / (e.stats.weeklyTarget || 50)) * 100)),
                remainingOrders: Math.max(0, (e.stats.weeklyTarget || 50) - newWeeklyOrders)
              }
            };
          }
          return e;
        });
      }

      return {
        ...prev,
        orders: updatedOrders,
        executives: updatedExecutives,
        lastUpdated: new Date().toISOString()
      };
    });
    return newOrder;
  };

  const updateOrder = (orderId, updates) => {
    setData((prev) => {
      const updatedOrders = prev.orders.map((ord) => {
        if (ord.id === orderId) {
          const merged = { ...ord, ...updates };
          if (updates.basePay !== undefined || updates.surgePay !== undefined || updates.tip !== undefined) {
            merged.earnings = (Number(merged.basePay) || 0) + (Number(merged.surgePay) || 0) + (Number(merged.tip) || 0);
          }
          return merged;
        }
        return ord;
      });
      return {
        ...prev,
        orders: updatedOrders,
        lastUpdated: new Date().toISOString()
      };
    });
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
    setData((prev) => {
      const updatedExecutives = prev.executives.map((exec) => {
        if (exec.id === executiveId) {
          const stats = {
            ...exec.stats,
            deliveryEarnings: earningsUpdates.deliveryEarnings ?? exec.stats.deliveryEarnings,
            bonusEarnings: earningsUpdates.bonusEarnings ?? exec.stats.bonusEarnings,
            referralEarnings: earningsUpdates.referralEarnings ?? exec.stats.referralEarnings,
            weeklyEarnings: (earningsUpdates.deliveryEarnings ?? exec.stats.deliveryEarnings) + (earningsUpdates.bonusEarnings ?? exec.stats.bonusEarnings),
            totalEarnings: (earningsUpdates.deliveryEarnings ?? exec.stats.deliveryEarnings) + (earningsUpdates.bonusEarnings ?? exec.stats.bonusEarnings) + (earningsUpdates.referralEarnings ?? exec.stats.referralEarnings)
          };
          return { ...exec, stats };
        }
        return exec;
      });

      const updatedSummary = {
        ...prev.earnings.summary,
        deliveryEarnings: earningsUpdates.deliveryEarnings ?? prev.earnings.summary.deliveryEarnings,
        bonus: earningsUpdates.bonusEarnings ?? prev.earnings.summary.bonus,
        referral: earningsUpdates.referralEarnings ?? prev.earnings.summary.referral,
        total: (earningsUpdates.deliveryEarnings ?? prev.earnings.summary.deliveryEarnings) + (earningsUpdates.bonusEarnings ?? prev.earnings.summary.bonus) + (earningsUpdates.referralEarnings ?? prev.earnings.summary.referral),
        pendingPayout: (earningsUpdates.deliveryEarnings ?? prev.earnings.summary.deliveryEarnings) + (earningsUpdates.bonusEarnings ?? prev.earnings.summary.bonus) + (earningsUpdates.referralEarnings ?? prev.earnings.summary.referral)
      };

      return {
        ...prev,
        executives: updatedExecutives,
        earnings: {
          ...prev.earnings,
          summary: updatedSummary
        },
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const updatePayoutStatus = (payoutId, updates) => {
    setData((prev) => {
      const updatedPayouts = prev.earnings.payoutHistory.map((pay) => {
        if (pay.id === payoutId) {
          return { ...pay, ...updates };
        }
        return pay;
      });
      return {
        ...prev,
        earnings: {
          ...prev.earnings,
          payoutHistory: updatedPayouts
        },
        lastUpdated: new Date().toISOString()
      };
    });
  };

  // -------------------------------------------------------------
  // Milestone Mutations
  // -------------------------------------------------------------
  const updateMilestone = (updates) => {
    setData((prev) => {
      const updatedMilestone = {
        ...prev.milestone,
        ...updates
      };
      // Auto calc percentage
      if (updatedMilestone.targetOrders && updatedMilestone.completedOrders !== undefined) {
        updatedMilestone.percentage = Math.min(100, Math.round((updatedMilestone.completedOrders / updatedMilestone.targetOrders) * 100));
        updatedMilestone.remainingOrders = Math.max(0, updatedMilestone.targetOrders - updatedMilestone.completedOrders);
      }

      // Sync to default executive stats (Rahul)
      const updatedExecutives = prev.executives.map((exec) => {
        if (exec.id === "EXE12345") {
          return {
            ...exec,
            stats: {
              ...exec.stats,
              weeklyOrders: updatedMilestone.completedOrders,
              weeklyTarget: updatedMilestone.targetOrders,
              progressPercentage: updatedMilestone.percentage,
              remainingOrders: updatedMilestone.remainingOrders,
              nextReward: updatedMilestone.reward
            }
          };
        }
        return exec;
      });

      return {
        ...prev,
        milestone: updatedMilestone,
        executives: updatedExecutives,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  // -------------------------------------------------------------
  // Contest Mutations
  // -------------------------------------------------------------
  const updateContest = (updates) => {
    setData((prev) => ({
      ...prev,
      contest: {
        ...prev.contest,
        ...updates
      },
      lastUpdated: new Date().toISOString()
    }));
  };

  // -------------------------------------------------------------
  // Leaderboard Mutations
  // -------------------------------------------------------------
  const updateLeaderboard = (updates) => {
    setData((prev) => ({
      ...prev,
      leaderboard: {
        ...prev.leaderboard,
        ...updates
      },
      lastUpdated: new Date().toISOString()
    }));
  };

  // -------------------------------------------------------------
  // Rewards Mutations
  // -------------------------------------------------------------
  const updateReward = (rewardId, updates) => {
    setData((prev) => {
      const updatedCash = prev.rewards.cashRewards.map((r) => (r.id === rewardId ? { ...r, ...updates } : r));
      const updatedPhysical = prev.rewards.physicalRewards.map((r) => (r.id === rewardId ? { ...r, ...updates } : r));
      return {
        ...prev,
        rewards: {
          ...prev.rewards,
          cashRewards: updatedCash,
          physicalRewards: updatedPhysical
        },
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const claimReward = (rewardId, addressDetails) => {
    setData((prev) => {
      const updatedCash = prev.rewards.cashRewards.map((r) => {
        if (r.id === rewardId) {
          return { ...r, status: "Claimed", canClaim: false, claimedDate: "Today" };
        }
        return r;
      });

      const updatedPhysical = prev.rewards.physicalRewards.map((r) => {
        if (r.id === rewardId) {
          return {
            ...r,
            status: "Claimed",
            canClaim: false,
            claimedDate: "Today",
            deliveryStatus: "Processing for Dispatch",
            shippingAddress: addressDetails
          };
        }
        return r;
      });

      // Add a confirmation notification
      const newNotif = {
        id: `notif-reward-${Date.now()}`,
        type: "bonus",
        emoji: "🎁",
        title: "Reward Claim Submitted!",
        message: "Your reward claim request has been registered and is being processed by the Hub Manager.",
        timeAgo: "Just now",
        date: "Today",
        isRead: false,
        actionUrl: "/app/rewards",
        tag: "Reward"
      };

      return {
        ...prev,
        rewards: {
          ...prev.rewards,
          cashRewards: updatedCash,
          physicalRewards: updatedPhysical
        },
        notifications: [newNotif, ...prev.notifications],
        lastUpdated: new Date().toISOString()
      };
    });
  };

  // -------------------------------------------------------------
  // Referral Mutations
  // -------------------------------------------------------------
  const updateReferral = (referralId, updates) => {
    setData((prev) => {
      const updatedList = prev.referrals.referralsList.map((ref) => {
        if (ref.id === referralId) {
          return { ...ref, ...updates };
        }
        return ref;
      });

      // Recalculate stats
      const successful = updatedList.filter((r) => r.status === "Successful").length;
      const pending = updatedList.filter((r) => r.status !== "Successful").length;
      const totalEarned = successful * 300;

      return {
        ...prev,
        referrals: {
          ...prev.referrals,
          stats: {
            ...prev.referrals.stats,
            successful,
            pending,
            totalEarned
          },
          referralsList: updatedList
        },
        lastUpdated: new Date().toISOString()
      };
    });
  };

  // -------------------------------------------------------------
  // Notification Mutations
  // -------------------------------------------------------------
  const addNotification = (notifData) => {
    const newNotif = {
      id: notifData.id || `notif-${Date.now()}`,
      type: notifData.type || "system",
      emoji: notifData.emoji || "📢",
      title: notifData.title || "New Announcement",
      message: notifData.message || "",
      timeAgo: "Just now",
      date: "Today",
      isRead: false,
      actionUrl: notifData.actionUrl || "/app/dashboard",
      tag: notifData.tag || "General",
      recipientExecutiveId: notifData.recipientExecutiveId || "all"
    };

    setData((prev) => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications],
      lastUpdated: new Date().toISOString()
    }));
    return newNotif;
  };

  const markNotificationRead = (notifId) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)),
      lastUpdated: new Date().toISOString()
    }));
  };

  const markAllNotificationsRead = () => {
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
      id: `TKT${Math.floor(1000 + Math.random() * 9000)}`,
      category: ticketData.category || "Order Issue",
      subject: ticketData.subject || "Support Query",
      description: ticketData.description || "",
      status: "Open",
      priority: ticketData.priority || "Medium",
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      updatedAt: "Just now",
      executiveId: ticketData.executiveId || "EXE12345",
      executiveName: ticketData.executiveName || "Rahul Sharma",
      messages: [
        {
          sender: "user",
          senderName: ticketData.executiveName || "Rahul Sharma",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          message: ticketData.description,
          time: "Just now"
        },
        {
          sender: "system",
          senderName: "Support Bot",
          message: `Your ticket has been logged and assigned to Hub Management. A manager will review your query shortly.`,
          time: "Just now"
        }
      ]
    };

    setData((prev) => ({
      ...prev,
      tickets: [newTicket, ...prev.tickets],
      lastUpdated: new Date().toISOString()
    }));
    return newTicket;
  };

  const replyTicket = (ticketId, reply) => {
    setData((prev) => {
      const updatedTickets = prev.tickets.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            sender: reply.sender || "agent",
            senderName: reply.senderName || "Hub Manager",
            avatar: reply.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
            message: reply.message,
            time: "Just now"
          };
          return {
            ...t,
            status: reply.status || t.status,
            updatedAt: "Just now",
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      });

      return {
        ...prev,
        tickets: updatedTickets,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const updateTicketStatus = (ticketId, status, priority) => {
    setData((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: status || t.status,
            priority: priority || t.priority,
            updatedAt: "Just now"
          };
        }
        return t;
      }),
      lastUpdated: new Date().toISOString()
    }));
  };

  // -------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <DataContext.Provider
      value={{
        data,
        getExecutive,
        updateExecutive,
        getOrdersForExecutive,
        addOrder,
        updateOrder,
        deleteOrder,
        updateEarnings,
        updatePayoutStatus,
        updateMilestone,
        updateContest,
        updateLeaderboard,
        updateReward,
        claimReward,
        updateReferral,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        createTicket,
        replyTicket,
        updateTicketStatus,
        resetToDefaults,
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
