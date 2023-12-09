import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
//cors - разрешения подключения к разным api-адресов
import fileUpload from "express-fileupload";
//для загрузки изображений
import authRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";
import commentRoute from "./routes/comments.js";

const app = express();
dotenv.config();

const PORT = 3006;

app.use(cors());
app.use(fileUpload());
app.use(express.json());
//данные будут приходить в формате json
app.use(express.static("uploads"));

// http://localhost:3006
app.use("/auth", authRoute);
app.use("/posts", postRoute);
app.use("/comments", commentRoute);


//подключение к бд
async function start() {
  try {
    await mongoose.connect(
      "mongodb+srv://projectrpbdmongodb:12345678910@cluster0.6rzxmos.mongodb.net/blog?retryWrites=true&w=majority"
    );

    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
start();
