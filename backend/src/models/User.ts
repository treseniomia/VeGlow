import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 8,
      select: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    savedPosts: {
      type: [{ type: Schema.Types.ObjectId, ref: "Post" }],
      default: [],
    },
    hiddenPosts: {
      type: [
        {
          postId: { type: Schema.Types.ObjectId, ref: "Post" },
          hiddenAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
