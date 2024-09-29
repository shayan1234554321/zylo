import sedan from "@/assets/images/sedan.png";
import suv from "@/assets/images/suv.png";
import truck from "@/assets/images/truck.png";
import van from "@/assets/images/van.png";

export const userTypes = [
  { key: "rider", value: "Rider" },
  { key: "driver", value: "Driver" },
];
export const carTypes = [
  { key: "sedan ", value: "Sedan" },
  { key: "van", value: "Van" },
  { key: "suv", value: "SUV" },
  { key: "truck", value: "Pickup Truck" },
];
export const carTypeSeats = [
  { key: "sedan", seat: 4, icon: sedan },
  { key: "van", seat: 7, icon: van },
  { key: "suv", seat: 5, icon: suv },
  { key: "truck", seat: 8, icon: truck },
];
