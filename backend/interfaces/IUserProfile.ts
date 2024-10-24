import { ObjectId } from "mongoose";

interface IUserProfile {
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

export default IUserProfile