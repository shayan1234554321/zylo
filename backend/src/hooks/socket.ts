import UserModel from "../model/user.js";
import rideModel from "../model/ride.js";
import rideSocketModel from "../model/rideSocket.js";

export const EmitDataToSocket = async (
  namespace: string,
  socketId: string,
  event: string,
  data: any
) => {
  const socket = global[namespace];
  socket.to(socketId).emit(event, data);
};

export const EmitDataToRideNamespace = async ({
  socketId,
  event,
  data,
}: {
  socketId: string;
  event: string;
  data: any;
}) => {
  EmitDataToSocket("rideNamespace", socketId, event, data);
};

export const notifyRiders = async (
  locationCoordinates: number[],
  data: any,
  event: string
) => {
  const rides = await rideModel.find({
    status: "pending",
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: locationCoordinates,
        },
        $maxDistance: 2000,
      },
    },
  });

  if (rides.length === 0) return;

  const rideUsers = rides.map((ride) => ride.user);
  const rideUserSockets = await rideSocketModel.find({
    user: {
      $in: rideUsers,
    },
  });

  if (rideUserSockets.length === 0) return;

  const promises = rideUserSockets.map(async (rideUserSocket) => {
    try {
      await EmitDataToRideNamespace({
        socketId: rideUserSocket.socket,
        event: event,
        data: data,
      });
    } catch (err) {
      console.error(
        `Error emitting to socket ${rideUserSocket.socket}: ${err.message}`
      );
    }
  });

  await Promise.all(promises);
};

export const notifyDrivers = async (
  locationCoordinates: number[],
  data: any,
  event: string
) => {
  const drivers = await UserModel.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: locationCoordinates,
        },
        $maxDistance: 2000,
      },
    },
    type: "driver",
    status: "available",
  });

  if (drivers.length === 0) return;

  const driverIds = drivers.map((driver) => driver._id);

  const driverSockets = await rideSocketModel.find({
    user: {
      $in: driverIds,
    },
  });

  if (driverSockets.length === 0) return;

  const promises = driverSockets.map(async (driverUserSocket) => {
    try {
      await EmitDataToRideNamespace({
        socketId: driverUserSocket.socket,
        event: event,
        data: data,
      });
    } catch (err) {
      console.error(
        `Error emitting to socket ${driverUserSocket.socket}: ${err.message}`
      );
    }
  });

  await Promise.all(promises);
};
