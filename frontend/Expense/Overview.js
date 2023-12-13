import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import PieChart from "react-native-pie-chart";
import Sidebar from "./sidebar";
import SectionView from "./section-view";
import BodyText from "./body-text";
import RecentExpense from "./recent-expense";
import Heading1 from "./heading1";
import Heading2 from "./heading2";
import {
  getBodyTextSize,
  getH1MobileSize,
  getH2MobileSize,
  getH2SmallMobileSize,
  getH2XSmallMobileSize,
} from "./font-sizes";
import { useContext, useEffect, useState } from "react";
import * as Progress from "react-native-progress";
import { AppContext } from "./AppContext";

export default function Overview({ navigation }) {
  const squareIcon = require("./img/square.svg");
  // TODO: populate this shit
  // Check for user id and link bank
  // If no link, then have notification over the thingy
  // If no user id, send to sign up or log in

  const user_id = localStorage.getItem("userID");
  if (!user_id) {
    navigation.navigate("Signup");
  }

  useEffect(() => {}, []);

  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDate = new Date();
  const month = monthNames[currentDate.getMonth()];
  const monthNum = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch(`https://api.pennywise.money/overview/${user_id}/${monthNum}/${year}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        console.log("This is from fetch", data);
      })
      .catch((err) => console.error(err));
  }, []);

  const name = "John";
  const monthlyBudget = 1000;
  const spent = Math.trunc(780);
  const available = monthlyBudget - spent;
  const recentExpensesValues = [-120.5, 78.69, 14.57, 279.13, 120.5];
  const recentExpensesDates = [
    "11/16/23",
    "11/16/23",
    "11/14/23",
    "11/13/23",
    "11/10/23",
  ];
  const recentExpensesNames = [
    "Amazon",
    "O'Reilly Auto Parts",
    "In-N-Out Burger",
    "Edison",
    "Amazon",
  ];
  const expenseCategories = [
    {
      expenseName: "Groceries",
      spent: 160,
      total: 400,
    },
    {
      expenseName: "Utilities",
      spent: 240,
      total: 300,
    },
    {
      expenseName: "Electronics",
      spent: 15,
      total: 100,
    },
    {
      expenseName: "Cars",
      spent: 130,
      total: 200,
    },
  ];

  const pieChartSeries = getChartSeries();
  const sliceColors = getSliceColors();

  function getChartSeries() {
    if (userData && userData.category_analysis) {
      if (userData.total_budget - userData.total_spent >= 0)
        return [
          userData.total_spent,
          userData.total_budget - userData.total_spent,
        ];
      else
        return [
          userData.total_budget,
          Math.abs(userData.total_budget - userData.total_spent),
        ];
    }
  }

  function getSliceColors() {
    if (userData.total_budget - userData.total_spent >= 0)
      return ["#BCEE51", "#558033"];
    else return ["#BCEE51", "#803333"];
  }

  function getBudgetTextStyle() {
    return userData.total_budget - userData.total_spent >= 0
      ? styles.underBudgetText
      : styles.overBudgetText;
  }

  function formatDate(date) {
    const dateSlices = date.split(" ");
    const month =
      monthNames.findIndex((element) => element.includes(dateSlices[2])) + 1;
    const day = dateSlices[1];
    const year = dateSlices[3].slice(2);
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  }

  if (userData && userData.total_budget) {
    console.log(userData);
    return (
      <View style={styles.container}>
        <Sidebar page="overview" />
        <SectionView>
          <Heading1 style={[styles.textColor, styles.h1, { marginBottom: 48 }]}>
            Welcome, {userData.user_name.split(" ")[0]}
          </Heading1>
          <Heading2 style={[styles.textColor, styles.h2]}>
            {month} Overview
          </Heading2>
          <View style={[styles.subsectionContainer]}>
            <Heading2 style={[styles.textColor, styles.h2Small]}>
              Budget
            </Heading2>
            <View style={[styles.budgetView]}>
              <View style={[styles.flex, { alignItems: "center" }]}>
                <BodyText
                  style={[getBudgetTextStyle(), styles.availableValueText]}
                >
                  ${userData.total_budget}
                </BodyText>
                <View style={[styles.rowFlex]}>
                  <BodyText style={[getBudgetTextStyle()]}>budget </BodyText>
                  <BodyText style={[getBudgetTextStyle()]}>
                    {userData.total_budget - userData.total_spent >= 0
                      ? "this month"
                      : "exceeded"}
                  </BodyText>
                </View>
              </View>
              <View style={styles.chart}>
                <PieChart
                  widthAndHeight={width >= 425 ? 128 : 96}
                  series={pieChartSeries}
                  sliceColor={sliceColors}
                  style={styles.pieChart}
                />
                <View style={{ marginRight: 16 }}>
                  <View style={styles.chart}>
                    <Image
                      source={squareIcon}
                      style={[
                        styles.square,
                        {
                          tintColor:
                            userData.total_budget - userData.total_spent >= 0
                              ? "#558033"
                              : "#803333",
                        },
                      ]}
                    />
                    <BodyText style={[styles.textColor]}>
                      {userData.total_budget - userData.total_spent >= 0
                        ? "Available"
                        : "Deficit"}
                    </BodyText>
                  </View>
                  <View style={styles.chart}>
                    <Image
                      source={squareIcon}
                      style={[styles.square, { tintColor: "#BCEE51" }]}
                    />
                    <BodyText style={[styles.textColor]}>
                      {userData.total_budget - userData.total_spent >= 0
                        ? "Spent"
                        : "Budget"}
                    </BodyText>
                  </View>
                </View>
                <View>
                  <BodyText style={[styles.textColor, styles.chartTextValue]}>
                    $
                    {Math.abs(
                      userData.total_budget - userData.total_spent
                    ).toFixed(2)}
                  </BodyText>
                  <BodyText style={[styles.textColor, styles.chartTextValue]}>
                    $
                    {userData.total_budget - userData.total_spent >= 0
                      ? userData.total_spent.toFixed(2)
                      : userData.total_budget.toFixed(2)}
                  </BodyText>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.subsectionContainer}>
            <Heading2 style={[styles.textColor, styles.h2Small]}>
              Expense Categories
            </Heading2>
            {userData.category_analysis.map((element) => {
              return (
                <View>
                  <Heading2 style={[styles.textColor, styles.h2XSmall]}>
                    {element.category_name}
                  </Heading2>
                  <Progress.Bar
                    progress={
                      element.total_spent_for_category / element.category_budget
                    }
                    color={
                      element.total_spent_for_category /
                        element.category_budget >
                      1
                        ? "#803333"
                        : "#558033"
                    }
                    width={null}
                    height={24}
                    borderRadius={32}
                    unfilledColor="#ccd9c2"
                    style={{ marginBottom: 8 }}
                  />
                  <BodyText style={[styles.textColor, { marginBottom: 32 }]}>
                    ${element.total_spent_for_category} spent out of $
                    {element.category_budget} total budget
                  </BodyText>
                </View>
              );
            })}
          </View>
          <View style={[styles.subsectionContainer, { marginBottom: 0 }]}>
            <Heading2 style={[styles.textColor, styles.h2Small]}>
              Recent Expenses
            </Heading2>
            <View style={styles.flex}>
              {userData.last_five_expenses.length === 0 ? (
                <BodyText style={{ alignSelf: "center", textAlign: "center" }}>
                  No expenses found.{`\n`}
                  Head to the Expenses page to get started!
                </BodyText>
              ) : (
                userData.last_five_expenses.map((element) => {
                  return (
                    <RecentExpense
                      value={element.total_spent_for_expense}
                      name={element.store_name}
                      date={formatDate(element.timestamp)}
                    />
                  );
                })
              )}
            </View>
          </View>
        </SectionView>
      </View>
    );
  } else {
    return <></>;
  }
}

const makeStyles = (width) =>
  StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: width >= 1200 ? "row" : "column",
      alignContent: width >= 1200 ? "space-between" : "",
      height: "100%",
    },
    textColor: {
      color: "#333",
    },
    h1: {
      textAlign: width >= 750 ? "left" : "center",
    },
    h2: {
      textAlign: width >= 750 ? "left" : "center",
      marginBottom: 64,
    },
    h2Small: {
      fontSize: getH2SmallMobileSize(width),
      marginBottom: 32,
    },
    h2XSmall: {
      fontSize: getH2XSmallMobileSize(width),
      marginBottom: 8,
    },
    budgetView: {
      display: "flex",
      flexDirection: width >= 750 ? "row" : "column",
      justifyContent: width >= 750 ? "space-between" : "center",
      alignItems: "center",
      gap: width >= 750 ? 0 : 32,
    },
    subsectionContainer: {
      width: "100%",
      backgroundColor: "#ddd",
      borderRadius: 32,
      padding: 32,
      marginBottom: 64,
    },
    flex: {
      display: "flex",
    },
    rowFlex: {
      display: "flex",
      flexDirection: "row",
    },
    underBudgetText: {
      color: "#558033",
    },
    overBudgetText: {
      color: "#803333",
    },
    availableValueText: {
      fontSize: getH1MobileSize(width),
      lineHeight: "1",
    },
    chart: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    pieChart: {
      marginRight: 16,
    },
    square: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    chartTextValue: {
      fontFamily: "Rubik_600SemiBold",
    },
  });
