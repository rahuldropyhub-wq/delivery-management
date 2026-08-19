export const rewardsData = {
  cashRewards: [
    {
      id: "cr-01",
      title: "₹500 Weekly Milestone Bonus",
      amount: 500,
      status: "Unlocked", // Unlocked | Claimed | Locked
      criteria: "Complete 50 orders in Week 33",
      unlockedDate: "12 Aug 2024",
      canClaim: true,
      description: "Hit your 50 orders target to claim this cash bonus directly to your bank account."
    },
    {
      id: "cr-02",
      title: "₹1,000 Champion Bonus",
      amount: 1000,
      status: "Locked",
      criteria: "Finish in Top 3 of Weekly Delivery Champion Contest",
      progress: "Currently #12 (Need 37 more orders to enter top 3)",
      canClaim: false,
      description: "Compete in the weekly leaderboard contest to unlock the podium prize."
    },
    {
      id: "cr-03",
      title: "₹300 On-Time Star Bonus",
      amount: 300,
      status: "Claimed",
      criteria: "Maintain 100% on-time delivery over 30 orders",
      claimedDate: "05 Aug 2024",
      utr: "HDFCN24218849102",
      canClaim: false,
      description: "Credited with your previous weekly payout."
    },
    {
      id: "cr-04",
      title: "₹150 Weekend Rush Bonus",
      amount: 150,
      status: "Claimed",
      criteria: "Deliver 15 orders on Saturday & Sunday peak hours",
      claimedDate: "05 Aug 2024",
      utr: "HDFCN24218849103",
      canClaim: false,
      description: "Credited with your previous weekly payout."
    }
  ],
  physicalRewards: [
    {
      id: "pr-01",
      name: "DeliveryPro Premium Polo T-Shirt",
      type: "Merchandise & Uniform",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80",
      status: "Claimed", // Claimed | Delivered | Unlocked | Locked
      size: "Size L (Standard Fit)",
      claimedDate: "15 Jul 2024",
      deliveryStatus: "Delivered to Nellore Central Hub",
      trackingNote: "Collected by Rahul Sharma on 20 Jul 2024"
    },
    {
      id: "pr-02",
      name: "Heavy-Duty All-Weather Raincoat",
      type: "Protective Gear",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80",
      status: "Delivered",
      size: "Size XL (Over-jacket Fit)",
      claimedDate: "25 Jul 2024",
      deliveryStatus: "Delivered",
      deliveryDate: "02 Aug 2024",
      trackingNote: "Handed over by Hub Manager"
    },
    {
      id: "pr-03",
      name: "Waterproof Bike Phone Mount & Pouch",
      type: "Vehicle Accessory",
      image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&auto=format&fit=crop&q=80",
      status: "Unlocked",
      claimedDate: null,
      canClaim: true,
      description: "Unlocked after completing 3,000 lifetime deliveries. Claim to receive at your hub!"
    },
    {
      id: "pr-04",
      name: "Winter Windproof Insulated Jacket",
      type: "Merchandise & Uniform",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&auto=format&fit=crop&q=80",
      status: "Locked",
      progress: "3,420 / 4,000 Lifetime Deliveries (580 to unlock)",
      canClaim: false,
      description: "Will unlock automatically upon reaching 4,000 verified lifetime deliveries."
    }
  ]
};
