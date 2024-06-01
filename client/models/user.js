import mongoose, { Schema, models } from "mongoose";

const chatHistorySchema = new Schema({
  query: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  }
}, { _id: false });

const userSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    chatHistory: [chatHistorySchema], 
  }, {timestamps: true});

const User = models.User || mongoose.model("User", userSchema);
export default User;
