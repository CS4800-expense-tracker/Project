import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import BodyText, { bodyTextStyle } from "./body-text";
import Heading2 from "./heading2";
import AnimatedButton from "./animated-button";
import { useToast } from "react-native-toast-notifications";
import { AppContext } from "./AppContext";
import { getH2XSmallMobileSize } from "./font-sizes";

export default function Login({ navigation }) {
  // TODO: CREATE on submit handler
  // Finish login flow
  // finish sign up flow
  const toast = useToast();
  const logo = require("./img/PennyWise_Logo_Db.png");
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // this will update the form that we eventually send
  function handleChange(name, value) {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  const [startLogin, setStartLogin] = useState(false);
  const { state: appContext, dispatch: appDispatch } = useContext(AppContext);

  function validateEmail(email) {
    const mail = String(email);
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.(com|edu)$/;
    const validEmail = emailRegex.test(mail);
    return validEmail;
  }

  function handleSubmit() {
    // validate email and password are filled out
    const email = formData.email;
    const password = formData.password;
    if (email.length < 1 || password.length < 1 || !validateEmail(email)) {
      toast.show("Email or password was incorrect", {
        type: "danger",
        placement: "top",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
      return;
    }

    // Then we want to check againt the DB that they exist --> probably just send to a "login" route int he backend
    setStartLogin(!startLogin);
  }

  useEffect(() => {
    if (startLogin) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      };

      // fetch("https://api.pennywise.money/login", requestOptions)
      fetch(" http://127.0.0.1:5000/login", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data && "error" in data) {
            toast.show(data["error"], {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else {
            // If we have no error, we just navigate to account overview and we set the user id to context
            if (data) {
              appDispatch({type: "setUserID", value: data.user_id})
              if (data.has_plaid_token) {
                appDispatch({type: "setIsBankLinked", value: true})
              }
              navigation.navigate("Overview");
              return;
            } else {
              toast.show("Server error occured", {
                type: "danger",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              });
              return;
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [startLogin]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, styles.bottomMarginLarge]}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Heading2
        style={[
          styles.bottomMarginSmall,
          styles.textColor,
          { width: "90%", textAlign: "center" },
        ]}
      >
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
      <View style={styles.infoCard}>
        <Heading2 style={[styles.infoDescription, styles.textColor]}>
          Email
        </Heading2>
        <TextInput
          onChangeText={(value) => {
            handleChange("email", value);
          }}
          inputMode="text"
          textContentType="email"
          autoCapitalize="none"
          value={formData.email}
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
          onChangeText={(value) => {
            handleChange("password", value);
          }}
          value={formData.password}
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
        <View style={styles.horizontalButtonContainer}>
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"Log In"}
            viewStyle={styles.twoButtons}
            onPress={handleSubmit}
          />
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"Sign Up"}
            viewStyle={styles.twoButtons}
            onPress={() => {
              navigation.navigate("Signup");
            }}
          />
        </View>
      </View>
    </View>
  );
}

const makeStyles = (width) =>
  StyleSheet.create({
    horizontalButtonContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    twoButtons: {
      borderRadius: 32,
      paddingVertical: 8,
      paddingHorizontal: width >= 600 ? 48 : 32,
    },
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
      fontSize: getH2XSmallMobileSize(width),
    },
    infoCard: {
      width: "90%",
      maxWidth: 448,
      borderRadius: 32,
      padding: 32,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.15,
      shadowRadius: 32,
    },
    infoInput: {
      width: "100%",
      padding: 8,
      // borderWidth: 2,
      borderRadius: 8,
      // borderColor: "#333",
      backgroundColor: "#ddd",
    },
    infoDescription: {
      fontSize: getH2XSmallMobileSize(width),
      marginBottom: 8,
    },
    submitButtonView: {
      borderRadius: 32,
      paddingVertical: 8,
    },
  });
