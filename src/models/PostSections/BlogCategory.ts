import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from '../User'; // Import the IUser interface
export interface IBlogCategory extends Document {
  name: string;
  user: IUser | string; // Reference to a User document or User ID
  vadmin:string;
  createdAt?: Date;
  updatedAt?: Date;
}
const slugifyBlogName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, ''); // Remove any special characters
};
const BlogCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  vadmin:{ type: String,default:'not-approve'},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });

BlogCategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugifyBlogName(this.name);
  }
  next();
});

const BlogCategory: Model<IBlogCategory> = mongoose.models.BlogCategory || mongoose.model<IBlogCategory>('BlogCategory',BlogCategorySchema);

export default BlogCategory;