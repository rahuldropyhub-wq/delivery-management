export const supportCategories = [
  "Earnings Issue",
  "Order Issue",
  "KYC Issue",
  "Reward Issue",
  "Referral Issue",
  "Account Issue"
];

export const initialTickets = [
  {
    id: "TKT1001",
    category: "Earnings Issue",
    subject: "Surge pay clarification for Order ORD123460",
    description: "I delivered order ORD123460 during peak rain hours but the review reason mentions OTP audit. When will the ₹120 payout be cleared to my wallet?",
    status: "Open", // Open | In Progress | Resolved
    priority: "High",
    createdAt: "12 Aug 2024, 02:15 PM",
    updatedAt: "12 Aug 2024, 02:15 PM",
    messages: [
      {
        sender: "user",
        senderName: "Rahul Sharma",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        message: "I delivered order ORD123460 during peak rain hours but the review reason mentions OTP audit. When will the ₹120 payout be cleared to my wallet?",
        time: "12 Aug 2024, 02:15 PM"
      },
      {
        sender: "system",
        senderName: "Support Bot",
        message: "Your ticket has been assigned to Nellore Hub Support Desk. Average response time is under 2 hours.",
        time: "12 Aug 2024, 02:16 PM"
      }
    ]
  },
  {
    id: "TKT1002",
    category: "Order Issue",
    subject: "Customer address landmark mismatch on ORD123458",
    description: "The pin location on the map was 1.5 km away from customer's actual residence in Pogathota. Order got cancelled by customer before re-dispatch.",
    status: "In Progress",
    priority: "Medium",
    createdAt: "11 Aug 2024, 08:30 PM",
    updatedAt: "12 Aug 2024, 09:10 AM",
    messages: [
      {
        sender: "user",
        senderName: "Rahul Sharma",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        message: "The pin location on the map was 1.5 km away from customer's actual residence in Pogathota. Order got cancelled by customer before re-dispatch.",
        time: "11 Aug 2024, 08:30 PM"
      },
      {
        sender: "agent",
        senderName: "Priya (Hub Operations)",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
        message: "Hi Rahul, thank you for reporting this. We have verified the geo-fence error and marked this cancellation as non-fault. Your completion percentage score will remain protected.",
        time: "12 Aug 2024, 09:10 AM"
      }
    ]
  },
  {
    id: "TKT1003",
    category: "KYC Issue",
    subject: "Vehicle registration certificate record update",
    description: "Updated insurance policy document for scooter AP 26 BP 4589. Please confirm validity until 2026.",
    status: "Resolved",
    priority: "Low",
    createdAt: "02 Aug 2024, 10:45 AM",
    updatedAt: "03 Aug 2024, 11:30 AM",
    messages: [
      {
        sender: "user",
        senderName: "Rahul Sharma",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        message: "Updated insurance policy document for scooter AP 26 BP 4589. Please confirm validity until 2026.",
        time: "02 Aug 2024, 10:45 AM"
      },
      {
        sender: "agent",
        senderName: "Arun Kumar (Partner Success)",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
        message: "Insurance record verified and validity updated to 12 Dec 2026. Your vehicle details are in good standing.",
        time: "03 Aug 2024, 11:30 AM"
      }
    ]
  },
  {
    id: "TKT1004",
    category: "Reward Issue",
    subject: "Raincoat merchandise pickup confirmation",
    description: "Collected the heavy duty raincoat from Hub Manager at Nellore Hub. Ticket can be closed.",
    status: "Resolved",
    priority: "Low",
    createdAt: "26 Jul 2024, 04:20 PM",
    updatedAt: "26 Jul 2024, 05:00 PM",
    messages: [
      {
        sender: "user",
        senderName: "Rahul Sharma",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        message: "Collected the heavy duty raincoat from Hub Manager at Nellore Hub. Ticket can be closed.",
        time: "26 Jul 2024, 04:20 PM"
      },
      {
        sender: "agent",
        senderName: "Hub Manager Nellore",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
        message: "Handover acknowledged. Enjoy safe riding in the rain!",
        time: "26 Jul 2024, 05:00 PM"
      }
    ]
  }
];
