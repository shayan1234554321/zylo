import { Href, Link, router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { icons, images } from "@/constants/icons";
import { Colors } from "@/utility/colors";
import { LoginSchema } from "@/validation/auth";
import API from "@/utility/api";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useGlobalContext } from "@/context/GlobalProvider";
import { saveToLocalStorage } from "@/hooks/localStorage";

const SignIn = () => {
  const { setUser } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState<{ [key: string]: string }>({
    email: "",
    password: "",
  });

  const submit = async () => {
    LoginSchema.validate(form, { abortEarly: false })
      .then(async () => {
        try {
          setSubmitting(true);
          const user = await axios.post(API.user.signin, { ...form });
          await saveToLocalStorage("userToken", user.data.token);
          setUser(user.data);

          if (router.canDismiss()) {
            router.dismissAll();
          }
          router.replace("/home" as Href<string>);
        } catch (error: any) {
          if (error.response.status == 404) {
            setErrors((prev) => ({
              ...prev,
              email: "Email not found",
            }));
          } else if (error.response.status == 401) {
            Toast.show({
              type: "error",
              text1: "Invalid credentials",
              text2: "Please check your Fields",
            });
          } else if (error.response.status == 500) {
            Toast.show({
              type: "error",
              text1: "Something Went Wrong",
              text2: "Please try again",
            });
          }
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
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={images.signUpCar} style={styles.headerImage} />
          <Text style={styles.headerText}>Welcome Back👋</Text>
        </View>

        <View style={styles.formContainer}>
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

          <CustomButton
            title="Sign In"
            onPress={submit}
            style={styles.signInButton}
            isLoading={isSubmitting}
          />

          <Link href={"/sign-up" as Href<string>} style={styles.signUpLink}>
            Don't have an account?{" "}
            <Text style={styles.signUpLinkText}>Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  signInButton: {
    marginTop: 20,
  },
  signUpLink: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  signUpLinkText: {
    color: "#337ab7",
  },
});

export default SignIn;
