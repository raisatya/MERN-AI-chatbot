import mongoose, { Document, Schema } from "mongoose";
import { randomUUID } from "crypto";
import { Password } from "../utils/Password";

// Define Chat Interface
interface ChatInterface {
  role: "user" | "admin" | "system";
  content: string;
}

// Define User Interface
interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  chats: ChatInterface[];
}

// Chat Schema
const chatSchema = new Schema<ChatInterface>({
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "system"],
  },
  content: {
    type: String,
    required: true,
  },
});

// User Schema
const userSchema = new Schema<UserInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    chats: [chatSchema],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Pre-save hook to hash password if modified
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

// Create User model
const User = mongoose.model<UserInterface>("User", userSchema);

export default User;
