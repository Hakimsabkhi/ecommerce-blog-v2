import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User';



export interface ICustomizeProduct extends Document {
    wbtitle: string;
    wbsubtitle:string;
    pctitle: string;
    pcsubtitle:string;
    cptitle: string;
    cpsubtitle:string;
  user: IUser | string; 
  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomizeProductSchema: Schema = new Schema({
    wbtitle: {type:String,required:true},
  wbsubtitle: {type:String,required:false},
  pctitle: {type:String,required:true},
  pcsubtitle: {type:String,required:false},
  cptitle: {type:String,required:true},
  cpsubtitle: {type:String,required:false},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });



const CustomizeProduct: Model<ICustomizeProduct> = mongoose.models.CustomizeProduct || mongoose.model<ICustomizeProduct>('CustomizeProduct', CustomizeProductSchema);

export default CustomizeProduct;