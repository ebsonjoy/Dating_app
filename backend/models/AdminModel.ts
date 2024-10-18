import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  _id:mongoose.Types.ObjectId;
  email: string;
  password: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const adminSchema = new mongoose.Schema <IAdmin>(
  {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, 
{
  timestamps: true,
}
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
