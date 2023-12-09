import { Router } from "express";
import {
  checkPostAdmin,
  createPost,
  getAll,
  getById,
  getMyPosts,
  removePost,
  updatePost,
  getPostComments,
} from "../controllers/posts.js";
import { checkAuth } from "../utils/checkAuth.js";
const router = new Router();

// Создание постов
// http://localhost:3006/posts
router.post("/", checkAuth, createPost);

//Проверка администратором
//http://localhost:3006/posts
router.post("/admin/:id", checkPostAdmin);
// Получение всех постов
router.get("/", getAll);
// Получение поста по id
router.get("/:id", getById);
// Обновление поста
router.put("/:id", checkAuth, updatePost);
// Получение только моих постов
router.get("/user/me", checkAuth, getMyPosts);
// Удаление поста
router.delete("/:id", checkAuth, removePost);
// Оставить комментарий у поста
router.get("/comments/:id", getPostComments);

export default router;
