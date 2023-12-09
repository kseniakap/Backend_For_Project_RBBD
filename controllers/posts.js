import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Создание поста
export const createPost = async (req, res) => {
  try {
    const { title, artist, text } = req.body;
    const user = await User.findById(req.userId);

    if (req.files) {
      //   let fileName = Date.now().toString() + req.files.image.name;
      let fileName = req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

      const newPostWithImage = new Post({
        username: user.username,
        title,
        artist,
        text,
        imgUrl: fileName,
        author: req.userId,
        // checkAdmin
      });

      await newPostWithImage.save();
      await User.findByIdAndUpdate(req.userId, {
        $push: { posts: newPostWithImage },
      });

      return res.json(newPostWithImage);
    }

    const newPostWithoutImage = new Post({
      username: user.username,
      title,
      artist,
      text,
      imgUrl: "",
      author: req.userId,
      checkAdmin,
    });
    await newPostWithoutImage.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: newPostWithoutImage },
    });
    res.json(newPostWithoutImage);
  } catch (error) {
    res.json({ message: "Что-то пошло не так." });
  }
};

// Получение всех постов
export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAt");
    //сортировка по дате создания
    const popularPosts = await Post.find().limit(10).sort("-views");
    // сортировка по количеству просмотров

    if (!posts) {
      return res.json({ message: "Постов нет" });
    }

    res.json({ posts, popularPosts });
  } catch (error) {
    res.json({ message: "Что-то пошло не так." });
  }
};

export const getById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.json(post);
  } catch (error) {
    res.json({ message: "Что-то пошло не так." });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id);
      })
    );

    res.json(list);
  } catch (error) {
    res.json({ message: "Что-то пошло не так." });
  }
};

export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.json({ message: "Такого поста не существует" });

    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    });

    res.json({ message: "Пост был удален." });
  } catch (error) {
    res.json({ message: "Что-то пошло не так." });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, artist, text, id } = req.body;
    const post = await Post.findById(id);

    if (req.files) {
      let fileName = req.files.image.name;
      // let fileName = Date.now().toString() + req.files.image.name
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
      post.imgUrl = fileName || "";
    }

    post.title = title;
    post.text = text;
    post.artist = artist;

    await post.save();

    res.json(post);
  } catch (error) {
    res.json({ message: "Что-то пошло не так." });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const list = await Promise.all(
      post.comments.map((comment) => {
        return Comment.findById(comment);
      })
    );
    res.json(list);
  } catch (error) {
    res.json({ message: "Что-то пошло не так." });
  }
};

//Проверка администратором
export const checkPostAdmin = async (req, res) => {
  try {
    const { id } = req.body;
    const post = await Post.findById(id);
    post.checkAdmin = true;
    await post.save();

    res.json(post);
  } catch (error) {
    res.json({ message: "Проверка постов не пройдена" });
  }
};
