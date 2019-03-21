import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.setPassword = function setPassword(password) {
  return bcrypt.hashSync(password, process.env.SALT);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
