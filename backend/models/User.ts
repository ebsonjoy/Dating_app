import mongoose, {Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    resetPassword: {
        token: string | null;
        expDate: Date | null;
        lastResetDate: Date | null;
      };
    dateOfBirth: string;
    otp: string;
    isPremium:boolean;
    planId: mongoose.Types.ObjectId;
    planExpiryDate: Date | null;
    planStartingDate: Date | null;
    status:boolean;
    matches:number;
    otpExpiresAt:Date;
    mobileNumber:string;
    
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isPremium:{
            type:Boolean,
            default:false,
        },
        planId: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            required: false, 
        },
        planExpiryDate: {
            type: Date,
            required: false, 
        },
        planStartingDate: {
            type: Date,
            required: false, 
        },
        status:{
            type:Boolean,
            default:true,
        },
        matches:{
            type:Number,
            default:0,
        },
        resetPassword: {
            token: { type: String, default: null },
            expDate: { type: Date, default: null },
            lastResetDate: { type: Date, default: null },
          },
        dateOfBirth:{
            type:String,
        },
        mobileNumber:{
            type:String,
        },
        otp: { type: String },
        otpExpiresAt:{type:Date}
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
