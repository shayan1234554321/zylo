import React from "react";
import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";
import { InputFieldProps, SelectFieldProps } from "@/types/type";
import { SelectList } from "react-native-dropdown-select-list";
import { Colors } from "@/utility/colors";

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  hint,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container, containerStyle]}>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
          <View style={[styles.inputContainer, containerStyle]}>
            {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}

            <TextInput
              style={[styles.input, inputStyle]}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
          {hint && <Text style={styles.hint}>{hint}</Text>}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  icon,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  hint,
  onChangeText,
  options,
  ...props
}: SelectFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container, containerStyle]}>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
          <View style={[containerStyle]}>
            {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}

            <SelectList
              setSelected={(val: string) => onChangeText(val)}
              data={options}
              save="value"
              search={false}
              boxStyles={{
                borderWidth: 0,
                backgroundColor: Colors.backgroundLight,
                borderRadius: 30,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              inputStyles={{
                padding: 10,
              }}
              dropdownStyles={{
                borderRadius: 30
              }}
              {...props}
            />
          </View>
          {hint && <Text style={styles.hint}>{hint}</Text>}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: "100%",
  },
  label: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.backgroundLight,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 15,
    fontFamily: "Poppins",
    textAlignVertical: "center",
  },
  hint: {
    color: "red",
    fontSize: 14,
  },
});
