import mongoose, { Schema, Types } from "mongoose";

interface IUser {
  socket: string;
  user: Types.ObjectId;
  type: "driver" | "rider";
}

const schema = new Schema<IUser>(
  {
    socket: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    type: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

schema.index({ user: 1, type: 1 });

const model = mongoose.model<IUser>("rideSocket", schema);
export default model;
