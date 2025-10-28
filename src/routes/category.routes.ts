import { Router } from "express";
import { CategoryController } from "../controller/CategoryController";
// If you added the param validator, uncomment the next line:
// import { validateObjectIdParam } from "../middleware/validateObjectIdParam";

const router = Router();

router.post("/", CategoryController.create);
router.get("/", CategoryController.list);
router.get("/:id", CategoryController.get);

router.patch("/:id", CategoryController.update);
router.delete("/:id", CategoryController.remove);

export default router;
