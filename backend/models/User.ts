import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/user.types';

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
        isGoogleLogin:{
            type: Boolean,
            default: false,
        },
        googleId: {
            type: String,
            sparse: true,
            unique: true,
          },
        subscription: {
            isPremium: {
                type: Boolean,
                default: false,
            },
            planId: {
                type: Schema.Types.ObjectId,
                ref: 'Plan',
                default: null,
            },
            planExpiryDate: {
                type: Date,
                default: null,
            },
            planStartingDate: {
                type: Date,
                default: null,
            },
        },
        status: {
            type: Boolean,
            default: true,
        },
        matches: {
            type: Number,
            default: 0,
        },
        resetPassword: {
            token: { type: String, default: null },
            expDate: { type: Date, default: null },
            lastResetDate: { type: Date, default: null },
        },
        dateOfBirth: {
            type: String,
        },
        mobileNumber: {
            type: String,
        },
        otp: { type: String },
        otpExpiresAt: { type: Date }
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
