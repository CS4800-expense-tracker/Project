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

export default function Signup({ navigation }) {
  // Add linked bank handlers
  // Check in overview for uesr log in
  // Check in overview for user bank linkage
  const toast = useToast();
  const logo = require("./img/PennyWise_Logo_Db.png");
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    categories: [
      {
        name: "",
        amount: "",
      },
    ],
    budget: "",
    password: "",
  });
  function handleAddCategory() {
    setFormData({
      ...formData,
      categories: [
        ...formData.categories,
        {
          name: "",
          amount: "",
        },
      ],
    });
  }
  function handleDeleteCategory() {
    setFormData({
      ...formData,
      categories: formData.categories.slice(0, -1),
    });
  }
  // Change text only gives the value of the input. we need to attach the name and index on our own
  function handleCategoryChange(idx, name, value) {
    const newCategories = formData.categories.map((category, index) => {
      if (index === idx) {
        return { ...category, [name]: value };
      }
      return category;
    });

    setFormData({
      ...formData,
      categories: newCategories,
    });
  }

  // this will update the form that we eventually send
  function handleChange(name, value) {
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [textBodyWidth, setTextBodyWidth] = useState(18);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    if (windowWidth >= 950) setTextBodyWidth(18);
    else if (windowWidth >= 600) setTextBodyWidth(16);
    else setTextBodyWidth(14);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);




  const [startSignup, setStartSignup] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const { state: appContext, dispatch: appDispatch } = useContext(AppContext);

  function validateEmail(email) {
    const mail = String(email);
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.(com|edu)$/;
    const validEmail = emailRegex.test(mail);
    return validEmail;
  }

  function handleSubmit() {
    // validate email and password are filled out
    const { email, name, categories, budget, password } = formData;

    if (
      email.length < 1 ||
      password.length < 1 ||
      name.length < 1 ||
      categories.length < 1 ||
      budget < 1 ||
      !validateEmail(email)
    ) {
      toast.show(
        "Please fill all inputs and use a valid email ending in .com or .edu",
        {
          type: "danger",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        }
      );
      return;
    }

    const percentTotal = formData.categories.reduce((sum, category) => {
      return sum + Number(category.amount);
    }, 0);

    if (percentTotal !== 100) {
      toast.show(
        "All percentages in the categories section must add up to 100",
        {
          type: "danger",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        }
      );
      return;
    }

    // Then we want to check againt the DB that they exist --> probably just send to a "login" route int he backend
    setStartSignup(!startSignup);
  }

  useEffect(() => {
    if (startSignup) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      };

      // fetch("http://127.0.0.1:5000/signup", requestOptions)
      fetch("https://cs4800.acgandhi.com/signup", requestOptions)
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
              localStorage.setItem("userID", data.user_id)
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
  }, [startSignup]);

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
          Name
        </Heading2>
        <TextInput
          inputMode="text"
          textContentType="name"
          secureTextEntry={false}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={(value) => {
            handleChange("name", value);
          }}
          value={formData.name}
          placeholder="John Smith"
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
        <Heading2 style={[styles.infoDescription, styles.textColor]}>
          Categories
        </Heading2>
        {formData.categories.map((category, idx) => {
          return (
            <View style={[styles.horizontalContainer, { gap: 16 }]} key={idx}>
              <TextInput
                inputMode="text"
                textContentType={`category_name_${idx}`}
                secureTextEntry={false}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(value) => {
                  handleCategoryChange(idx, "name", value);
                }}
                value={formData.categories[idx].name}
                placeholder="Groceries..."
                placeholderTextColor="#888"
                maxLength={100}
                returnKeyType="go"
                style={[
                  styles.categoryNameInput,
                  styles.textBody,
                  styles.bottomMarginSmall,
                  styles.textColor,
                ]}
              />
              <TextInput
                inputMode="text"
                textContentType={`category_amount_${idx}`}
                secureTextEntry={false}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(value) => {
                  handleCategoryChange(idx, "amount", value);
                }}
                value={formData.categories[idx].amount}
                placeholder="10%"
                placeholderTextColor="#888"
                maxLength={100}
                returnKeyType="go"
                style={[
                  styles.categoryAmountInput,
                  styles.textBody,
                  styles.bottomMarginSmall,
                  styles.textColor,
                ]}
              />
            </View>
          );
        })}
        <View style={styles.horizontalButtonContainer}>
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"+"}
            viewStyle={styles.addDeleteCategoryButton}
            onPress={handleAddCategory}
          />
          {/* CHANGE MINUS BUTTON COLORS AND MAYBE LAYOUT IDK*/}
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"-"}
            viewStyle={styles.addDeleteCategoryButton}
            onPress={handleDeleteCategory}
          />
        </View>
        <Heading2 style={[styles.infoDescription, styles.textColor]}>
          Budget
        </Heading2>
        <TextInput
          onChangeText={(value) => {
            handleChange("budget", value);
          }}
          inputMode="numeric"
          textContentType="budget"
          autoCapitalize="none"
          value={formData.budget}
          placeholder="$1000"
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
          onChangeText={(value) => {
            handleChange("password", value);
          }}
          secureTextEntry={true}
          inputMode="text"
          textContentType="password"
          autoCapitalize="none"
          value={formData.password}
          placeholder="MyPassword123"
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
        <View style={styles.horizontalLoginSignupContainer}>
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"Sign Up"}
            viewStyle={styles.twoButtons}
            onPress={handleSubmit}
          />
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"Log In"}
            viewStyle={styles.twoButtons}
            onPress={() => {
              navigation.navigate("Login");
            }}
          />
        </View>
      </View>
    </View>
  );
}

function getTextBodyWidth(windowWidth) {
  if (windowWidth >= 950) return 18;
  else if (windowWidth >= 600) return 16;
  else return 14;
}

const makeStyles = (width) =>
  StyleSheet.create({
    horizontalLoginSignupContainer: {
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
    horizontalContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    horizontalButtonContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      marginHorizontal: "auto",
      marginBottom: 32,
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
    categoryNameInput: {
      width: "80%",
      padding: 8,
      // borderWidth: 2,
      borderRadius: 8,
      // borderColor: "#333",
      backgroundColor: "#ddd",
    },
    categoryAmountInput: {
      width: "20%",
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
    addDeleteCategoryButton: {
      borderRadius: 32,
      paddingVertical: 4,
      paddingHorizontal: 10,
      width: width >= 600 ? 128 : 96,
    },
    submitButtonView: {
      borderRadius: 32,
      padding: 8,
      marginTop: 8,
    },
    textBody: {
      fontFamily: "Rubik_400Regular",
      fontSize: getTextBodyWidth(width),
      letterSpacing: 0.5,
      lineHeight: "2",
    }, 
  });

