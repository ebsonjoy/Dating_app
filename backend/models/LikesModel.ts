

import mongoose, { Schema } from "mongoose";
import { ILike } from "../types/like.types";

const LikeSchema = new Schema<ILike>({
    likerId: {
         type: Schema.Types.ObjectId, 
         ref: "User", 
         required: true 
    },
    likedUserId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    status: {
         type: String, 
         enum: ["pending", "matched"], 
         default: "pending" 
    },
    createdAt: {
         type: Date, 
         default: Date.now 
    }
});

const Like = mongoose.model<ILike>("Like", LikeSchema);

export default Like;
