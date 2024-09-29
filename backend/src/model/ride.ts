import mongoose, { Schema, Types } from "mongoose";

interface IRide {
  user: Types.ObjectId;
  driver: Types.ObjectId;
  status: "pending" | "assigned" | "onRide" | "finished";
  locationName: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  destinationName: string;
  destination: {
    type: "Point";
    coordinates: [number, number];
  };
  driverLocation?: {
    type: "Point";
    coordinates: [number, number];
  };
  offers: {
    driver: Types.ObjectId;
    price: number;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  }[];
  price: number;
}

const schema = new Schema<IRide>(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "assigned", "onRide", "finished"],
    },
    locationName: {
      type: String,
      required: true,
    },
    destinationName: {
      type: String,
      required: true,
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    destination: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    driverLocation: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    offers: [
      {
        driver: { type: Schema.Types.ObjectId, ref: "user" },
        price: { type: Number },
        location: {
          type: { type: String, enum: ["Point"], required: true },
          coordinates: [{ type: Number, required: true }],
        },
      },
    ],
    price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

schema.index({ user: 1 });
schema.index({ driver: 1 });
schema.index({ location: "2dsphere", status: 1 });

const model = mongoose.model<IRide>("ride", schema);
export default model;
