import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  fullname: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword: (
    inputPassword: string,
    userPassword: string,
  ) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  return next();
});

UserSchema.methods.comparePassword = async function (
  inputPassword: string,
  userPassword: string,
) {
  return bcrypt.compare(inputPassword, userPassword);
};

export default mongoose.model<IUser>('User', UserSchema);
