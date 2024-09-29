import { View, Image, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { icons } from "@/constants/icons";
import { GoogleInputProps } from "@/types/type";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const GoogleTextInput: React.FC<GoogleInputProps> = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
  disabled = false,
}: GoogleInputProps) => {
  return (
    <View style={[styles.container, containerStyle, {pointerEvents: disabled ? "none" : "auto"}]}>
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Search"
        debounce={200}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: [styles.textInput, { backgroundColor: textInputBackgroundColor }],
          listView: styles.listView,
        }}
        onPress={(data, details = null) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: 'en',
        }}
        renderLeftButton={() => (
          <View style={styles.leftButtonContainer}>
            <Image
              source={icon ? icon : icons.search}
              style={styles.leftButtonIcon}
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: 'gray',
          placeholder: initialLocation ?? 'Where do you want to go?',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    zIndex: 50,
    shadowColor: '#d4d4d4',
  },
  textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginHorizontal: 20,
    position: 'relative',
    shadowColor: '#d4d4d4',
  },
  textInput: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    width: '100%',
    borderRadius: 20,
  },
  listView: {
    backgroundColor: 'white',
    position: 'relative',
    top: 0,
    width: '100%',
    borderRadius: 10,
    shadowColor: '#d4d4d4',
    zIndex: 99,
  },
  leftButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  leftButtonIcon: {
    width: 24,
    height: 24,
  },
});

export default GoogleTextInput;
