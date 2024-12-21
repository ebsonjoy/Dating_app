export interface UserChartData {
    totalUsers: number;
    userGrowthData: Array<{ date: string; count: number }>;
  }
  
 export interface PaymentChartData {
    totalPayments: number;
    paymentGrowthData: Array<{ date: string; amount: number }>;
  }
  
 
  