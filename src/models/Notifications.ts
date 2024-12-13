import mongoose, { Schema, Document,Model} from 'mongoose';
import { IOrder } from './order';
export interface INotifications extends Document {
  order:IOrder|string;
  seen:boolean;
  look:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


const NotificationsSchema: Schema = new Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  seen:{type:String, default: false,},
  look:{type:String, default: false,}
 
},{ timestamps: true });


const Notifications: Model<INotifications> = mongoose.models.Notifications || mongoose.model<INotifications>('Notifications', NotificationsSchema);

export default Notifications;