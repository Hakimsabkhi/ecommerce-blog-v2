import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IRole extends Document {
  name: string;
  access: Map<string, boolean>; // Access is a Map of page names to boolean

}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  access: {
    type: Map,
    of: Boolean, // Define that the Map values are booleans
    default: {}, // Initialize with an empty map
  },
},{ timestamps: true });

const Role: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);

export default Role;
