export interface ISubscriptionDetails {
  isPremium: boolean;
  planId: string | null;
  planExpiryDate: Date | null;
  planStartingDate: Date | null;
}



  export interface UserInfoUpdate {
  gender: string;
  lookingFor: string;
  relationship: string;
  interests: string[];
  occupation: string;
  education: string;
  bio: string;
  smoking: string;
  drinking: string;
  place: string;
  caste: string;
  profilePhotos?: string[];
}
