import API from "@/utility/api";
import axios from "axios";

export const signOut = async (token: string) => {
  try {
    await axios.get(API.user.logout, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
