import { TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";
import { ButtonProps } from "@/types/type";
import { useGlobalContext } from "@/context/GlobalProvider";
import Toast from "react-native-toast-message";
import { Colors } from "@/utility/colors";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return Colors.secondary;
    case "danger":
      return "red";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-[#0286FF]";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  style,
  isLoading,
  ...props
}: ButtonProps) => {
  const { internetAccess } = useGlobalContext();
  const handlePress = () => {
    if (!isLoading) {
      if (internetAccess) {
        onPress();
      } else {
        Toast.show({
          type: "error",
          text1: "No Internet",
          text2: "Please check your internet connection",
        });
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        { backgroundColor: getBgVariantStyle(bgVariant) },
        style,
      ]}
      {...props}
    >
      {IconLeft && <IconLeft />}
      <Text
        style={[
          styles.text,
          { backgroundColor: getTextVariantStyle(textVariant) },
        ]}
      >
        {title}
      </Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  primary: {
    backgroundColor: "#007bff",
  },
  default: {
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  defaultText: {
    color: "#000",
  },
  primaryText: {
    color: "#fff",
  },
});

export default CustomButton;
