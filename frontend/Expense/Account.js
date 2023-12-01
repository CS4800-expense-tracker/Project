import React, { useEffect, useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
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
  // assuming we pull this in from a context
  const user_id = 1

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

  const BankButton = () => {
    const [linkToken, setLinkToken] = useState(null);
    const generateToken = async () => {
      const response = await fetch('http://127.0.0.1:5000/create_link_token', {
        headers: {'Content-Type':'application/json'},
        method: 'POST',
        body: JSON.stringify({user_id: user_id})
      });
      const data = await response.json();
      if(data){
        setLinkToken(data.link_token);
      }
    };

    useEffect(() => {
      generateToken();
    }, []);
    useEffect(() => {
      console.log(linkToken)
    }, [linkToken]);
    return linkToken != null ? <PlaidLink linkToken={linkToken} /> : <></>;
  }

  const PlaidLink = (props) => {
    const onSuccess = React.useCallback((public_token, metadata) => {
      // send public_token to server
      const response = fetch('http://127.0.0.1:5000/set_access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token: public_token, user_id: user_id }),
      });
      // Handle response ...
      // We need to store the access token in the react context for this application
      // That way we don't have to keep pinging the database for that stuff
      // Alternatively could use localStorage, but that has more security risks (I think)
    }, []);
    const config = {
      token: props.linkToken,
      onSuccess,
    };
    const { open, ready } = usePlaidLink(config);
    return (
      <AnimatedButton
            bgColor={linkedBank ? "#ddd" : "#BCEE51"}
            hoverBgColor={linkedBank ? "#803333" : "#558033"}
            textColor={linkedBank ? "#803333" : "#384718"}
            hoverTextColor={"#fff"}
            text={linkedBank ? "Unlink your account" : "Link your account"}
            buttonStyle={{ width: linkedBank ? 216 : 200 }}
            viewStyle={styles.bankLinkButtonView}
            onPress={() => open()} 
            disabled={!ready}
          />
    );
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
        <BankButton />
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
