import mongoose from "mongoose";

//Модель для пользователя
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        //ссылка на схему посты
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
  //дата создания
);

export default mongoose.model("User", UserSchema);
