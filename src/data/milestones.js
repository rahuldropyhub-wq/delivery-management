export const currentMilestone = {
  title: "Weekly Target",
  targetOrders: 50,
  completedOrders: 42,
  percentage: 84,
  remainingOrders: 8,
  reward: "₹500 Bonus",
  period: "12 Aug - 18 Aug 2024",
  deadline: "18 Aug 2024, 11:59 PM",
  status: "In Progress",
  tiers: [
    {
      id: "tier-1",
      name: "Bronze Tier",
      target: 25,
      reward: "₹150 Bonus",
      achieved: true,
      achievedAt: "10 Aug 2024"
    },
    {
      id: "tier-2",
      name: "Silver Tier",
      target: 35,
      reward: "₹300 Bonus",
      achieved: true,
      achievedAt: "11 Aug 2024"
    },
    {
      id: "tier-3",
      name: "Gold Tier (Active)",
      target: 50,
      reward: "₹500 Bonus",
      achieved: false,
      currentProgress: 42,
      isCurrent: true
    },
    {
      id: "tier-4",
      name: "Platinum Tier",
      target: 70,
      reward: "₹850 Bonus",
      achieved: false,
      currentProgress: 42,
      isCurrent: false
    }
  ]
};

export const milestoneHistory = [
  {
    id: "ms-hist-w31",
    period: "29 Jul - 04 Aug 2024",
    target: 50,
    achieved: 52,
    completionPercentage: 104,
    reward: "₹500 Bonus",
    completedDate: "04 Aug 2024",
    status: "Completed & Credited"
  },
  {
    id: "ms-hist-w30",
    period: "22 Jul - 28 Jul 2024",
    target: 50,
    achieved: 55,
    completionPercentage: 110,
    reward: "₹600 Bonus",
    completedDate: "28 Jul 2024",
    status: "Completed & Credited"
  },
  {
    id: "ms-hist-w29",
    period: "15 Jul - 21 Jul 2024",
    target: 45,
    achieved: 46,
    completionPercentage: 102,
    reward: "₹400 Bonus",
    completedDate: "21 Jul 2024",
    status: "Completed & Credited"
  }
];
