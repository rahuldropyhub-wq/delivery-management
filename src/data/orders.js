export const mockOrders = [
  {
    id: "ORD123456",
    orderDate: "12 Aug 2024",
    orderTime: "02:45 PM",
    customerName: "Suresh Reddy",
    dropArea: "Gandhi Nagar, Nellore",
    distanceKm: 3.8,
    itemsCount: 4,
    orderType: "Instant Delivery",
    basePay: 90,
    surgePay: 25,
    tip: 15,
    earnings: 130,
    status: "Completed", // Completed | Cancelled | Under Review
    ratingGiven: 5,
    deliveredAt: "03:12 PM",
    timeline: [
      { step: "Order Assigned", time: "02:45 PM", completed: true },
      { step: "Picked from Hub", time: "02:58 PM", completed: true },
      { step: "Delivered to Customer", time: "03:12 PM", completed: true }
    ]
  },
  {
    id: "ORD123457",
    orderDate: "12 Aug 2024",
    orderTime: "11:20 AM",
    customerName: "Kavitha R.",
    dropArea: "Trunk Road, Nellore",
    distanceKm: 2.1,
    itemsCount: 2,
    orderType: "Standard Grocery",
    basePay: 70,
    surgePay: 15,
    tip: 10,
    earnings: 95,
    status: "Completed",
    ratingGiven: 5,
    deliveredAt: "11:42 AM",
    timeline: [
      { step: "Order Assigned", time: "11:20 AM", completed: true },
      { step: "Picked from Store", time: "11:30 AM", completed: true },
      { step: "Delivered to Customer", time: "11:42 AM", completed: true }
    ]
  },
  {
    id: "ORD123458",
    orderDate: "11 Aug 2024",
    orderTime: "08:15 PM",
    customerName: "Venkatesh Rao",
    dropArea: "Pogathota, Nellore",
    distanceKm: 4.5,
    itemsCount: 1,
    orderType: "Food & Beverages",
    basePay: 0,
    surgePay: 0,
    tip: 0,
    earnings: 0,
    status: "Cancelled",
    cancelReason: "Customer cancelled before dispatch from hub",
    deliveredAt: null,
    timeline: [
      { step: "Order Assigned", time: "08:15 PM", completed: true },
      { step: "Order Cancelled by Customer", time: "08:22 PM", completed: true }
    ]
  },
  {
    id: "ORD123459",
    orderDate: "11 Aug 2024",
    orderTime: "05:30 PM",
    customerName: "Ananya M.",
    dropArea: "Magunta Layout, Nellore",
    distanceKm: 6.2,
    itemsCount: 6,
    orderType: "Express Delivery",
    basePay: 110,
    surgePay: 30,
    tip: 20,
    earnings: 160,
    status: "Completed",
    ratingGiven: 5,
    deliveredAt: "06:05 PM",
    timeline: [
      { step: "Order Assigned", time: "05:30 PM", completed: true },
      { step: "Picked from Hub", time: "05:42 PM", completed: true },
      { step: "Delivered to Customer", time: "06:05 PM", completed: true }
    ]
  },
  {
    id: "ORD123460",
    orderDate: "11 Aug 2024",
    orderTime: "01:10 PM",
    customerName: "Ramesh Babu",
    dropArea: "Stonehousepet, Nellore",
    distanceKm: 5.0,
    itemsCount: 3,
    orderType: "Pharma Delivery",
    basePay: 100,
    surgePay: 20,
    tip: 0,
    earnings: 120,
    status: "Under Review",
    reviewReason: "Customer OTP re-verification under audit. Earnings will be cleared in 24h.",
    deliveredAt: "01:38 PM",
    timeline: [
      { step: "Order Assigned", time: "01:10 PM", completed: true },
      { step: "Picked from Hub", time: "01:22 PM", completed: true },
      { step: "Delivery Handed Over", time: "01:38 PM", completed: true },
      { step: "Audit Review in Progress", time: "01:40 PM", completed: false }
    ]
  },
  {
    id: "ORD123461",
    orderDate: "10 Aug 2024",
    orderTime: "09:05 PM",
    customerName: "Deepak Kumar",
    dropArea: "Vedayapalem, Nellore",
    distanceKm: 3.2,
    itemsCount: 2,
    orderType: "Instant Delivery",
    basePay: 85,
    surgePay: 25,
    tip: 0,
    earnings: 110,
    status: "Completed",
    ratingGiven: 4.5,
    deliveredAt: "09:28 PM",
    timeline: [
      { step: "Order Assigned", time: "09:05 PM", completed: true },
      { step: "Picked from Hub", time: "09:14 PM", completed: true },
      { step: "Delivered to Customer", time: "09:28 PM", completed: true }
    ]
  },
  {
    id: "ORD123462",
    orderDate: "10 Aug 2024",
    orderTime: "04:15 PM",
    customerName: "Pooja V.",
    dropArea: "BV Nagar, Nellore",
    distanceKm: 4.1,
    itemsCount: 5,
    orderType: "Grocery Bundle",
    basePay: 95,
    surgePay: 20,
    tip: 15,
    earnings: 130,
    status: "Completed",
    ratingGiven: 5,
    deliveredAt: "04:45 PM",
    timeline: [
      { step: "Order Assigned", time: "04:15 PM", completed: true },
      { step: "Picked from Hub", time: "04:26 PM", completed: true },
      { step: "Delivered to Customer", time: "04:45 PM", completed: true }
    ]
  },
  {
    id: "ORD123463",
    orderDate: "10 Aug 2024",
    orderTime: "12:00 PM",
    customerName: "Srikanth M.",
    dropArea: "Dargamitta, Nellore",
    distanceKm: 1.8,
    itemsCount: 1,
    orderType: "Document Parcel",
    basePay: 60,
    surgePay: 10,
    tip: 0,
    earnings: 70,
    status: "Completed",
    ratingGiven: 5,
    deliveredAt: "12:18 PM",
    timeline: [
      { step: "Order Assigned", time: "12:00 PM", completed: true },
      { step: "Picked from Office", time: "12:08 PM", completed: true },
      { step: "Delivered to Customer", time: "12:18 PM", completed: true }
    ]
  },
  {
    id: "ORD123464",
    orderDate: "09 Aug 2024",
    orderTime: "07:45 PM",
    customerName: "Manohar K.",
    dropArea: "Children's Park Road, Nellore",
    distanceKm: 5.5,
    itemsCount: 2,
    orderType: "Food & Beverages",
    basePay: 0,
    surgePay: 0,
    tip: 0,
    earnings: 0,
    status: "Cancelled",
    cancelReason: "Store out of stock for requested items",
    deliveredAt: null,
    timeline: [
      { step: "Order Assigned", time: "07:45 PM", completed: true },
      { step: "Store Cancelled Order", time: "07:52 PM", completed: true }
    ]
  },
  {
    id: "ORD123465",
    orderDate: "09 Aug 2024",
    orderTime: "03:30 PM",
    customerName: "Geetha S.",
    dropArea: "Podalakur Road, Nellore",
    distanceKm: 7.0,
    itemsCount: 4,
    orderType: "Standard Delivery",
    basePay: 120,
    surgePay: 20,
    tip: 10,
    earnings: 150,
    status: "Completed",
    ratingGiven: 5,
    deliveredAt: "04:08 PM",
    timeline: [
      { step: "Order Assigned", time: "03:30 PM", completed: true },
      { step: "Picked from Hub", time: "03:45 PM", completed: true },
      { step: "Delivered to Customer", time: "04:08 PM", completed: true }
    ]
  }
];
