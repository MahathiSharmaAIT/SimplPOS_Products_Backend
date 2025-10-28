import mongoose, { Schema, Document, Model,Types } from "mongoose";
import Joi from 'joi'

const skuRegex = /^[A-Z0-9-_.]+$/i;

export const ProductschemaValidate = Joi.object({
  name: Joi.string().min(2).max(120).trim().required(),
  price: Joi.number().min(0).required(),
  sku: Joi.string().pattern(skuRegex).trim().uppercase().optional(),
  description: Joi.string().max(2000).trim().optional(),
  inStock: Joi.boolean().optional(),

  // Inline ObjectId validation
  categoryId: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }, "ObjectId validation").required()
});

export interface IProduct extends Document {
  name: string;
  sku?: string;
  price: number;
  description?: string;
  inStock: boolean;
  category: mongoose.Types.ObjectId; // FK → Category
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    inStock: { type: Boolean, default: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true, // <- if you want it mandatory
      index: true,
    },
  },
  { timestamps: true, collection: "products" }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);