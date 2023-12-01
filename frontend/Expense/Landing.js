import { useState, useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "@react-navigation/native";
import AnimatedButton from "./animated-button";
import Heading1 from "./heading1";
import BodyText from "./body-text";

export default function Landing() {
  const heroImage = require("./img/hero_image.png");
  const tempImage = require("./img/placeholder.png");
  const logoLb = require("./img/PennyWise_Logo_Lb.png");
  const logoDb = require("./img/PennyWise_Logo_Db.png");


  const handleLogIn = () => {
    fetch('http://127.0.0.1:5000/login')  
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
    return 
  }

  return (
    <View style={styles.container}>
      <View
        style={[styles.sectionWidth, styles.rowSpaceBetween, styles.header]}
      >
        <Image source={logoLb} style={styles.logo} />
        <AnimatedButton
          bgColor={"#384718"}
          hoverBgColor={"#BCEE51"}
          textColor={"#fff"}
          hoverTextColor={"#384718"}
          text={"Log in"}
          viewStyle={styles.headerButton}
          onPress={handleLogIn}
        />
      </View>
      <View style={[styles.sectionWidth, styles.hero, styles.sectionMargin]}>
        <View style={styles.rowSpaceBetween}>
          <View style={styles.heroLeft}>
            <Heading1 style={[styles.h1, { color: "#384718" }]}>
              Take control of your finances
            </Heading1>
            <BodyText style={[styles.text, { marginBottom: 16 }]}>
              PennyWise is on a mission to make expense tracking simple and
              intelligent.
            </BodyText>
            <View style={styles.rowFlex}>
              <Link to={{ screen: "Overview" }}>
                <AnimatedButton
                  bgColor={"#558033"}
                  hoverBgColor={"#384718"}
                  textColor={"#F2FCDC"}
                  text={"Get started"}
                  viewStyle={styles.heroButton}
                />
              </Link>
            </View>
          </View>
          <Image source={heroImage} style={[styles.heroImage]} />
        </View>
      </View>
      <View style={[styles.flexJustify, styles.sectionMargin]}>
        <Heading1 style={[styles.text, styles.h1Small]}>
          It's{" "}
          <Heading1 style={[styles.text, styles.h1Small, styles.underline]}>
            simple
          </Heading1>
        </Heading1>
        <BodyText
          style={[styles.text, styles.featureText, { marginBottom: 32 }]}
        >
          Our elegant, intuitive interface makes tracking all your expenses a
          breeze.
        </BodyText>
        <View style={styles.shadow}>
          <Image source={tempImage} style={styles.featureImages} />
        </View>
      </View>
      <View style={[styles.flexJustify, styles.sectionMargin]}>
        <Heading1 style={[styles.text, styles.h1Small]}>
          It's{" "}
          <Heading1 style={[styles.text, styles.h1Small, styles.underline]}>
            intelligent
          </Heading1>
        </Heading1>
        <BodyText
          style={[styles.text, styles.featureText, { marginBottom: 32 }]}
        >
          Get real-time insights into your spending habits, helping you identify
          trends, and make informed decisions about your financial future.
        </BodyText>
        <View style={styles.shadow}>
          <Image source={tempImage} style={styles.featureImages} />
        </View>
      </View>
      <View style={[styles.flexJustify, styles.sectionMargin]}>
        <Heading1 style={[styles.text, styles.h1Small]}>
          It's{" "}
          <Heading1 style={[styles.text, styles.h1Small, styles.underline]}>
            free
          </Heading1>
        </Heading1>
        <BodyText
          style={[styles.text, styles.featureText, { marginBottom: 32 }]}
        >
          All of these great features at no cost to you.
        </BodyText>
        <View style={styles.shadow}>
          <Image source={tempImage} style={[styles.featureImages]} />
        </View>
      </View>
      <View style={[styles.marginBottom]}>
        <Heading1 style={[styles.h1, { marginBottom: 32, color: "#384718" }]}>
          Seize the reins of your financial life
        </Heading1>
        <Link
          to={{ screen: "Overview" }}
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
          />
        </Link>
      </View>
      <View style={styles.footerContainer}>
        <View
          style={[styles.sectionWidth, styles.rowSpaceBetween, styles.footer]}
        >
          <Image source={logoDb} style={styles.logo} />
          <Link to={{ screen: "Overview" }}>
            <AnimatedButton
              bgColor={"#F2FCDC"}
              hoverBgColor={"#BCEE51"}
              textColor={"#384718"}
              text={"Log in"}
              viewStyle={styles.headerButton}
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

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#F2FCDC",
  },
  text: {
    color: "#384718",
  },
  sectionWidth: {
    width: "85%",
  },
  hero: {
    backgroundColor: "#BCEE51",
    borderRadius: 32,
    paddingHorizontal: 64,
    paddingVertical: 128,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
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
    width: "50%",
  },
  sectionMargin: {
    marginBottom: 128,
  },
  logo: {
    height: "100%",
    width: undefined,
    aspectRatio: "37 / 7",
    resizeMode: "contain",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 60,
  },
  headerButton: {
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  heroImage: {
    height: "100%",
    width: undefined,
    aspectRatio: "7 / 4",
    resizeMode: "contain",
  },
  h1: {
    marginBottom: 16,
  },
  h1Small: {
    fontSize: 48,
    marginBottom: 20,
  },
  featureImages: {
    width: 800,
    height: 450,
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
    fontSize: 12,
    alignSelf: "center",
    paddingTop: 8,
    paddingBottom: 8,
  },
  footerCopyright: {
    width: "85%",
    alignSelf: "center",
    borderTopWidth: 1,
    borderTopColor: "#84A739",
  },
});
