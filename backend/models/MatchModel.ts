import mongoose, { Schema } from "mongoose";
import { IMatch } from "../types/match.types";

const MatchSchema = new Schema<IMatch>({
  user1Id: { 
    type: Schema.Types.ObjectId,
     ref: "User",
     required: true
},
  user2Id: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
  matchDate: {
     type: Date, 
     default: Date.now 
},
});

const Match = mongoose.model<IMatch>("Match", MatchSchema);

export default Match;
