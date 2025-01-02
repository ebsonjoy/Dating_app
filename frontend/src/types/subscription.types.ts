export interface IPlansData{
    _id: string;
    planName: string;
    duration: string;
    offerPercentage: number;
    actualPrice: number;
    offerPrice: number;
    offerName: string;
    status:boolean;
    features:string[];
  }
 export interface IpaymentData{
    isPremium: boolean;
    planId:string;
    planExpiryDate:Date;
    planStartingDate:Date;
  }
  
 export interface IUserSubscriptionResponse {
    userId: string;
    name: string;
    email: string;
    planStartingDate: Date; 
    planExpiryDate: Date;
    isPremium: boolean; 
    planId: IPlansData;
  }
 export interface IUserPlanDetails{
    subscription: IUserSubscriptionResponse;
    plan: IPlansData;
  }