import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';
import { IAddress } from './Address';
import crypto from 'crypto';  // You can use this for generating random strings

export interface IOrder extends Document {
  _id: string;
  ref:string;
  user: IUser | string;
  address: IAddress| string;
  orderItems: Array<{
    product: Schema.Types.ObjectId;
    refproduct:string;
    name: string;
    tva:number;
    quantity: number ; // Changed to number
    image: string;
    discount:number;
    price: number;     // Changed to number
  }>;
  paymentMethod:string;
  deliveryMethod:string;
  deliveryCost:number;
  total: number;
  orderStatus: string;
  statustimbre:boolean;
  statusinvoice:boolean;
  createdAt: Date;
  updatedAt: Date;
}



const OrderSchema : Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ref:{type: String},
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    orderItems: [
        {
          
          product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
          },
          refproduct:{
            type:String,
            required:true,
          },
          name: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,  // Changed to Number
            required: true,
          },
          tva: {
            type: Number,  // Changed to Number
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
          discount:{
            type:Number,
          },
          price: {
            type: Number,  // Changed to Number
            required: true,
          },
        },
      ],
      paymentMethod: { // Optional field for payment method
        type: String,
      },
      deliveryMethod:{
        type:String,
        require:true,
      },
      deliveryCost:{
        type:Number,
        
      },
      total: {
        type: Number,
        required: true,
      },
      orderStatus: {
        type: String,
        default: 'Processing',
      },
      statustimbre:{
        type:Boolean,
        default:true,
      },
      statusinvoice:{
        type:Boolean,
        default:false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },

});
OrderSchema.pre('save', function (next) {
    const order = this as IOrder;
  
    // Generate a random 8-character ref if not provided
    if (!order.ref) {
      const randomRef = crypto.randomBytes(4).toString('hex');  // 8-character hex string
      order.ref = `ORDER-${randomRef}`;
    }
  
    next();
  });
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
