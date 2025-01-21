import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  phone:string;
  email: string;
  password?: string;
  isverified:boolean;
  role:  'SuperAdmin' | 'Admin'  | 'Visiteur';
  createdAt?: Date;
  updatedAt?: Date;

}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  phone:{type:String},
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isverified :{type:Boolean,default:false},
  role: { type: String, enum:  ['SuperAdmin', 'Admin', 'Visiteur'] , default:'Visiteur'},
 
},{ timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
