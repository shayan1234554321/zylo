import RideModel from "../model/ride.js";
import UserModel from "../model/user.js";
import rideSocketModel from "../model/rideSocket.js";
import { CustomReturn } from "../library/types.js";
import { EmitDataToRideNamespace, notifyDrivers } from "../hooks/socket.js";

const recentRides = async ({ user }: { user: any }): Promise<CustomReturn> => {
  try {
    const type: string = user.type === "driver" ? "driver" : "user";

    const rides = await RideModel.find({
      [type]: user._id,
    })
      .populate("driver", "-password -tokenCode")
      .populate("user", "-password -tokenCode")
      .populate("offers.driver", "-password -tokenCode")
      .sort({ createdAt: -1 });

    return { status: 200, data: rides };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Liking Post" } };
  }
};

const availableRides = async ({
  user,
}: {
  user: any;
}): Promise<CustomReturn> => {
  try {
    const rides = await RideModel.find({
      status: "pending",
      location: {
        $near: {
          $maxDistance: 2000,
          $geometry: {
            type: "Point",
            coordinates: user.location.coordinates,
          },
        },
      },
    }).sort({ createdAt: -1 });

    return { status: 200, data: rides };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Liking Post" } };
  }
};

const createRide = async ({
  user,
  body,
}: {
  body: any;
  user: any;
}): Promise<CustomReturn> => {
  try {

    const ride = await RideModel.create({
      ...body,
      user: user._id,
      offers: [],
    });

    const drivers = await UserModel.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: body.location.coordinates,
          },
          $maxDistance: 2000,
        },
      },
      type: "driver",
      status: "available",
    }).select("-password -tokenCode");

    const rideToDrivers = await RideModel.findById(ride._id).populate(
      "user",
      "-password -tokenCode"
    );

    notifyDrivers(body.location.coordinates, rideToDrivers, "newRide");

    return { status: 200, data: { ride: rideToDrivers, drivers } };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Liking Post" } };
  }
};

const presentOffer = async ({
  body,
  user,
}: {
  body: any;
  user: any;
}): Promise<CustomReturn> => {
  try {
    const ride = await RideModel.findById(body.rideId);

    if (!ride) {
      return { status: 404, data: { message: "Ride not found" } };
    }

    ride.offers.push(body.offer);
    await ride.save();

    const rider = await rideSocketModel
      .find({
        user: ride.user,
      })
      .sort({ createdAt: -1 });

    const rideToDriver = await RideModel.findById(ride._id)
      .populate("driver", "-password -tokenCode")
      .populate("user", "-password -tokenCode")
      .populate("offers.driver", "-password -tokenCode");

    if (rider.length === 0) return { status: 200, data: rideToDriver };

    EmitDataToRideNamespace({
      socketId: rider[0].socket,
      event: "presentOffer",
      data: { ...body.offer, driver: user },
    });

    return { status: 200, data: rideToDriver };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Liking Post" } };
  }
};

const acceptOffer = async ({ body }: { body: any }): Promise<CustomReturn> => {
  try {
    const ride = await RideModel.findById(body.rideId);

    if (!ride) {
      return { status: 404, data: { message: "Ride not found" } };
    }

    ride.offers = [];
    ride.driver = body.driver;
    ride.price = body.price;
    ride.status = "assigned";
    await ride.save();

    notifyDrivers(ride.location.coordinates, ride, "rideUnavailable");
    const driver = await rideSocketModel
      .find({
        user: body.driver,
      })
      .sort({ createdAt: -1 });

    // UserModel.findByIdAndUpdate(body.driver, {
    //   status: "onRide",
    // });

    const rideToDriver = await RideModel.findById(ride._id)
      .populate("driver", "-password -tokenCode")
      .populate("user", "-password -tokenCode")

    if (!driver || driver.length === 0)
      return { status: 200, data: rideToDriver };

    EmitDataToRideNamespace({
      socketId: driver[0].socket,
      event: "offerAccepted",
      data: rideToDriver,
    });

    return { status: 200, data: rideToDriver };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Liking Post" } };
  }
};

const startRide = async ({ body }: { body: any }): Promise<CustomReturn> => {
  try {
    const ride = await RideModel.findById(body.rideId);

    if (!ride) {
      return { status: 404, data: { message: "Ride not found" } };
    }

    ride.status = "onRide";
    await ride.save();

    const rider = await rideSocketModel
      .find({
        user: ride.user,
      })
      .sort({ createdAt: -1 });
    if (rider.length === 0) return { status: 200, data: ride };
    EmitDataToRideNamespace({
      socketId: rider[0].socket,
      event: "rideStarted",
      data: ride,
    });

    return { status: 200, data: ride };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Liking Post" } };
  }
};

const completed = async ({ body }: { body: any }): Promise<CustomReturn> => {
  try {
    const ride = await RideModel.findById(body.rideId);

    if (!ride) {
      return { status: 404, data: { message: "Ride not found" } };
    }

    ride.status = "finished";
    await ride.save();

    const rider = await rideSocketModel
      .find({
        user: ride.user,
      })
      .sort({ createdAt: -1 });

    if (rider.length === 0) return { status: 200, data: ride };

    EmitDataToRideNamespace({
      socketId: rider[0].socket,
      event: "rideEnded",
      data: ride,
    });

    return { status: 200, data: ride };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Liking Post" } };
  }
};

const view = {
  recentRides,
  availableRides,
  createRide,
  presentOffer,
  acceptOffer,
  startRide,
  completed,
};

export default view;
