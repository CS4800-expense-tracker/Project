import { StatusBar } from "expo-status-bar";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const heroImage = require("./img/hero_image.png");
const tempImage = require("./img/placeholder.png");
const logoLb = require("./img/logo_lb.png");
const logoDb = require("./img/logo_db.png");

export default function App() {
  const hdBtnBgColor = useSharedValue("#384718");
  const hdBtnTextColor = useSharedValue("#fff");
  const heroBtnBgColor = useSharedValue("#558033");
  const featureBtnBgColor = useSharedValue("#BCEE51");
  const featureBtnTextColor = useSharedValue("#384718");
  const ftBtnBgColor = useSharedValue("#F2FCDC");

  const hdBtnHoverIn = () => {
    hdBtnBgColor.value = withTiming("#BCEE51");
    hdBtnTextColor.value = withTiming("#384718");
  };

  const hdBtnHoverOut = () => {
    hdBtnBgColor.value = withTiming("#384718");
    hdBtnTextColor.value = withTiming("#fff");
  };

  const heroButtonHoverIn = () => {
    heroBtnBgColor.value = withTiming("#384718");
  };

  const heroButtonHoverOut = () => {
    heroBtnBgColor.value = withTiming("#558033");
  };

  const featureBtnHoverIn = () => {
    featureBtnBgColor.value = withTiming("#558033");
    featureBtnTextColor.value = withTiming("#fff");
  };

  const featureBtnHoverOut = () => {
    featureBtnBgColor.value = withTiming("#BCEE51");
    featureBtnTextColor.value = withTiming("#384718");
  };

  const ftBtnHoverIn = () => {
    ftBtnBgColor.value = withTiming("#BCEE51");
  };

  const ftBtnHoverOut = () => {
    ftBtnBgColor.value = withTiming("#F2FCDC");
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.sectionWidth, styles.rowSpaceBetween, styles.header]}
      >
        <Image source={logoLb} style={{ width: 250, height: 49 }} />
        <Pressable onHoverIn={hdBtnHoverIn} onHoverOut={hdBtnHoverOut}>
          <Animated.View
            style={[styles.headerButton, { backgroundColor: hdBtnBgColor }]}
          >
            <Animated.Text style={[styles.text, { color: hdBtnTextColor }]}>
              Log in
            </Animated.Text>
          </Animated.View>
        </Pressable>
      </View>
      <View style={[styles.sectionWidth, styles.hero, styles.sectionMargin]}>
        <View style={styles.rowSpaceBetween}>
          <View style={styles.heroLeft}>
            <Text style={[styles.text, styles.h1, { color: "#384718" }]}>
              Take control of your finances
            </Text>
            <Text style={[styles.text, { marginBottom: 16, color: "#384718" }]}>
              PennyWise is on a mission to make expense tracking simple and
              intelligent.
            </Text>
            <View style={styles.rowFlex}>
              <Pressable
                onHoverIn={heroButtonHoverIn}
                onHoverOut={heroButtonHoverOut}
              >
                <Animated.View
                  style={[
                    styles.heroButton,
                    { backgroundColor: heroBtnBgColor },
                  ]}
                >
                  <Text style={[styles.text, { color: "#F2FCDC" }]}>
                    Get started
                  </Text>
                </Animated.View>
              </Pressable>
            </View>
          </View>
          <Image source={heroImage} style={[styles.heroImage]} />
        </View>
      </View>
      <View style={[styles.flexJustify, styles.sectionMargin]}>
        <Text style={[styles.text, styles.h2]}>
          It's <Text style={styles.underline}>simple</Text>
        </Text>
        <Text style={[styles.text, styles.featureText, { marginBottom: 32 }]}>
          Our elegant, intuitive interface makes tracking all your expenses a
          breeze.
        </Text>
        <View style={styles.shadow}>
          <Image source={tempImage} style={styles.featureImages} />
        </View>
      </View>
      <View style={[styles.flexJustify, styles.sectionMargin]}>
        <Text style={[styles.text, styles.h2]}>
          It's <Text style={styles.underline}>intelligent</Text>
        </Text>
        <Text style={[styles.text, styles.featureText, { marginBottom: 32 }]}>
          Get real-time insights into your spending habits, helping you identify
          trends, and make informed decisions about your financial future.
        </Text>
        <View style={styles.shadow}>
          <Image source={tempImage} style={styles.featureImages} />
        </View>
      </View>
      <View style={[styles.flexJustify, styles.sectionMargin]}>
        <Text style={[styles.text, styles.h2]}>
          It's <Text style={styles.underline}>free</Text>
        </Text>
        <Text style={[styles.text, styles.featureText, { marginBottom: 32 }]}>
          All of these great features at no cost to you.
        </Text>
        <View style={styles.shadow}>
          <Image source={tempImage} style={[styles.featureImages]} />
        </View>
      </View>
      <View style={styles.marginBottom}>
        <Text style={[styles.h1, { marginBottom: 32, color: "#384718" }]}>
          Seize the reins of your financial life
        </Text>
        <Pressable
          style={[styles.featureButton, styles.sectionMargin]}
          onHoverIn={featureBtnHoverIn}
          onHoverOut={featureBtnHoverOut}
        >
          <Animated.View
            style={[
              styles.featureButtonView,
              { backgroundColor: featureBtnBgColor },
            ]}
          >
            <Animated.Text
              style={[
                styles.text,
                styles.featureText,
                { color: featureBtnTextColor },
              ]}
            >
              Create your free account
            </Animated.Text>
          </Animated.View>
        </Pressable>
      </View>
      <View style={styles.footerContainer}>
        <View
          style={[styles.sectionWidth, styles.rowSpaceBetween, styles.footer]}
        >
          <Image source={logoDb} style={{ width: 250, height: 49 }} />
          <Pressable onHoverIn={ftBtnHoverIn} onHoverOut={ftBtnHoverOut}>
            <Animated.View
              style={[styles.headerButton, { backgroundColor: ftBtnBgColor }]}
            >
              <Text style={styles.text}>Log in</Text>
            </Animated.View>
          </Pressable>
        </View>
        <View style={styles.footerCopyright}>
          <Text style={[styles.text, styles.footerText]}>
            Copyright © 2023. All rights reserved.
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F2FCDC",
  },
  text: {
    fontFamily: "Degular, sans-serif",
    fontWeight: "500",
    fontSize: 18,
    lineHeight: "2",
    letterSpacing: 0.5,
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
    width: 420,
    height: 240,
  },
  h1: {
    fontSize: 56,
    fontWeight: "700",
    letterSpacing: -2,
    lineHeight: "1.13",
    marginBottom: 16,
  },
  h2: {
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -2,
    lineHeight: "1.13",
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
