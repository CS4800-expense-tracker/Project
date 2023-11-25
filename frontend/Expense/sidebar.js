import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Link } from "@react-navigation/native";

export default function Sidebar(props) {
  const page = props.page;

  const logoDb = require("./img/PennyWise_Logo_Db.png");
  const overviewIcon = require("./img/grid.svg");
  const expensesIcon = require("./img/receipt.svg");
  const accountIcon = require("./img/person-circle.svg");
  const logOutIcon = require("./img/log-out.svg");

  const overviewSectionBgColor = useSharedValue(
    page === "overview" ? "#384718" : "#131808"
  );
  const expensesSectionBgColor = useSharedValue(
    page === "expenses" ? "#384718" : "#131808"
  );
  const accountSectionBgColor = useSharedValue(
    page === "account" ? "#384718" : "#131808"
  );
  const logOutColor = useSharedValue("#84A739");

  const overviewSectionHoverIn = () => {
    overviewSectionBgColor.value = withTiming(
      page === "overview" ? "#4b5f20" : "#263010"
    );
  };
  const overviewSectionHoverOut = () => {
    overviewSectionBgColor.value = withTiming(
      page === "overview" ? "#384718" : "#131808"
    );
  };

  const expensesSectionHoverIn = () => {
    expensesSectionBgColor.value = withTiming(
      page === "expenses" ? "#4b5f20" : "#263010"
    );
  };
  const expensesSectionHoverOut = () => {
    expensesSectionBgColor.value = withTiming(
      page === "expenses" ? "#384718" : "#131808"
    );
  };

  const accountSectionHoverIn = () => {
    accountSectionBgColor.value = withTiming(
      page === "account" ? "#4b5f20" : "#263010"
    );
  };

  const accountSectionHoverOut = () => {
    accountSectionBgColor.value = withTiming(
      page === "account" ? "#384718" : "#131808"
    );
  };

  const logOutHoverIn = () => {
    logOutColor.value = withTiming("#bcee51");
  };

  const logOutHoverOut = () => {
    logOutColor.value = withTiming("#84A739");
  };

  return (
    <View style={styles.tabs}>
      <Image source={logoDb} style={styles.tabLogo} />
      <Link to={{ screen: "Overview" }}>
        <Pressable
          onHoverIn={overviewSectionHoverIn}
          onHoverOut={overviewSectionHoverOut}
          style={styles.sectionButton}
        >
          <Animated.View
            style={[
              page === "overview"
                ? styles.currentSectionButtonView
                : styles.sectionButtonView,
              { backgroundColor: overviewSectionBgColor },
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
          onHoverIn={expensesSectionHoverIn}
          onHoverOut={expensesSectionHoverOut}
          style={styles.sectionButton}
        >
          <Animated.View
            style={[
              page === "expenses"
                ? styles.currentSectionButtonView
                : styles.sectionButtonView,
              { backgroundColor: expensesSectionBgColor },
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
          onHoverIn={accountSectionHoverIn}
          onHoverOut={accountSectionHoverOut}
          style={styles.sectionButton}
        >
          <Animated.View
            style={[
              page === "account"
                ? styles.currentSectionButtonView
                : styles.sectionButtonView,
              { backgroundColor: accountSectionBgColor },
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
          onHoverIn={logOutHoverIn}
          onHoverOut={logOutHoverOut}
          style={styles.logOutButton}
        >
          <View>
            <Animated.Text
              style={[
                styles.text,
                styles.logOutText,
                { color: logOutColor, borderColor: logOutColor },
              ]}
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
    borderColor: "#84A739",
    // textDecorationLine: "underline",
    // textDecorationStyle: "solid",
    // textDecorationColor: "#84A739",
  },
  logOutButton: {
    marginTop: 12,
  },
});
