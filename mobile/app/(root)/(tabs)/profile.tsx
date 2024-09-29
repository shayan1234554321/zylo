import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InputField } from "@/components/InputField";
import { useGlobalContext } from "@/context/GlobalProvider";
import { mainURL } from "@/utility/api";

const Profile = () => {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.header}>My profile</Text>

        <View style={styles.profilePictureContainer}>
          <Image
            source={{
              uri: mainURL + user?.profilePic,
            }}
            style={styles.profilePicture}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoContent}>
            <InputField
              label="Name"
              placeholder={user?.name || "Not Found"}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputField}
              editable={false}
            />

            <InputField
              label="Email"
              placeholder={user?.email}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputField}
              editable={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  header: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
    marginVertical: 20,
  },
  profilePictureContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    padding: 20,
  },
  infoContent: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
  },
  inputField: {
    padding: 15,
  },
});

export default Profile;
