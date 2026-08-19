export const earningsSummary = {
  total: 5000,
  deliveryEarnings: 4200,
  bonus: 500,
  referral: 300,
  pendingPayout: 5000,
  nextPayoutDate: "18 Aug 2024 (Monday)",
  payoutAccount: "HDFC Bank (•••• 7821)"
};

export const earningsChartData = {
  today: [
    { label: "8 AM", earnings: 120, orders: 1 },
    { label: "10 AM", earnings: 240, orders: 2 },
    { label: "12 PM", earnings: 180, orders: 2 },
    { label: "2 PM", earnings: 130, orders: 1 },
    { label: "4 PM", earnings: 260, orders: 2 },
    { label: "6 PM", earnings: 340, orders: 3 },
    { label: "8 PM", earnings: 290, orders: 2 }
  ],
  thisWeek: [
    { label: "Mon", earnings: 580, orders: 6, bonus: 50 },
    { label: "Tue", earnings: 720, orders: 7, bonus: 100 },
    { label: "Wed", earnings: 640, orders: 6, bonus: 50 },
    { label: "Thu", earnings: 810, orders: 8, bonus: 100 },
    { label: "Fri", earnings: 890, orders: 9, bonus: 100 },
    { label: "Sat", earnings: 960, orders: 10, bonus: 100 },
    { label: "Sun", earnings: 450, orders: 4, bonus: 0 }
  ],
  thisMonth: [
    { label: "Week 1", earnings: 4850, orders: 48, bonus: 600 },
    { label: "Week 2", earnings: 5200, orders: 52, bonus: 750 },
    { label: "Week 3", earnings: 5000, orders: 50, bonus: 500 },
    { label: "Week 4 (Current)", earnings: 4250, orders: 42, bonus: 500 }
  ],
  custom: [
    { label: "06 Aug", earnings: 620, orders: 6 },
    { label: "07 Aug", earnings: 710, orders: 7 },
    { label: "08 Aug", earnings: 590, orders: 5 },
    { label: "09 Aug", earnings: 830, orders: 8 },
    { label: "10 Aug", earnings: 950, orders: 9 },
    { label: "11 Aug", earnings: 780, orders: 7 },
    { label: "12 Aug", earnings: 770, orders: 7 }
  ]
};

export const dailyEarningsBreakdown = [
  {
    date: "12 Aug 2024 (Today)",
    ordersCount: 7,
    basePay: 560,
    surgePay: 120,
    tips: 40,
    bonus: 50,
    total: 770,
    status: "Processed"
  },
  {
    date: "11 Aug 2024 (Yesterday)",
    ordersCount: 7,
    basePay: 580,
    surgePay: 110,
    tips: 40,
    bonus: 50,
    total: 780,
    status: "Processed"
  },
  {
    date: "10 Aug 2024",
    ordersCount: 9,
    basePay: 710,
    surgePay: 140,
    tips: 50,
    bonus: 50,
    total: 950,
    status: "Processed"
  },
  {
    date: "09 Aug 2024",
    ordersCount: 8,
    basePay: 640,
    surgePay: 90,
    tips: 20,
    bonus: 80,
    total: 830,
    status: "Processed"
  },
  {
    date: "08 Aug 2024",
    ordersCount: 5,
    basePay: 460,
    surgePay: 80,
    tips: 10,
    bonus: 40,
    total: 590,
    status: "Processed"
  }
];

export const payoutHistory = [
  {
    id: "PAY-2024-W32",
    period: "05 Aug 2024 - 11 Aug 2024",
    amount: 5000,
    status: "Pending Transfer",
    expectedDate: "18 Aug 2024",
    bank: "HDFC Bank (•••• 7821)",
    utr: "Pending"
  },
  {
    id: "PAY-2024-W31",
    period: "29 Jul 2024 - 04 Aug 2024",
    amount: 4850,
    status: "Credited",
    expectedDate: "11 Aug 2024",
    bank: "HDFC Bank (•••• 7821)",
    utr: "HDFCN24223948210"
  },
  {
    id: "PAY-2024-W30",
    period: "22 Jul 2024 - 28 Jul 2024",
    amount: 5200,
    status: "Credited",
    expectedDate: "04 Aug 2024",
    bank: "HDFC Bank (•••• 7821)",
    utr: "HDFCN24216823901"
  }
];
