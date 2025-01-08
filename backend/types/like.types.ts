
import { Types, Document } from "mongoose";

export interface ILike extends Document {
    likerId: Types.ObjectId;
    likedUserId: Types.ObjectId;
    status: "pending" | "matched";
    createdAt: Date;
}

export interface ILikeData {
    likerId: Types.ObjectId;
    likedUserId: Types.ObjectId;
}


export interface ILikeProfile {
    id :Types.ObjectId;
    name: string;
    dateOfBirth: string;
    place: string;
    profilePhotos: string[];
    blockedUsers?:string[]
  }
  