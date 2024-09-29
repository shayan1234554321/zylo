import { Href, Link, router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { InputField, SelectField } from "@/components/InputField";
import { icons, images } from "@/constants/icons";
import Toast from "react-native-toast-message";
import axios from "axios";
import API from "@/utility/api";
import { SignupSchema } from "@/validation/auth";
import { carTypes, userTypes } from "@/utility/constant";
import { Colors } from "@/utility/colors";

const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState<{ [key: string]: string }>({
    name: "",
    email: "",
    password: "",
    type: "Rider",
  });

  const submit = async () => {
    let values = {};
    if (form.type == "Driver") {
      values = {
        name: form.name,
        email: form.email,
        password: form.password,
        type:
          userTypes.find((type) => type.value == form.type)?.key || "driver",
        carType:
          carTypes.find((type) => type.value == form.carType)?.key || "sedan ",
      };
    } else {
      values = {
        name: form.name,
        email: form.email,
        password: form.password,
        type: userTypes.find((type) => type.value == form.type)?.key || "rider",
      };
    }

    SignupSchema.validate(values, { abortEarly: false })
      .then(async () => {
        try {
          setSubmitting(true);
          await axios.post(API.user.signup, { ...values });
          Toast.show({
            type: "success",
            text1: "Signup Success",
            text2: "Please continue Signing In",
          });

          setForm({ name: "", email: "", password: "", type: "Rider" });
          router.push("/sign-in" as Href<string>);
        } catch (error: any) {
          console.log(error);

          Toast.show({
            type: "error",
            text1: "Something Went Wrong",
            text2: "Please try again",
          });
        } finally {
          setSubmitting(false);
        }
      })
      .catch((validationErrors) => {
        if (validationErrors.inner) {
          const errors: { [key: string]: string } = {};
          validationErrors.inner.forEach((error: any) => {
            errors[error.path] = error.message;
          });
          setErrors(errors);
        }
      });
  };

  const handleChangeFormValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainView}>
        <View style={styles.header}>
          <Image source={images.signUpCar} style={styles.headerImage} />
          <Text style={styles.headerText}>Create Your Account</Text>
        </View>
        <View style={styles.formContainer}>
          <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(e) => handleChangeFormValue("name", e)}
            hint={errors.name}
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(e) => handleChangeFormValue("email", e)}
            hint={errors.email}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(e) => handleChangeFormValue("password", e)}
            hint={errors.password}
          />
          <SelectField
            label="Signup As"
            value={form.type}
            onChangeText={(e) => handleChangeFormValue("type", e)}
            hint={errors.type}
            options={userTypes}
            defaultOption={userTypes[0]}
          />
          {form.type == "Driver" && (
            <SelectField
              label="Your Car Type"
              value={form.carType}
              onChangeText={(e: string) => handleChangeFormValue("carType", e)}
              hint={errors.carType}
              options={carTypes}
              defaultOption={carTypes[0]}
            />
          )}
          <CustomButton
            title="Sign Up"
            onPress={submit}
            style={styles.signUpButton}
            isLoading={isSubmitting}
          />
          <Link href={"/sign-in" as Href<string>} style={styles.signInLink}>
            Already have an account?{" "}
            <Text style={styles.signInLinkText}>Log In</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mainView: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    width: "100%",
    height: 250,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: 250,
  },
  headerText: {
    fontSize: 30,
    fontFamily: "PoppinsBold",
    color: Colors.background,
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  formContainer: {
    padding: 20,
  },
  signUpButton: {
    marginTop: 20,
  },
  signInLink: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  signInLinkText: {
    color: "#337ab7",
  },
  modal: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    fontFamily: "Poppins",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  verifyButton: {
    backgroundColor: "#2ecc71",
    marginTop: 20,
  },
  successModal: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    minHeight: 300,
    alignItems: "center",
  },
  checkImage: {
    width: 110,
    height: 110,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 30,
    fontFamily: "PoppinsBold",
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    fontFamily: "Poppins",
    marginBottom: 20,
    textAlign: "center",
  },
  browseButton: {
    marginTop: 20,
  },
});

export default SignUp;
