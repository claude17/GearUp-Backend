import { Router } from "express";
import { categoryController } from "../category/category.controller";

const router = Router();

router.get("/", categoryController.getAllCategories);

router.post("/", categoryController.createCategory);

router.patch("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

export const categoryRoutes = router;