import React from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "@react-navigation/native";
import BodyText, { bodyTextStyle } from "./body-text";
import Heading2 from "./heading2";
import AnimatedButton from "./animated-button";

export default function BankLink() {
  const logo = require("./img/PennyWise_Logo_Db.png");
  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");

  return (
    <View style={styles.container}>
      <View style={[styles.header, styles.bottomMarginLarge]}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Heading2 style={[styles.bottomMarginSmall, styles.textColor]}>
        Let's get your bank account connected
      </Heading2>
      <Heading2
        style={[
          styles.infoHeading,
          styles.bottomMarginMedium,
          styles.textColor,
        ]}
      >
        Enter your information below
      </Heading2>
      <View style={[styles.infoCard, styles.bottomMarginMedium]}>
        <Heading2 style={[styles.infoDescription, styles.textColor]}>
          Username
        </Heading2>
        <TextInput
          inputMode="text"
          textContentType="username"
          autoCapitalize="none"
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="johndoe@abc.com"
          placeholderTextColor="#888"
          maxLength={100}
          returnKeyType="next"
          style={[
            styles.infoInput,
            bodyTextStyle(),
            styles.bottomMarginMedium,
            styles.textColor,
          ]}
        />
        <Heading2 style={[styles.infoDescription, styles.textColor]}>
          Password
        </Heading2>
        <TextInput
          inputMode="text"
          textContentType="password"
          secureTextEntry={true}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={(text) => setPass(text)}
          value={pass}
          placeholder="MyPassword123"
          placeholderTextColor="#888"
          maxLength={100}
          returnKeyType="go"
          style={[
            styles.infoInput,
            bodyTextStyle(),
            styles.bottomMarginMedium,
            styles.textColor,
          ]}
        />
        <AnimatedButton
          bgColor={"#BCEE51"}
          hoverBgColor={"#558033"}
          textColor={"#384718"}
          hoverTextColor={"#fff"}
          text={"Submit"}
          viewStyle={styles.submitButtonView}
        />
      </View>
      <View style={{ paddingBottom: 64 }}>
        <Link to={{ screen: "Overview" }}>
          <BodyText style={[styles.textColor, styles.skipSetup]}>
            Setup later
          </BodyText>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  bottomMarginSmall: {
    marginBottom: 16,
  },
  bottomMarginMedium: {
    marginBottom: 32,
  },
  bottomMarginLarge: {
    marginBottom: 64,
  },
  textColor: {
    color: "#333",
  },
  header: {
    height: "auto",
    width: "100%",
    backgroundColor: "#131808",
    paddingVertical: 16,
  },
  logo: {
    height: 48,
    width: undefined,
    aspectRatio: "37 / 7",
    resizeMode: "contain",
  },
  infoHeading: {
    fontSize: 24,
  },
  infoCard: {
    borderRadius: 32,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
  },
  infoInput: {
    width: 360,
    padding: 8,
    // borderWidth: 2,
    borderRadius: 8,
    // borderColor: "#333",
    backgroundColor: "#ddd",
  },
  infoDescription: {
    fontSize: 24,
    marginBottom: 8,
  },
  submitButtonView: {
    borderRadius: 32,
    paddingVertical: 8,
  },
  skipSetup: {
    borderBottomWidth: 2,
    borderBottomColor: "#333",
  },
});
