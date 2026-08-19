export const financialServicesData = {
  personalLoan: {
    title: "Personal Loan for Delivery Partners",
    tagline: "Instant pre-approved cash loan with zero paperwork",
    maxAmount: "₹75,000",
    interestRate: "1.1% per month",
    tenure: "3 to 12 Months",
    eligibilityStatus: "Pre-Approved",
    features: [
      "Disbursal within 2 hours directly to linked bank account",
      "Flexible daily/weekly micro-repayments from delivery earnings",
      "No collateral or physical documentation needed",
      "Special subsidized interest rate for 4.8+ rated executives"
    ],
    faqs: [
      { q: "How are EMIs deducted?", a: "EMIs are automatically deducted smoothly from weekly payout balances." },
      { q: "Can I prepay early?", a: "Yes, zero foreclosure charges after 3 completed monthly EMIs." }
    ]
  },
  creditCard: {
    title: "Executive Fuel & Rewards Credit Card",
    tagline: "Co-branded RuPay credit card tailored for delivery executives",
    limit: "₹35,000 Limit",
    annualFee: "Lifetime Free (₹0)",
    cashback: "5% on Fuel & Petrol Pumps",
    eligibilityStatus: "Eligible to Apply",
    features: [
      "5% instant cashback on all petrol and fuel transactions nationwide",
      "1% cashback on grocery and medical store spends",
      "Complimentary ₹5,00,000 accidental road insurance cover",
      "UPI enabled: Link with Google Pay or PhonePe to scan & pay anywhere"
    ],
    faqs: [
      { q: "Is there any joining fee?", a: "Zero joining and zero annual maintenance fee for active partners." }
    ]
  },
  companyCard: {
    title: "DeliveryPro Partner Expense Card",
    tagline: "Smart prepaid wallet for fuel allowance, tolls, and maintenance",
    currentBalance: "₹2,450.00",
    cardNumberMasked: "•••• •••• •••• 4092",
    expiryDate: "08/28",
    status: "Active & Unlocked",
    recentTransactions: [
      { id: "tx-01", merchant: "HPCL Petrol Pump, Trunk Rd", amount: "-₹350.00", date: "11 Aug, 08:30 PM", category: "Fuel" },
      { id: "tx-02", merchant: "Weekly Fuel Allowance Top-up", amount: "+₹1,000.00", date: "10 Aug, 09:00 AM", category: "Credit" },
      { id: "tx-03", merchant: "IOCL Station, Magunta Layout", amount: "-₹200.00", date: "09 Aug, 02:15 PM", category: "Fuel" }
    ],
    monthlyAllowanceRemaining: "₹1,550 of ₹4,000"
  }
};
