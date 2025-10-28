import { NextFunction, Request, Response } from "express";
import { ProductschemaValidate, Product } from "../models/Product";
import { Category } from "../models/Category";

export class ProductController {
  static async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = ProductschemaValidate.validate(req.body);
      if (error) return res.status(400).json({
        error: error.details?.[0]?.message || error.message
      });

      const exists = await Category.exists({ _id: value.categoryId });
      if (!exists) return res.status(400).json({ error: "Invalid categoryId" });

      const doc = await Product.create({
        name: value.name,
        price: value.price,
        sku: value.sku,
        description: value.description,
        inStock: value.inStock,
        category: value.categoryId,
      });
      const populated = await doc.populate("category");
      res.status(201).json(populated);
    } catch (err) { next(err); }
  }

  static async getProducts(_req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await Product.find().populate("category").limit(100);
      res.json(docs);
    } catch (err) { next(err); }
  }

  static async getAProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await Product.findById(req.params.id).populate("category");
      if (!doc) return res.status(404).json({ error: "Product not found" });
      res.json(doc);
    } catch (err) { next(err); }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: any = { ...req.body };
      if (payload.categoryId) {
        const exists = await Category.exists({ _id: payload.categoryId });
        if (!exists) return res.status(400).json({ error: "Invalid categoryId" });
        payload.category = payload.categoryId;
        delete payload.categoryId;
      }
      const doc = await Product.findByIdAndUpdate(req.params.id, payload, { new: true })
        .populate("category");
      if (!doc) return res.status(404).json({ error: "Product not found" });
      res.json(doc);
    } catch (err) { next(err); }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ ok: true });
    } catch (err) { next(err); }
  }
}
