export const mainURL = "http://192.168.1.15:4500";
const url = mainURL + "/api/";

const user = {
  signin: url + "user/signin", // POST
  signup: url + "user/signup", // POST
  updateProfilePic: url + "user/updateProfilePic", // PUT
  logout: url + "user/logout", // POST
  getUserByToken: url + "user/getUserByToken", // GET
  getUserById: (userId: string) => url + "user/getUserById/" + userId, // GET
  updateLocation: url + "user/updateLocation/", // PUT
  rateDriver: url + "user/rateDriver/", // PUT
  status: url + "user/status/", // PUT
  getDrivers: url + "user/getDrivers/", // POST
};

const asset = {
  upload: url + "asset/upload", // POST
};

const ride = {
  recentRides: url + "ride", // GET
  availableRides: url + "ride/availableRides", // GET
  create: url + "ride/create", // POST
  presentOffer: url + "ride/presentOffer", // PUT
  acceptOffer: url + "ride/acceptOffer", // PUT
  startRide: url + "ride/startRide", // PUT
  completed: url + "ride/completed", // PUT
};

const socket = {
  connect: mainURL + "/ride",
}

const API = {
  user,
  asset,
  ride,
  socket
};
export default API;
