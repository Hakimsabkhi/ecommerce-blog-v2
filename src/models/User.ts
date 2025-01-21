import mongoose, { Document, Schema, Model } from 'mongoose';
import crypto from "crypto";
export interface IUser extends Document {
  username: string;
  phone:string;
  email: string;
  password?: string;
  isverified:boolean;
  verifyToken: string;
  verifyTokenExpire: Date;
  role:  'SuperAdmin' | 'Admin'  | 'Visiteur';
  createdAt?: Date;
  updatedAt?: Date;
  getVerificationToken: () => string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  phone:{type:String},
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isverified :{type:Boolean,default:false},
  verifyToken: {
    type: String,
  },
  verifyTokenExpire: {
    type: Date,
  },
  role: { type: String, enum:  ['SuperAdmin', 'Admin', 'Visiteur'] , default:'Visiteur'},
 
},{ timestamps: true });
UserSchema.methods.getVerificationToken = function (): string {
  // Generate the token
  const verificationToken = crypto.randomBytes(20).toString("hex");

  // Hash the token
  this.verifyToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000);

  return verificationToken;
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
