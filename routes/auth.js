import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

//Роутеры
router.post("/register", register); //регистрация http://localhost:3006/auth/register
router.post("/login", login); //авторизация
router.get("/me", checkAuth, getMe); //информация о пользователе

export default router;
