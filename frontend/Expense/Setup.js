import React from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";
import { Link } from "@react-navigation/native";
import BodyText, { bodyTextStyle } from "./body-text";
import Heading2 from "./heading2";
import AnimatedButton from "./animated-button";

export default function Setup() {
  const logo = require("./img/PennyWise_Logo_Db.png");
  const [num, setNum] = React.useState("");

  const onBudgetChanged = (text) => {
    let newText = "";
    let numbers = "0123456789";

    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) newText += text[i];
    }

    setNum(newText);
  };

  const onSubmitPress = () => {
    if (numbers.length !== 0) setNum("");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, styles.bottomMarginMediumLarge]}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Heading2 style={[styles.bottomMarginSmall, styles.textColor]}>
        Welcome to PennyWise
      </Heading2>
      <Heading2
        style={[
          styles.infoHeading,
          styles.bottomMarginMediumLarge,
          styles.textColor,
        ]}
      >
        Please enter your information below
      </Heading2>
      <View style={[styles.infoCard, styles.bottomMarginLarge]}>
        <Heading2
          style={[
            styles.infoDescription,
            styles.textColor,
            styles.bottomMarginSmall,
          ]}
        >
          First name
        </Heading2>
        <TextInput
          inputMode="numeric"
          onChangeText={(text) => onBudgetChanged(text)}
          value={num}
          placeholder="John"
          placeholderTextColor="#888"
          maxLength={16}
          returnKeyType="go"
          style={[
            styles.infoInput,
            bodyTextStyle(),
            styles.bottomMarginMedium,
            styles.textColor,
          ]}
        />
        <Heading2
          style={[
            styles.infoDescription,
            styles.textColor,
            styles.bottomMarginSmall,
          ]}
        >
          Last name
        </Heading2>
        <TextInput
          inputMode="numeric"
          onChangeText={(text) => onBudgetChanged(text)}
          value={num}
          placeholder="Doe"
          placeholderTextColor="#888"
          maxLength={16}
          returnKeyType="go"
          style={[
            styles.infoInput,
            bodyTextStyle(),
            styles.bottomMarginMedium,
            styles.textColor,
          ]}
        />
        <Heading2
          style={[
            styles.infoDescription,
            styles.textColor,
            styles.bottomMarginSmall,
          ]}
        >
          Budget
        </Heading2>
        <TextInput
          inputMode="numeric"
          onChangeText={(text) => onBudgetChanged(text)}
          value={num}
          placeholder="Whole number (e.g. 750, 3000, 12000)"
          placeholderTextColor="#888"
          maxLength={16}
          returnKeyType="go"
          style={[
            styles.infoInput,
            bodyTextStyle(),
            styles.textColor,
            { marginBottom: 8 },
          ]}
        />
        <View style={styles.subTextView}>
          <BodyText style={[styles.subText, styles.bottomMarginMedium]}>
            Your budget can be changed at any time in your account settings.
          </BodyText>
        </View>
        <Link to={{ screen: "BankLink" }}>
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"Continue"}
            buttonStyle={{ width: "100%" }}
            viewStyle={styles.continueButtonView}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    height: "fit-content",
  },
  bottomMarginSmall: {
    marginBottom: 16,
  },
  bottomMarginMedium: {
    marginBottom: 32,
  },
  bottomMarginMediumLarge: {
    marginBottom: 48,
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
  subTextView: {
    // width: "100%",
  },
  subText: {
    fontSize: 12,
    textAlign: "center",
  },
  infoCard: {
    borderRadius: 32,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    display: "flex",
    width: "min-content",
  },
  infoInput: {
    width: 360,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  continueButtonView: {
    borderRadius: 32,
    paddingVertical: 8,
  },
});
