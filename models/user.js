import { models, Schema, model } from "mongoose";

const userSchema = new Schema({
  
  email: {
    type: String,
    unique: [true, "Email is already exists!"],
    require: [true, "Email is required!"],
  },

  username: {
    type: String,
  },

  birthdate: {

     type: String,
     default: "2024-01-01T00:00:00.000Z"
  },

  password: {
      type: String,
  },

  weightOption: {

      type: String,
      default: "lb"
  },

  image: {
    type: String,
  },

  profileImageKey: {
      type: String
  },

  verifiedCredentials: {
     type: Boolean,
     default: false
  },

  changingPassword: {
      type: Boolean,
      default: false
  },


  passwordResetTokenExpires: {
       type: Date, 
       default: null,
  },


  emailToken: { 
    type: String, 
    default: null 
  },


  isActive: { 
    type: Boolean, 
    required: true, 
    default: false 
  },


  distance: {

     type: String,
     default: "miles"
  },


  mode: {

       type: String,
       default: "light"
  },

  gender: String,
  age: String,
  activityLevel: String,
  country: String,
  
  

  isAdmin: { 
    type: Boolean,
    required: true, 
    default: false
  
  },

});




const User = models.users || model("users", userSchema);

module.exports = User;
