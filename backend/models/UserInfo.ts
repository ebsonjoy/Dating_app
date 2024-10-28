
import mongoose, { Schema } from 'mongoose';
import { IUserInfo } from '../types/userInfo.types';

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
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

userInfoSchema.index({ location: '2dsphere' });
const UserInfo = mongoose.model<IUserInfo>('UserInfo', userInfoSchema);

export default UserInfo;
