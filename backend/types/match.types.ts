import { Types, Document } from "mongoose";

export interface IMatch extends Document {
    user1Id: Types.ObjectId;
    user2Id: Types.ObjectId;
    matchDate: Date;
}
