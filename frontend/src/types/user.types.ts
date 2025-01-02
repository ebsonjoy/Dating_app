export interface IRegisterData {
    name: string;
    email: string;
    mobileNumber: string;
    password: string;
    confirmPassword:string;
    dateOfBirth: string;
  }
  
 export interface IRegisterResponse {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
    dateOfBirth: string;
    otp: string;
  }
  
 export interface IUpdateUserData {
    name?: string;
    email?: string;
  }

export  interface IMyFormData {
    gender: string;
    lookingFor: string;
    profilePhotos: string[];
    relationship: string;
    interests: string[];
    occupation: string;
    education: string;
    bio: string;
    smoking: string;
    drinking: string;
    location: {
      latitude: number;
      longitude: number;
    };
    caste: string;
  
  }
  
 export interface IUserProfile {
  userId: string;
  name: string;
  age:number
  gender: string;
  lookingFor: string;
  profilePhotos: string[];
  relationship: string;
  interests: string[];
  occupation: string;
  education: string;
  bio: string;
  smoking: string;
  drinking: string;
  place: string;
  }
  
 export interface IUser {
    _id: string;
    name: string;
    email: string;
    dateOfBirth: string;
    mobileNumber: string;
    otp: string;
    otpExpiresAt: string;
    createdAt: string;
    updatedAt: string;
    status: boolean;
    isPremium: boolean;
    matches: number;
  }
  
 export interface IUserInfo {
    _id: string;
    userId: string;
    gender: string;
    lookingFor: string;
    profilePhotos: File[];
    relationship: string;
    interests: string[];
    occupation: string;
    education: string;
    bio: string;
    smoking: string;
    drinking: string;
    place: string;
    caste: string;
  }
  
  
 export interface IUserProfileResponse {
    user: IUser;
    userInfo: IUserInfo;
  }
  
 export interface IUpdateUserPersonalInfoArgs {
    userId: string; 
    data: IRegisterResponse; 
  }

 export interface IupdateData {
  
    gender: string;
    lookingFor: string;
    profilePhotos: string[];
    relationship: string;
    interests: string[];
    occupation: string;
    education: string;
    bio: string;
    smoking: string;
    drinking: string;
    place: string;
    caste: string;
  
  }