import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Link } from "@react-navigation/native";

export default function Sidebar(props) {
  const page = props.page;

  const logoDb = require("./img/PennyWise_Logo_Db.png");
  const overviewIcon = require("./img/grid.svg");
  const expensesIcon = require("./img/receipt.svg");
  const accountIcon = require("./img/person-circle.svg");

  const overviewIsHovered = useSharedValue(false);
  const expensesIsHovered = useSharedValue(false);
  const accountIsHovered = useSharedValue(false);
  const logOutIsHovered = useSharedValue(false);

  const overviewHoverIn = () => {
    overviewIsHovered.value = true;
  };

  const overviewHoverOut = () => {
    overviewIsHovered.value = false;
  };

  const expensesHoverIn = () => {
    expensesIsHovered.value = true;
  };

  const expensesHoverOut = () => {
    expensesIsHovered.value = false;
  };

  const accountHoverIn = () => {
    accountIsHovered.value = true;
  };

  const accountHoverOut = () => {
    accountIsHovered.value = false;
  };

  const logOutHoverIn = () => {
    logOutIsHovered.value = true;
  };

  const logOutHoverOut = () => {
    logOutIsHovered.value = false;
  };

  const animatedOverviewStyle = useAnimatedStyle(() => {
    const bgColor = page === "overview" ? "#384718" : "#131808";
    const hoverBgColor = page === "overview" ? "#4b5f20" : "#263010";
    const backgroundColor = overviewIsHovered.value
      ? withTiming(hoverBgColor)
      : withTiming(bgColor);

    return { backgroundColor };
  });

  const animatedExpensesStyle = useAnimatedStyle(() => {
    const bgColor = page === "expenses" ? "#384718" : "#131808";
    const hoverBgColor = page === "expenses" ? "#4b5f20" : "#263010";
    const backgroundColor = expensesIsHovered.value
      ? withTiming(hoverBgColor)
      : withTiming(bgColor);

    return { backgroundColor };
  });

  const animatedAccountStyle = useAnimatedStyle(() => {
    const bgColor = page === "account" ? "#384718" : "#131808";
    const hoverBgColor = page === "account" ? "#4b5f20" : "#263010";
    const backgroundColor = accountIsHovered.value
      ? withTiming(hoverBgColor)
      : withTiming(bgColor);

    return { backgroundColor };
  });

  const animatedLogOutStyle = useAnimatedStyle(() => {
    const textColorValue = logOutIsHovered.value
      ? withTiming("#bcee51")
      : withTiming("#84A739");

    return {
      color: textColorValue,
      borderBottomColor: textColorValue,
    };
  });

  return (
    <View style={styles.tabs}>
      <Image source={logoDb} style={styles.tabLogo} />
      <Link to={{ screen: "Overview" }}>
        <Pressable
          onMouseEnter={overviewHoverIn}
          onMouseLeave={overviewHoverOut}
          style={[styles.sectionButton]}
        >
          <Animated.View
            style={[
              page === "overview"
                ? styles.currentSectionButtonView
                : styles.sectionButtonView,
              animatedOverviewStyle,
            ]}
          >
            <Image
              source={overviewIcon}
              style={
                page === "overview"
                  ? styles.currentSectionIcon
                  : styles.sectionIcon
              }
            />
            <Text
              style={[
                styles.text,
                page === "overview"
                  ? styles.currentSectionText
                  : styles.sectionText,
              ]}
            >
              Overview
            </Text>
          </Animated.View>
        </Pressable>
      </Link>
      <Link to={{ screen: "Expenses" }}>
        <Pressable
          onMouseEnter={expensesHoverIn}
          onMouseLeave={expensesHoverOut}
          style={[styles.sectionButton]}
        >
          <Animated.View
            style={[
              page === "expenses"
                ? styles.currentSectionButtonView
                : styles.sectionButtonView,
              animatedExpensesStyle,
            ]}
          >
            <Image
              source={expensesIcon}
              style={
                page === "expenses"
                  ? styles.currentSectionIcon
                  : styles.sectionIcon
              }
            />
            <Text
              style={[
                styles.text,
                page === "expenses"
                  ? styles.currentSectionText
                  : styles.sectionText,
              ]}
            >
              Expenses
            </Text>
          </Animated.View>
        </Pressable>
      </Link>
      <Link to={{ screen: "Account" }}>
        <Pressable
          onMouseEnter={accountHoverIn}
          onMouseLeave={accountHoverOut}
          style={[styles.sectionButton]}
        >
          <Animated.View
            style={[
              page === "account"
                ? styles.currentSectionButtonView
                : styles.sectionButtonView,
              animatedAccountStyle,
            ]}
          >
            <Image
              source={accountIcon}
              style={
                page === "account"
                  ? styles.currentSectionIcon
                  : styles.sectionIcon
              }
            />
            <Text
              style={[
                styles.text,
                page === "account"
                  ? styles.currentSectionText
                  : styles.sectionText,
              ]}
            >
              Account
            </Text>
          </Animated.View>
        </Pressable>
      </Link>
      <Link to={{ screen: "Landing" }} style={styles.logOutLink}>
        <Pressable
          onMouseEnter={logOutHoverIn}
          onMouseLeave={logOutHoverOut}
          style={styles.logOutButton}
        >
          <View>
            <Animated.Text
              style={[styles.text, styles.logOutText, animatedLogOutStyle]}
            >
              Log out
            </Animated.Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Rubik_400Regular",
    fontSize: 18,
    lineHeight: "2",
    letterSpacing: 0.5,
    color: "#333",
  },
  tabs: {
    width: "20%",
    backgroundColor: "#131808",
    paddingTop: 16,
  },
  tabLogo: {
    width: 249,
    height: 47,
    alignSelf: "center",
    marginBottom: 32,
  },
  sectionButton: {
    display: "block",
  },
  sectionButtonView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 20,
  },
  logOutButtonView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  currentSectionButtonView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderColor: "#BCEE51",
    paddingVertical: 12,
    paddingLeft: 16,
  },
  sectionText: {
    color: "#84A739",
  },
  sectionIcon: {
    tintColor: "#84A739",
    width: 16,
    height: 16,
    marginRight: 12,
  },
  currentSectionText: {
    color: "#BCEE51",
  },
  currentSectionIcon: {
    tintColor: "#BCEE51",
    width: 16,
    height: 16,
    marginRight: 12,
  },
  logOutLink: {
    display: "flex",
    alignSelf: "center",
  },
  logOutText: {
    borderBottomWidth: 1,
    // borderColor: "#84A739",
    // textDecorationLine: "underline",
    // textDecorationStyle: "solid",
    // textDecorationColor: "#84A739",
  },
  logOutButton: {
    marginTop: 12,
  },
});
