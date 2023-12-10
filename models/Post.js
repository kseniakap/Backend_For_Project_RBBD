import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    username: { type: String },

    title: { type: String, required: true },//название песни
    artist: { type: String, required: true },//исполнитель
    text: { type: String, required: true },//текст песни
    imgUrl: { type: String, default: "" },//картинка

    views: { type: Number, default: 0 },//количество просмотров

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },//автор поста
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    checkAdmin: { type: Boolean, default: false },//Проверка админом
  },
  { timestamps: true }
);
export default mongoose.model("Post", PostSchema);
