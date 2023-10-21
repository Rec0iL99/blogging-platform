import mongoose from "mongoose";

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // https://mongoosejs.com/docs/tutorials/dates.html
  registrationDate: {
    type: Date,
    required: true,
  },
});

const userSchema = mongoose.model("User", user);

export default userSchema;
