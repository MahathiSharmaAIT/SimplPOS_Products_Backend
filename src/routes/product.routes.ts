import { Router } from "express";
import { ProductController } from "../controller/ProductController";

const router = Router();

router.post("/", ProductController.addProduct);
router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getAProduct);
// use PUT if you replace entire object; PATCH if partial updates:
router.put("/:id", ProductController.updateProduct);
router.patch("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;