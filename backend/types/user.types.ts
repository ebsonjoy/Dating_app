import mongoose, { Document,ObjectId } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role:'user'
    resetPassword: {
        token: string | null;
        expDate: Date | null;
        lastResetDate: Date | null;
    };
    dateOfBirth: string;
    otp: string;
    isGoogleLogin:boolean;
    googleId?: string;
    subscription: {
        isPremium: boolean;
        planId: mongoose.Types.ObjectId | null;
        planExpiryDate: Date | null;
        planStartingDate: Date | null;
        features?: string[];
    };
    status: boolean;
    matches: number;
    otpExpiresAt: Date;
    mobileNumber: string;
    blockedUsers: string[];

    matchPassword: (enteredPassword: string) => Promise<boolean>;
}


export interface ISubscriptionDetails {
    isPremium: boolean;
    planId:  mongoose.Types.ObjectId;
    planExpiryDate: Date;
    planStartingDate:Date;
  }



  //front profile matches profiles(bydistance,looking for)
 export interface IUserProfile {
      userId: ObjectId;
      name: string | undefined;
      age: number | null;
      gender: string;
      lookingFor: string;
      profilePhotos: string[];
      relationship: string;
      interests: string[];
      occupation: string;
      education: string;
      bio: string;
      smoking: boolean;
      drinking: boolean;
      place: string;
  }
  
  export interface IUserRegistration {
    name: string;
    email: string;
    password: string;
    dateOfBirth: string;
    mobileNumber: string;
    otp: string;
    otpExpiresAt: Date;
}


export interface IBlockedUserResponse {
    _id: string;
    blockedUsers: string[];
}


export interface IUnblockedUserResponse {
    _id: string;
    blockedUsers: string[];
}