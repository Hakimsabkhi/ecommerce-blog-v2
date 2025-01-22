import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";

export interface IBoutique extends Document {
    nom: string;
    image: string;
    phoneNumber: string;
    address: string; 
    city: string; 
    localisation: string;
    openingHours: {
      [day: string]: { open: string; close: string }[]; 
    };
    user: IUser | string;

}

const BoutiqueSchema: Schema = new Schema(
  {
    nom: { type: String, required: true },
    image: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    localisation: { type: String, required: false },
    openingHours: {
      type: Map,
      of: [{ open: String, close: String }],
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Boutique: Model<IBoutique> =
  mongoose.models.Boutique || mongoose.model<IBoutique>("Boutique", BoutiqueSchema);

export default Boutique;
