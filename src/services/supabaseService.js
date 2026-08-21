import { supabase, isSupabaseConfigured } from '../config/supabase';

// ==============================================================================
// 🚀 SUPABASE LIVE DATA SERVICE LAYER (PRODUCTION - PURE LIVE DATA ONLY)
// ==============================================================================

export const supabaseService = {
  // -------------------------------------------------------------
  // 1. EXECUTIVES
  // -------------------------------------------------------------
  async fetchExecutives() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('executives').select('*').order('name');
      if (error) {
        console.warn('Supabase fetchExecutives error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.warn('Supabase fetchExecutives exception:', err);
      return [];
    }
  },

  async addExecutive(exec) {
    if (!isSupabaseConfigured) return null;
    try {
      const row = {
        id: exec.id,
        name: exec.name,
        avatar: exec.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        mobile: exec.mobile,
        email: exec.email,
        city: exec.city || 'Hyderabad',
        zone: exec.zone || 'Hyderabad Central Hub (Zone 1 - Hitec City / Madhapur)',
        dob: exec.dob || null,
        blood_group: exec.bloodGroup || null,
        emergency_contact: exec.emergencyContact || null,
        joining_date: exec.joiningDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        kyc_status: exec.kycStatus || 'Verified',
        account_status: exec.accountStatus || 'Active',
        rating: Number(exec.rating) || 5.0,
        total_deliveries_lifetime: Number(exec.totalDeliveriesLifetime) || Number(exec.stats?.weeklyOrders) || 0,
        vehicle_type: exec.vehicleInfo?.type || 'Two Wheeler (Bike)',
        vehicle_model: exec.vehicleInfo?.model || null,
        vehicle_reg_number: exec.vehicleInfo?.regNumber || null,
        driving_license: exec.drivingLicense || exec.vehicleInfo?.license || null,
        bank_name: exec.payoutAccount?.bankName || exec.bankName || null,
        bank_account_masked: exec.payoutAccount?.accountNumberMasked || exec.bankAccountMasked || null,
        upi_id: exec.payoutAccount?.upiId || exec.upiId || null,
        weekly_orders: Number(exec.stats?.weeklyOrders) || 0,
        weekly_target: Number(exec.stats?.weeklyTarget) || 50,
        weekly_earnings: Number(exec.stats?.weeklyEarnings) || 0,
        delivery_earnings: Number(exec.stats?.deliveryEarnings) || 0,
        bonus_earnings: Number(exec.stats?.bonusEarnings) || 0,
        referral_earnings: Number(exec.stats?.referralEarnings) || 0,
        rank: Number(exec.stats?.rank) || 1
      };
      const { data, error } = await supabase.from('executives').upsert(row).select().single();
      if (error) console.warn('Supabase addExecutive error:', error.message);
      return data;
    } catch (e) {
      console.warn('Supabase addExecutive exception:', e);
      return null;
    }
  },

  async updateExecutive(id, updates) {
    if (!isSupabaseConfigured) return null;
    try {
      const payload = {
        updated_at: new Date().toISOString()
      };
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.mobile !== undefined) payload.mobile = updates.mobile;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.zone !== undefined) payload.zone = updates.zone;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.accountStatus !== undefined) payload.account_status = updates.accountStatus;
      if (updates.kycStatus !== undefined) payload.kyc_status = updates.kycStatus;
      if (updates.rating !== undefined) payload.rating = updates.rating;
      if (updates.vehicleInfo?.model !== undefined) payload.vehicle_model = updates.vehicleInfo.model;
      if (updates.vehicleInfo?.regNumber !== undefined) payload.vehicle_reg_number = updates.vehicleInfo.regNumber;
      if (updates.drivingLicense !== undefined) payload.driving_license = updates.drivingLicense;
      if (updates.stats?.weeklyOrders !== undefined) payload.weekly_orders = updates.stats.weeklyOrders;
      if (updates.stats?.weeklyTarget !== undefined) payload.weekly_target = updates.stats.weeklyTarget;
      if (updates.stats?.deliveryEarnings !== undefined) payload.delivery_earnings = updates.stats.deliveryEarnings;
      if (updates.stats?.bonusEarnings !== undefined) payload.bonus_earnings = updates.stats.bonusEarnings;
      if (updates.stats?.referralEarnings !== undefined) payload.referral_earnings = updates.stats.referralEarnings;
      if (updates.stats?.weeklyEarnings !== undefined) payload.weekly_earnings = updates.stats.weeklyEarnings;

      const { data, error } = await supabase.from('executives').update(payload).eq('id', id).select().single();
      if (error) console.warn('Supabase updateExecutive error:', error.message);
      return data;
    } catch (e) {
      console.warn('Supabase updateExecutive exception:', e);
      return null;
    }
  },

  async deleteExecutive(id) {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('executives').delete().eq('id', id);
      if (error) console.warn('Supabase deleteExecutive error:', error.message);
      return !error;
    } catch (e) {
      console.warn('Supabase deleteExecutive exception:', e);
      return false;
    }
  },

  // -------------------------------------------------------------
  // 2. ORDERS
  // -------------------------------------------------------------
  async fetchOrders() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async createOrder(order) {
    if (!isSupabaseConfigured) return null;
    try {
      const row = {
        id: order.id,
        executive_id: order.executiveId,
        executive_name: order.executiveName,
        customer_name: order.customerName,
        customer_phone: order.customerPhone || null,
        drop_area: order.dropArea,
        pickup_area: order.pickupArea || 'Hyderabad Central Hub',
        distance_km: Number(order.distanceKm) || 0,
        items_count: Number(order.itemsCount) || 1,
        order_type: order.orderType || 'Standard Delivery',
        base_pay: Number(order.basePay) || 80,
        surge_pay: Number(order.surgePay) || 0,
        tip: Number(order.tip) || 0,
        earnings: (Number(order.basePay) || 80) + (Number(order.surgePay) || 0) + (Number(order.tip) || 0),
        status: order.status || 'Completed',
        order_date: order.orderDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        order_time: order.orderTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      const { data, error } = await supabase.from('orders').insert(row).select().single();
      if (error) console.warn('Supabase createOrder error:', error.message);
      return data;
    } catch (e) {
      console.warn('Supabase createOrder exception:', e);
      return null;
    }
  },

  async updateOrderStatus(orderId, status) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select().single();
      return data;
    } catch (e) {
      return null;
    }
  },

  // -------------------------------------------------------------
  // 3. PAYOUTS
  // -------------------------------------------------------------
  async fetchPayouts() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('payouts').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async createPayout(payout) {
    if (!isSupabaseConfigured) return null;
    try {
      const row = {
        id: payout.id,
        executive_id: payout.executiveId,
        payout_date: payout.date || payout.payoutDate,
        cycle_name: payout.cycle || payout.cycleName || 'Weekly Cycle',
        delivery_pay: Number(payout.deliveryPay || payout.breakdown?.deliveryPay || 0),
        incentives: Number(payout.incentives || payout.breakdown?.incentives || 0),
        tips: Number(payout.tips || payout.breakdown?.tips || 0),
        deductions: Number(payout.deductions || payout.breakdown?.deductions || 0),
        net_amount: Number(payout.netAmount || payout.amount || 0),
        bank_name: payout.bankDetails?.bankName || payout.bankName || null,
        account_masked: payout.bankDetails?.accountMasked || payout.accountMasked || null,
        reference_number: payout.referenceNumber || `REF-DP-${Date.now()}`,
        utr: payout.utr || null,
        expected_date: payout.expectedDate || null,
        status: payout.status || 'Processing',
        is_instant: Boolean(payout.isInstant)
      };
      const { data, error } = await supabase.from('payouts').insert(row).select().single();
      return data;
    } catch (e) {
      return null;
    }
  },

  async updatePayoutStatus(payoutId, status, utr = null) {
    if (!isSupabaseConfigured) return null;
    try {
      const payload = { status };
      if (utr) payload.utr = utr;
      const { data, error } = await supabase.from('payouts').update(payload).eq('id', payoutId).select().single();
      return data;
    } catch (e) {
      return null;
    }
  },

  // -------------------------------------------------------------
  // 4. MILESTONES
  // -------------------------------------------------------------
  async fetchMilestones() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('milestones').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async claimMilestone(milestoneId) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('milestones')
        .update({
          status: 'Claimed',
          claimed_at: new Date().toISOString()
        })
        .eq('id', milestoneId)
        .select()
        .single();
      return data;
    } catch (e) {
      return null;
    }
  },

  // -------------------------------------------------------------
  // 5. REWARDS
  // -------------------------------------------------------------
  async fetchRewards() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('rewards').select('*').order('points_cost');
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  // -------------------------------------------------------------
  // 6. REFERRALS
  // -------------------------------------------------------------
  async fetchReferrals() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('referrals').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async createReferral(referral) {
    if (!isSupabaseConfigured) return null;
    try {
      const row = {
        id: referral.id,
        referrer_id: referral.referrerId,
        referrer_name: referral.referrerName,
        candidate_name: referral.candidateName || referral.name,
        mobile: referral.mobile,
        email: referral.email || null,
        city: referral.city || 'Hyderabad',
        status: referral.status || 'Invited',
        reward_amount: Number(referral.rewardAmount) || 300,
        orders_completed: Number(referral.ordersCompleted) || 0,
        target_orders: Number(referral.targetOrders) || 25
      };
      const { data, error } = await supabase.from('referrals').insert(row).select().single();
      return data;
    } catch (e) {
      return null;
    }
  },

  // -------------------------------------------------------------
  // 7. NOTIFICATIONS
  // -------------------------------------------------------------
  async fetchNotifications() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async createNotification(notif) {
    if (!isSupabaseConfigured) return null;
    try {
      const row = {
        id: notif.id,
        recipient_executive_id: notif.recipientExecutiveId || 'all',
        title: notif.title,
        message: notif.message,
        tag: notif.tag || 'General',
        emoji: notif.emoji || '📢',
        action_url: notif.actionUrl || '/app/dashboard',
        is_read: false,
        timestamp: notif.timestamp || new Date().toISOString()
      };
      const { data, error } = await supabase.from('notifications').insert(row).select().single();
      return data;
    } catch (e) {
      return null;
    }
  },

  async markNotificationRead(id) {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch (e) { }
  },

  // -------------------------------------------------------------
  // 8. SUPPORT TICKETS & MESSAGES
  // -------------------------------------------------------------
  async fetchTickets() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('support_tickets').select('*').order('updated_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async createTicket(ticket) {
    if (!isSupabaseConfigured) return null;
    try {
      const row = {
        id: ticket.id,
        executive_id: ticket.executiveId,
        executive_name: ticket.executiveName,
        subject: ticket.subject,
        category: ticket.category || 'General',
        priority: ticket.priority || 'Medium',
        status: ticket.status || 'Open',
        description: ticket.description,
        messages: ticket.messages || []
      };
      const { data, error } = await supabase.from('support_tickets').insert(row).select().single();
      return data;
    } catch (e) {
      return null;
    }
  },

  async updateTicket(ticketId, updates) {
    if (!isSupabaseConfigured) return null;
    try {
      const payload = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from('support_tickets').update(payload).eq('id', ticketId).select().single();
      return data;
    } catch (e) {
      return null;
    }
  },

  async addTicketMessage(ticketId, messageObj) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data: ticket } = await supabase.from('support_tickets').select('messages').eq('id', ticketId).single();
      const currentMessages = ticket?.messages || [];
      const updatedMessages = [...currentMessages, messageObj];

      const { data, error } = await supabase
        .from('support_tickets')
        .update({
          messages: updatedMessages,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)
        .select()
        .single();
      return data;
    } catch (e) {
      return null;
    }
  }
};
