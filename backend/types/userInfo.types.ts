
import mongoose, { Document } from 'mongoose';


export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; 
}


export interface IUserInfo extends Document {
  userId: mongoose.Types.ObjectId; 
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
  place:string;
  caste: string;
  location: ILocation;
}



 export interface UserInfoUpdate {
    gender: string;
    lookingFor: string;
    relationship: string;
    interests: string[];
    occupation: string;
    education: string;
    imgIndex?:string;
    bio: string;
    smoking: string;
    drinking: string;
    place: string;
    location: ILocation;
    caste: string;
    profilePhotos?: string[];
  }