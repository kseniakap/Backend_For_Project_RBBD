import User from "../models/User.js"; // схема пользователя
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Регистрация
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    // request - все то что приходит со стороны клиента (из форм)
    // response - приходит от backend-end

    const isUsed = await User.findOne({ username });
    // проверка на наличие пользователя в бд
    if (isUsed) {
      return res.status(402).json({
        message: "Этот пользователь уже существует :(",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );

    await newUser.save();
    // сохранение пользователя в бд

    res.json({
      newUser,
      token,
      message: "Регистрация прошла успешно",
    });
  } catch (error) {
    res.json({ message: "Возникла ошибка при создании пользователя." });
  }
};

// Авторизация
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "Такого пользователя не существует",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    //сравнение пароля, получаемого из запроса, и хэшированного пароля из базы данных

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Ошибка! Неверный пароль",
      });
    }

    // Создание токена
    // предоставление доступа для создания постов
    const token = jwt.sign(
      {
        id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
      //время действия токена
    );

    res.json({
      token,
      user,
      message: "Произведен вход в аккаунт",
    });
  } catch (error) {
    res.json({ message: "Возникла ошибка при авторизации" });
  }
};

// Получение информации о пользователе
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    //поиск по индификатору

    if (!user) {
      return res.json({
        message: "Такого пользователя не существует.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.json({ message: "Нет доступа" });
  }
};
