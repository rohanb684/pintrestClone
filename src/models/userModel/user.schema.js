import mongoose from 'mongoose';
import plm from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
},
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    fullname: {
      type: String,
      required: true,
      trim: true
    },
    dob: {
      type: Date,
      required: true
  },
    pins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pin'
    }],
    savedPins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pin'
  }],
    dp:{
        type: String
    }
  });

UserSchema.plugin(plm);

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;

