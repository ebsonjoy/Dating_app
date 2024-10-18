import mongoose, { Schema, Document } from 'mongoose';

// Interface (IUserInfo)
export interface IUserInfo extends Document {
  userId: mongoose.Types.ObjectId; // the User model
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
  caste:string;
}

// Schema and Model
const userInfoSchema: Schema<IUserInfo> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  gender: {
    type: String,
    required: true,
  },
  lookingFor: {
    type: String,
    required: true,
  },
  profilePhotos: {
    type: [String], 
    required: true,
  },
  relationship: {
    type: String,
    required: true,
  },
  interests: {
    type: [String], 
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  smoking: {
    type: String,
    required: true,
  },
  drinking: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  caste: {
    type: String,
    required: true,
  },
});

const UserInfo = mongoose.model<IUserInfo>('UserInfo', userInfoSchema);

export default UserInfo;
