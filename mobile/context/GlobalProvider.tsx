import { getFromLocalStorage } from "../hooks/localStorage";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import NoInternetBar from "../components/NoInternetBar";
import Toast from "react-native-toast-message";
import { createContext, useContext, useEffect, useState } from "react";
import API from "@/utility/api";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "@/utility/colors";
import { Address } from "@/types/type";
import { io } from "socket.io-client";

interface GlobalContextType {
  user: any;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  internetAccess: boolean;
  userLocation: Address;
  setUserLocation: React.Dispatch<React.SetStateAction<Address>>;
  destinationLocation: Address;
  setDestinationLocation: React.Dispatch<React.SetStateAction<Address>>;
  selectedDriver: any;
  setSelectedDriver: React.Dispatch<React.SetStateAction<any>>;
  drivers: any;
  setDrivers: React.Dispatch<React.SetStateAction<any>>;
  ride: any;
  setRide: React.Dispatch<React.SetStateAction<any>>;
  socket: any;
 }

const GlobalContext = createContext<GlobalContextType | null>(null);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);
  const [ride, setRide] = useState<any>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [drivers, setDrivers] = useState<any>([]);
  const [userLocation, setUserLocation] = useState<Address>({
    latitude: 0,
    longitude: 0,
    address: "",
  });
  const [destinationLocation, setDestinationLocation] = useState<Address>({
    latitude: 0,
    longitude: 0,
    address: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [internetAccess, setInternetAccess] = useState<boolean>(true);

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        setInternetAccess(false);
        Toast.show({
          type: "error",
          text1: "No Internet",
          text2: "Please check your internet connection",
        });
      } else if (state.isConnected === true) {
        if (!internetAccess) {
          getUser();
        }
        setInternetAccess(true);
      }
    });

    async function getUser() {
      try {
        const userToken = await getFromLocalStorage("userToken");
        if (userToken) {
          const response = await axios.get(API.user.getUserByToken, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          if (response.status === 200) {
            setUser(response.data);
          }
        }
      } catch (error) {
        console.log("Context Error: ", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [internetAccess]);

  useEffect(() => {
    if (user) {
      const socket = io(API.socket.connect, {
        auth: {
          authorization: `Bearer ${user.token}`,
        },
        forceNew: true,
      });
      setSocket(socket);
    }
  }, [user]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <GlobalContext.Provider
      value={{
        user,
        loading,
        setUser,
        internetAccess,
        userLocation,
        setUserLocation,
        destinationLocation,
        setDestinationLocation,
        selectedDriver,
        setSelectedDriver,
        drivers,
        setDrivers,
        ride,
        setRide,
        socket
      }}
    >
      {!internetAccess && <NoInternetBar />}
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
