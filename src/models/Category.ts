import mongoose, { Schema, Document, Model } from "mongoose";

import Joi from "joi";

export const CategorySchemaValidate = Joi.object({
  name: Joi.string().min(2).max(60).trim().required(),
  description: Joi.string().max(2000).trim().optional(),
});



export interface ICategory extends Document {
  name: string;
  description?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
  },
  { timestamps: true, collection: "categories" }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
