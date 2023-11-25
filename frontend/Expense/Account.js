import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Link } from "@react-navigation/native";
import Sidebar from "./sidebar";
import SectionView from "./section-view";
import Heading1 from "./heading1";
import Heading2 from "./heading2";
import BodyText, { bodyTextStyle } from "./body-text";
import AnimatedButton from "./animated-button";

export default function Account() {
  const [num, setNum] = React.useState("");
  const linkedBank = false;

  const onChanged = (text) => {
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
      <Sidebar page="account" />
      <SectionView>
        <Heading1 style={styles.bottomMarginLarge}>Account Settings</Heading1>
        <Heading2 style={styles.bottomMarginSmall}>
          Update your monthly budget
        </Heading2>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text) => onChanged(text)}
          value={num}
          placeholder="Whole number (e.g. 750, 3000, 12000)"
          placeholderTextColor="#888"
          maxLength={6}
          style={[bodyTextStyle(), styles.bottomMarginSmall, styles.input]}
        />
        <View style={[styles.flexRow, styles.bottomMarginLarge]}>
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"Submit"}
            buttonStyle={[styles.budgetButton]}
            viewStyle={styles.budgetButtonView}
          />
          <AnimatedButton
            bgColor={"#ddd"}
            hoverBgColor={"#333"}
            textColor={"#333"}
            hoverTextColor={"#fff"}
            text={"Clear"}
            buttonStyle={[styles.budgetButton]}
            viewStyle={styles.budgetButtonView}
          />
        </View>
        <Heading2 style={styles.bottomMarginSmall}>
          Link your bank account
        </Heading2>
        <BodyText style={styles.bottomMarginSmall}>
          You {linkedBank ? "already" : "do not currently"} have a bank account
          connected with PennyWise
        </BodyText>
        <Link
          to={{ screen: "BankLink" }}
          style={{ width: linkedBank ? 216 : 200 }}
        >
          <AnimatedButton
            bgColor={linkedBank ? "#ddd" : "#BCEE51"}
            hoverBgColor={linkedBank ? "#803333" : "#558033"}
            textColor={linkedBank ? "#803333" : "#384718"}
            hoverTextColor={"#fff"}
            text={linkedBank ? "Unlink your account" : "Link your account"}
            buttonStyle={{ width: linkedBank ? 216 : 200 }}
            viewStyle={styles.bankLinkButtonView}
          />
        </Link>
      </SectionView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
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
  sectionView: {
    display: "flex",
    alignItems: "center",
    width: "80%",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  input: {
    backgroundColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    width: 384,
  },
  budgetButton: {
    width: 128,
  },
  budgetButtonView: {
    borderRadius: 32,
    paddingVertical: 8,
  },
  bankLinkButtonView: {
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
