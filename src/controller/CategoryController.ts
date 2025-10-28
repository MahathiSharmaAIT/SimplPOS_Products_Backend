import { Request, Response, NextFunction } from "express";
import { Category, CategorySchemaValidate} from "../models/Category";
import { Product } from "../models/Product";

export class CategoryController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = CategorySchemaValidate.validate(req.body);
      if (error)
  return res.status(400).json({
    error: error.details?.[0]?.message || error.message
  });
      const doc = await Category.create(value);
      res.status(201).json(doc);
    } catch (err) { next(err); }
  }

  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await Category.find().sort({ name: 1 });
      res.json(docs);
    } catch (err) { next(err); }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await Category.findById(req.params.id);
      if (!doc) return res.status(404).json({ error: "Category not found" });
      res.json(doc);
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = CategorySchemaValidate.validate(req.body);
      if (error)
  return res.status(400).json({
    error: error.details?.[0]?.message || error.message
  });
      const doc = await Category.findByIdAndUpdate(req.params.id, value, { new: true });
      if (!doc) return res.status(404).json({ error: "Category not found" });
      res.json(doc);
    } catch (err) { next(err); }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      // Prevent deletion if products reference this category
      const count = await Product.countDocuments({ category: req.params.id });
      if (count > 0) {
        return res.status(409).json({
          error: `Cannot delete category: ${count} product(s) still reference it`,
        });
      }

      const doc = await Category.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ error: "Category not found" });
      res.json({ ok: true });
    } catch (err) { next(err); }
  }
}
