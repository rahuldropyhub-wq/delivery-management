export const weeklyContestData = {
  title: "Weekly Delivery Champion",
  subtitle: "Compete with top executives across the zone to win exciting cash bonuses!",
  dates: "10 Aug – 16 Aug 2024",
  status: "Active",
  daysRemaining: 4,
  hoursRemaining: 14,
  prizes: [
    {
      position: 1,
      badge: "🥇 1st Place",
      amount: "₹1,000",
      description: "Gold Champion Trophy + Instant Payout",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50 border-amber-200"
    },
    {
      position: 2,
      badge: "🥈 2nd Place",
      amount: "₹750",
      description: "Silver Runner-Up + Instant Payout",
      iconColor: "text-slate-400",
      bgColor: "bg-slate-50 border-slate-200"
    },
    {
      position: 3,
      badge: "🥉 3rd Place",
      amount: "₹500",
      description: "Bronze Podium + Instant Payout",
      iconColor: "text-amber-700",
      bgColor: "bg-amber-900/10 border-amber-800/20"
    }
  ],
  userStanding: {
    position: 12,
    orders: 42,
    targetForTop10: 48,
    ordersToNextRank: 2,
    percentile: "Top 15%",
    trend: "+3 ranks since yesterday"
  },
  rules: [
    "Only successfully completed and verified customer deliveries count towards contest score.",
    "Minimum 95% on-time delivery rate required to be eligible for podium cash rewards.",
    "Contest results are audited and finalized on 17th Aug 2024 at 10:00 AM.",
    "Winners will receive prize money directly credited to their linked bank account."
  ]
};
