import { RandomStringGenerator, removeFile } from "../hooks/helper.js";
import { EmitDataToRideNamespace, notifyRiders } from "../hooks/socket.js";
import { generateToken } from "../library/token.js";
import { CustomReturn } from "../library/types.js";
import userModel from "../model/user.js";
import rideModel from "../model/ride.js";
import rideSocketModel from "../model/rideSocket.js";
import bcrypt from "bcrypt";

const signIn = async ({ body }: { body: any }): Promise<CustomReturn> => {
  try {
    let user = await userModel.findOne({ email: body.email });

    if (!user) {
      return { status: 404, data: { message: "User not found" } };
    }

    const match = await bcrypt.compare(body.password, user.password);

    if (!match) {
      return { status: 401, data: { message: "Invalid credentials" } };
    }

    user.tokenCode = RandomStringGenerator();
    await user.save();

    const token = generateToken(user._id, user.tokenCode);

    let temp: any = { ...user.toObject() };
    temp.token = token;
    delete temp.password;
    delete temp.tokenCode;

    return { status: 200, data: { ...temp, token } };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Signing In" } };
  }
};

const signUp = async ({ body }: { body: any }): Promise<CustomReturn> => {
  try {
    let existingUser = await userModel.findOne({ email: body.email });

    if (existingUser) {
      return { status: 409, data: { message: "Email already exists" } };
    }

    const password = await bcrypt.hash(body.password, 10);

    await userModel.create({
      name: body.name,
      email: body.email,
      password,
      type: body.type,
    });

    return { status: 200, data: null };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Signing In" } };
  }
};

const updateProfilePic = async ({
  body,
  user,
}: {
  body: any;
  user: any;
}): Promise<CustomReturn> => {
  try {
    const filename = user.profilePic.split("/").pop();
    if (filename !== "default.png") {
      await removeFile(filename);
    }

    await userModel.findByIdAndUpdate(user._id, {
      profilePic: body.profilePic,
    });

    return { status: 200, data: null };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Signing In" } };
  }
};

const logout = async ({ user }: { user: any }): Promise<CustomReturn> => {
  try {
    await userModel.findByIdAndUpdate(user._id, {
      tokenCode: null,
    });

    return { status: 200, data: null };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Signing In" } };
  }
};

const getUserById = async ({
  params,
}: {
  params: any;
}): Promise<CustomReturn> => {
  try {
    const user = await userModel.findById(params.id);

    if (!user) {
      return { status: 404, data: { message: "User not found" } };
    }

    return { status: 200, data: user.toObject() };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Getting User" } };
  }
};

const updateDriverLocation = async ({
  body,
  user,
}: {
  body: any;
  user: any;
}): Promise<CustomReturn> => {
  try {
    await userModel.findByIdAndUpdate(user._id, {
      location: body.location,
    });

    // if driver is on ride then only emit to the rider but if not , and is available then emit to all the riders looking for a ride

    if (user.status === "onRide") {
      const ride = await rideModel.findOne({
        driver: user._id,
        status: "onRide",
      });

      if (ride) {
        const userSocket = rideSocketModel
          .find({
            user: ride.user,
          })
          .sort({ createdAt: -1 })
          .limit(1);

        EmitDataToRideNamespace({
          socketId: userSocket[0].socketId,
          event: "updateDriverLocation",
          data: {
            driverId: user._id,
            location: body.location,
          },
        });
      }
    } else if (user.status === "available") {
      notifyRiders(
        body.location.coordinates,
        {
          driverId: user._id,
          location: body.location,
        },
        "updateDriverLocation"
      );
    }

    return { status: 200, data: null };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Signing In" } };
  }
};

const rateDriver = async ({ body }: { body: any }): Promise<CustomReturn> => {
  try {
    const driver = await userModel.findById(body.driverId);

    if (!driver) {
      return { status: 404, data: { message: "Driver not found" } };
    }

    driver.rating = parseFloat(((driver.rating + body.rating) / 2).toFixed(1));
    await driver.save();

    return { status: 200, data: null };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Signing In" } };
  }
};

const updateDriverStatus = async ({
  body,
  user,
}: {
  body: any;
  user: any;
}): Promise<CustomReturn> => {
  try {
    await userModel.findByIdAndUpdate(user._id, {
      status: body.status,
    });

    return { status: 200, data: null };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Signing In" } };
  }
};

const getDrivers = async ({
  body,
  user,
}: {
  body: any;
  user: any;
}): Promise<CustomReturn> => {
  try {

    const drivers = await userModel.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [body.latitude, body.longitude],
          },
          $maxDistance: 2000,
        },
      },
      type: "driver",
      status: "available",
    });

    return { status: 200, data: drivers };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "Error Signing In" } };
  }
};

const view = {
  signIn,
  signUp,
  updateProfilePic,
  logout,
  getUserById,
  updateDriverLocation,
  rateDriver,
  updateDriverStatus,
  getDrivers,
};

export default view;
