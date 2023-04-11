import { model, Schema } from "mongoose";

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  phonenumber: String,
  address: String,
  password: String,
  confirmpassword: String,
});

export const User = model("users", userSchema);
