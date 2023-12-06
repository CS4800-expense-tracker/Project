import { useState, useEffect } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Link } from "@react-navigation/native";
import AnimatedButton from "./animated-button";
import Heading1 from "./heading1";
import BodyText from "./body-text";
import { getH1MobileSize, getH1SmallMobileSize } from "./font-sizes";
import React from "react";

export default function Landing() {
  const heroImage = require("./img/hero_image.png");
  const tempImage = require("./img/placeholder.png");
  const logoLb = require("./img/PennyWise_Logo_Lb.png");
  const logoDb = require("./img/PennyWise_Logo_Db.png");
  const menu = require("./img/menu.svg");
  const close = require("./img/close.svg");

  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);
  const useSmallText = width >= 950 ? false : true;

  const [displayMenu, setDisplayMenu] = React.useState(false);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.menu,
          displayMenu && width < 600 ? "" : { display: "none" },
        ]}
      >
        <Link to={{ screen: "Overview" }}>
          <Pressable>
            <BodyText
              style={[styles.text, styles.mobileLogIn, { fontSize: 20 }]}
            >
              Log in
            </BodyText>
          </Pressable>
        </Link>
        <Link to={{ screen: "Setup" }}>
          <AnimatedButton
            bgColor={"#384718"}
            hoverBgColor={"#BCEE51"}
            textColor={"#fff"}
            hoverTextColor={"#384718"}
            text={"Sign up"}
            viewStyle={[styles.headerButton]}
            textStyle={[styles.text, { fontSize: 20 }]}
          />
        </Link>
      </View>
      <View
        style={[styles.sectionWidth, styles.rowSpaceBetween, styles.header]}
      >
        <Image source={logoLb} style={styles.logo} />
        <Link to={{ screen: "Login" }}>
          <AnimatedButton
            bgColor={"#384718"}
            hoverBgColor={"#BCEE51"}
            textColor={"#fff"}
            hoverTextColor={"#384718"}
            text={"Log in"}
            viewStyle={[
              styles.headerButton,
              width < 600 ? { display: "none" } : "",
            ]}
            textStyle={useSmallText ? styles.bodyTextMobile : ""}
          />
        </Link>
        <Pressable
          onPress={() => setDisplayMenu(!displayMenu)}
          style={width >= 600 ? { display: "none" } : ""}
        >
          <Image
            source={displayMenu ? close : menu}
            style={styles.menuButton}
          />
        </Pressable>
      </View>
      <View
        style={[
          styles.sectionWidth,
          styles.hero,
          styles.sectionMargin,
          displayMenu ? { display: "none" } : "",
        ]}
      >
        <View
          style={
            width >= 1300
              ? styles.rowSpaceBetween
              : [styles.flexJustify, { gap: 64 }]
          }
        >
          <View style={width >= 1300 ? styles.heroLeft : styles.heroTop}>
            <Heading1
              style={[
                styles.h1,
                useSmallText ? styles.h1Mobile : "",
                { color: "#384718" },
              ]}
            >
              Take control of your finances
            </Heading1>
            <BodyText
              style={[
                styles.text,
                useSmallText ? styles.bodyTextMobile : "",
                { marginBottom: 16 },
              ]}
            >
              PennyWise is on a mission to make expense tracking simple and
              intelligent.
            </BodyText>
            <View style={styles.rowFlex}>
              <Link to={{ screen: "Signup" }}>
                <AnimatedButton
                  bgColor={"#558033"}
                  hoverBgColor={"#384718"}
                  textColor={"#F2FCDC"}
                  hoverTextColor={"#F2FCDC"}
                  text={"Get started"}
                  viewStyle={styles.heroButton}
                  textStyle={
                    useSmallText ? styles.bodyTextMobile : { fontSize: 18 }
                  }
                />
              </Link>
            </View>
          </View>
          <Image
            source={heroImage}
            style={width >= 1300 ? styles.heroImage : styles.heroImageSmall}
          />
        </View>
      </View>
      <View
        style={[
          styles.flexJustify,
          styles.sectionMargin,
          styles.featureView,
          displayMenu ? { display: "none" } : "",
        ]}
      >
        <Heading1
          style={[
            styles.text,
            styles.h1Small,
            useSmallText ? styles.h1SmallMobile : "",
          ]}
        >
          It's{" "}
          <Heading1
            style={[
              styles.text,
              styles.h1Small,
              useSmallText ? styles.h1SmallMobile : "",
              styles.underline,
            ]}
          >
            simple
          </Heading1>
        </Heading1>
        <BodyText
          style={[
            styles.text,
            styles.featureText,
            useSmallText ? styles.bodyTextMobile : "",
            { marginBottom: 32 },
          ]}
        >
          Our elegant, intuitive interface makes tracking all your expenses a
          breeze.
        </BodyText>
        <View style={styles.shadow}>
          <Image source={tempImage} style={styles.featureImages} />
        </View>
      </View>
      <View
        style={[
          styles.flexJustify,
          styles.sectionMargin,
          styles.featureView,
          displayMenu ? { display: "none" } : "",
        ]}
      >
        <Heading1
          style={[
            styles.text,
            styles.h1Small,
            useSmallText ? styles.h1SmallMobile : "",
          ]}
        >
          It's{" "}
          <Heading1
            style={[
              styles.text,
              styles.h1Small,
              useSmallText ? styles.h1SmallMobile : "",
              styles.underline,
            ]}
          >
            intelligent
          </Heading1>
        </Heading1>
        <BodyText
          style={[
            styles.text,
            styles.featureText,
            useSmallText ? styles.bodyTextMobile : "",
            { marginBottom: 32 },
          ]}
        >
          Get real-time insights into your spending habits, helping you identify
          trends, and make informed decisions about your financial future.
        </BodyText>
        <View style={styles.shadow}>
          <Image source={tempImage} style={styles.featureImages} />
        </View>
      </View>
      <View
        style={[
          styles.flexJustify,
          styles.sectionMargin,
          styles.featureView,
          displayMenu ? { display: "none" } : "",
        ]}
      >
        <Heading1
          style={[
            styles.text,
            styles.h1Small,
            useSmallText ? styles.h1SmallMobile : "",
          ]}
        >
          It's{" "}
          <Heading1
            style={[
              styles.text,
              styles.h1Small,
              useSmallText ? styles.h1SmallMobile : "",
              styles.underline,
            ]}
          >
            free
          </Heading1>
        </Heading1>
        <BodyText
          style={[
            styles.text,
            styles.featureText,
            useSmallText ? styles.bodyTextMobile : "",
            { marginBottom: 32 },
          ]}
        >
          All of these great features at no cost to you.
        </BodyText>
        <View style={styles.shadow}>
          <Image source={tempImage} style={[styles.featureImages]} />
        </View>
      </View>
      <View
        style={[styles.marginBottom, displayMenu ? { display: "none" } : ""]}
      >
        <Heading1
          style={[
            styles.h1,
            styles.text,
            useSmallText ? [styles.h1Mobile, { paddingHorizontal: 16 }] : "",
            { marginBottom: 32, textAlign: "center" },
          ]}
        >
          Seize the reins of your financial life
        </Heading1>
        <Link
          to={{ screen: "Signup" }}
          style={[
            styles.sectionMargin,
            { display: "flex", justifyContent: "center" },
          ]}
        >
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"Create your free account"}
            buttonStyle={[styles.featureButton]}
            viewStyle={styles.featureButtonView}
            textStyle={useSmallText ? styles.bodyTextMobile : { fontSize: 18 }}
          />
        </Link>
      </View>
      <View
        style={[styles.footerContainer, displayMenu ? { display: "none" } : ""]}
      >
        <View
          style={[
            styles.sectionWidth,
            styles.rowSpaceBetween,
            styles.footer,
            width < 600 ? { justifyContent: "center" } : "",
          ]}
        >
          <Image source={logoDb} style={styles.logo} />
          <Link to={{ screen: "Login" }}>
            <AnimatedButton
              bgColor={"#F2FCDC"}
              hoverBgColor={"#BCEE51"}
              textColor={"#384718"}
              hoverTextColor={"#384718"}
              text={"Log in"}
              viewStyle={[
                styles.headerButton,
                width < 600 ? { display: "none" } : "",
              ]}
              textStyle={
                useSmallText ? styles.bodyTextMobile : { fontSize: 18 }
              }
            />
          </Link>
        </View>
        <View style={styles.footerCopyright}>
          <BodyText style={[styles.footerText]}>
            Copyright © 2023. All rights reserved.
          </BodyText>
        </View>
      </View>
    </View>
  );
}

const getSectionWidth = (windowWidth) => {
  if (windowWidth >= 2000) return "75%";
  else if (windowWidth >= 1600) return "80%";
  else if (windowWidth >= 1200) return "85%";
  return "90%";
};

const getHeroImageWidth = (windowWidth) => {
  if (windowWidth >= 900) return "60%";
  else if (windowWidth >= 750) return "80%";
  else return "100%";
};

const getFeatureImageWidth = (windowWidth) => {
  if (windowWidth >= 1200) return "65vw";
  else if (windowWidth >= 900) return "75vw";
  else return "80vw";
};

const makeStyles = (width) =>
  StyleSheet.create({
    container: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#F2FCDC",
    },
    text: {
      color: "#384718",
    },
    bodyTextMobile: {
      fontSize: width >= 600 ? 16 : 14,
      textAlign: "center",
    },
    h1Mobile: {
      fontSize: getH1MobileSize(width),
      textAlign: "center",
    },
    h1SmallMobile: {
      fontSize: getH1SmallMobileSize(width),
    },
    sectionWidth: {
      width: getSectionWidth(width),
    },
    hero: {
      backgroundColor: "#BCEE51",
      borderRadius: 32,
      paddingHorizontal: width >= 1300 ? 64 : 48,
      paddingVertical: width >= 1300 ? 128 : 64,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.15,
      shadowRadius: 32,
      maxWidth: 1300,
    },
    rowSpaceBetween: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowFlex: {
      display: "flex",
      flexDirection: "row",
    },
    flexJustify: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    featureView: {
      width: "65%",
    },
    sectionMargin: {
      marginBottom: 128,
    },
    logo: {
      height: width >= 600 ? "100%" : 36,
      width: undefined,
      aspectRatio: "37 / 7",
      resizeMode: "contain",
    },
    header: {
      paddingTop: 40,
      paddingBottom: 60,
      zIndex: 4,
    },
    headerButton: {
      borderRadius: 32,
      paddingHorizontal: width >= 600 ? 16 : 12,
      paddingVertical: width >= 600 ? 8 : 4,
    },
    menuButton: {
      width: 36,
      height: 36,
      tintColor: "#384718",
    },
    menu: {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#F2FCDC",
      zIndex: 3,
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      gap: 32,
    },
    mobileLogIn: {
      borderBottomWidth: 2,
      borderBottomColor: "#384718",
    },
    heroButton: {
      paddingHorizontal: 64,
      paddingVertical: 8,
      borderRadius: 32,
    },
    heroLeft: {
      flexBasis: "40%",
      display: "flex",
    },
    heroTop: {
      display: "flex",
      alignItems: "center",
    },
    heroImage: {
      height: "100%",
      width: undefined,
      aspectRatio: "7 / 4",
      resizeMode: "contain",
    },
    heroImageSmall: {
      width: getHeroImageWidth(width),
      height: undefined,
      aspectRatio: "7 / 4",
      resizeMode: "contain",
    },
    h1: {
      marginBottom: 16,
    },
    h1Small: {
      fontSize: 48,
      marginBottom: 20,
      textAlign: "center",
    },
    featureImages: {
      width: getFeatureImageWidth(width),
      maxWidth: 1100,
      height: undefined,
      aspectRatio: "16 / 9",
      resizeMode: "contain",
      borderRadius: 32,
    },
    featureText: {
      textAlign: "center",
    },
    underline: {
      // textDecorationLine: "underline",
      // textDecorationStyle: "solid",
      // textDecorationColor: "#BCEE51",
      paddingBottom: 2,
      borderBottomWidth: 4,
      borderBottomColor: "#BCEE51",
    },
    shadow: {
      backgroundColor: "#fff",
      borderRadius: 32,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.15,
      shadowRadius: 32,
    },
    featureButton: {
      width: "70%",
      alignSelf: "center",
    },
    featureButtonView: {
      borderRadius: 32,
      paddingVertical: 8,
    },
    footerContainer: {
      width: "100%",
      backgroundColor: "#131808",
    },
    footer: {
      paddingTop: 32,
      paddingBottom: 32,
      alignSelf: "center",
    },
    footerText: {
      color: "#84A739",
      fontSize: width >= 600 ? 12 : 10,
      alignSelf: "center",
      paddingTop: 8,
      paddingBottom: 8,
    },
    footerCopyright: {
      width: getSectionWidth(width),
      alignSelf: "center",
      borderTopWidth: 1,
      borderTopColor: "#84A739",
    },
  });
