import mongoose, { Schema } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  type: "driver" | "rider";
  profilePic: string;
  tokenCode?: string;
  earned?: number;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  status: "available" | "unavailable" | "onRide";
  rating?: number;
  carType?: "sedan" | "van" | "suv" | "truck";
}

const schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true, enum: ["driver", "rider"] },
    profilePic: { type: String, default: "/assets/default.png" },
    tokenCode: { type: String },
    earned: { type: Number, default: 0 },
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    status: {
      type: String,
      default: "unavailable",
      enum: ["available", "unavailable", "onRide"],
    },
    rating: { type: Number, default: 0 },
    carType: { type: String, enum: ["sedan", "van", "suv", "truck"] },
  },
  {
    timestamps: true,
  }
);

schema.index({ email: 1 });
schema.index({ location: "2dsphere", status: 1 });

const model = mongoose.model<IUser>("user", schema);
export default model;
