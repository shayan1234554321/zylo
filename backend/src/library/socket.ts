import { verifyToken } from "./token.js";
import rideSocketModel from "../model/rideSocket.js";
import userModel from "../model/user.js";
import { notifyRiders } from "../hooks/socket.js";

export const handleSocketRide = async (socket: any) => {
  try {
    const { auth } = socket.handshake;
    const authorizationHeader = auth["authorization"];
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      socket.disconnect();
      return;
    }
    const bearerToken = authorizationHeader.split(" ")[1];

    const user = await verifyToken(bearerToken);

    socket.on("disconnect", async () => {
      try {
        if (user?.data?._id) {
          await rideSocketModel.deleteOne({ user: user.data._id });
          // const driver = await userModel
          //   .findByIdAndUpdate(
          //     user.data._id,
          //     { status: "unavailable" },
          //     { new: true }
          //   )
          //   .select("-password -tokenCode");
          // notifyRiders(driver.location.coordinates, driver, "driverLeft");
        }
      } catch (error) {
        console.error(
          "Error occurred while deleting socket entry:",
          error.message
        );
      }
    });
    if (user.success) {
      await rideSocketModel.create({
        socket: socket.id,
        user: user.data._id,
        type: user.data.type,
      });
      if (user?.data?.type === "driver" && user?.data?.status === "available") {
        await notifyRiders(
          user.data.location.coordinates,
          user.data,
          "driverJoined"
        );
      }
    } else {
      socket.disconnect();
      return;
    }
  } catch (error) {
    console.error("Error occurred during user authentication:", error.message);
    socket.disconnect();
  }
};
