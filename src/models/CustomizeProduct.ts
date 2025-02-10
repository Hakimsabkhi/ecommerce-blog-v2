import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User';



export interface ICustomizeProduct extends Document {
  BestProductTitle: string;
  BestProductSubtitle: string;
  BestProductBanner: string;
  ProductCollectionTitle: string;
  ProductCollectionSubtitle: string;
  ProductCollectionBanner: string;
  ProductPromotionTitle: string;
  ProductPromotionSubtitle: string;
  ProductPromotionBanner: string;
  user: IUser | string; 
  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomizeProductSchema: Schema = new Schema({
  BestProductTitle: { type: String, required: true },
  BestProductSubtitle: { type: String, required: false },
  BestProductBanner: { type: String, required: false },
  ProductCollectionTitle: { type: String, required: true },
  ProductCollectionSubtitle: { type: String, required: false },
  ProductCollectionBanner: { type: String, required: true },
  ProductPromotionTitle: { type: String, required: true },
  ProductPromotionSubtitle: { type: String, required: false },
  ProductPromotionBanner: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });



const CustomizeProduct: Model<ICustomizeProduct> = mongoose.models.CustomizeProduct || mongoose.model<ICustomizeProduct>('CustomizeProduct', CustomizeProductSchema);

export default CustomizeProduct;