import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
}

declare interface MarkerData {
  latitude: number;
  longitude: number;
  _id: string;
  title: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
  first_name: string;
  last_name: string;
  time?: string;
  price?: string;
  driver: any
}

declare interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
  onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
  selectedDriver?: number | null;
  onMapReady?: () => void;
}

declare interface Ride {
  user: any;
  driver?: any;
  status: "pending" | "assigned" | "onRide" | "finished";
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  locationName: string;
  destination: {
    type: "Point";
    coordinates: [number, number];
  };
  destinationName: string;
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
  price?: number;
  createdAt: string;
}

declare interface ButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  style?: any;
  isLoading?: boolean;
}

declare interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: any;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  disabled?: boolean;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: any;
  containerStyle?: any;
  inputStyle?: any;
  iconStyle?: any;
  hint?: string;
}

declare interface SelectFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  labelStyle?: any;
  containerStyle?: any;
  inputStyle?: any;
  iconStyle?: any;
  hint?: string;
  options: { key: string; value: string }[];
  onChangeText: (value: string) => void;
  defaultOption?: { key: string; value: string };
}

declare interface Address {
  latitude: number;
  longitude: number;
  address: string;
}

declare interface PaymentProps {
  fullName: string;
  email: string;
  amount: string;
  driverId: number;
  rideTime: number;
}

declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface DriverStore {
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
}

declare interface DriverCardProps {
  item: any;
  selected: string;
  setSelected: (string) => void;
}
