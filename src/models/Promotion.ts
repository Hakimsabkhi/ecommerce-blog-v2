import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User';


export interface IPromotion extends Document {
  name: string;
  bannerUrl?:string;
  user: IUser | string; 
  createdAt?: Date;
  updatedAt?: Date;
}

const PromotionSchema: Schema = new Schema({
  name: { type: String, required: true },
  bannerUrl: { type: String,required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });



const Promotion: Model<IPromotion> = mongoose.models.Promotion || mongoose.model<IPromotion>('Promotion', PromotionSchema);

export default Promotion;