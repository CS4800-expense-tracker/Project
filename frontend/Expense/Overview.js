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

  const { state: appContext, dispatch: appDispatch } = useContext(AppContext);

  const user_id = appContext.userID;
  if (!user_id) {
    navigation.navigate("Signup");
  }

  useEffect(() => {}, []);

  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);

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
  const month = monthNames[new Date().getMonth()];

  function getChartSeries() {
    if (available >= 0) return [spent, available];
    else return [monthlyBudget, Math.abs(available)];
  }

  function getSliceColors() {
    if (available >= 0) return ["#BCEE51", "#558033"];
    else return ["#BCEE51", "#803333"];
  }

  function getBudgetTextStyle() {
    return available >= 0 ? styles.underBudgetText : styles.overBudgetText;
  }

  return (
    <View style={styles.container}>
      <Sidebar page="overview" />
      <SectionView>
        <Heading1 style={[styles.textColor, styles.h1, { marginBottom: 48 }]}>
          Welcome, {name}
        </Heading1>
        <Heading2 style={[styles.textColor, styles.h2]}>
          {month} Overview
        </Heading2>
        <View style={[styles.subsectionContainer]}>
          <Heading2 style={[styles.textColor, styles.h2Small]}>Budget</Heading2>
          <View style={[styles.budgetView]}>
            <View style={[styles.flex, { alignItems: "center" }]}>
              <BodyText
                style={[getBudgetTextStyle(), styles.availableValueText]}
              >
                ${monthlyBudget}
              </BodyText>
              <View style={[styles.rowFlex]}>
                <BodyText style={[getBudgetTextStyle()]}>budget </BodyText>
                <BodyText style={[getBudgetTextStyle()]}>
                  {available >= 0 ? "this month" : "exceeded"}
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
                      { tintColor: available >= 0 ? "#558033" : "#803333" },
                    ]}
                  />
                  <BodyText style={[styles.textColor]}>
                    {available >= 0 ? "Available" : "Deficit"}
                  </BodyText>
                </View>
                <View style={styles.chart}>
                  <Image
                    source={squareIcon}
                    style={[styles.square, { tintColor: "#BCEE51" }]}
                  />
                  <BodyText style={[styles.textColor]}>
                    {available >= 0 ? "Spent" : "Budget"}
                  </BodyText>
                </View>
              </View>
              <View>
                <BodyText style={[styles.textColor, styles.chartTextValue]}>
                  ${Math.abs(available)}
                </BodyText>
                <BodyText style={[styles.textColor, styles.chartTextValue]}>
                  ${available >= 0 ? spent : monthlyBudget}
                </BodyText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.subsectionContainer}>
          <Heading2 style={[styles.textColor, styles.h2Small]}>
            Expense Categories
          </Heading2>
          {expenseCategories.map((element) => (
            <View>
              <Heading2 style={[styles.textColor, styles.h2XSmall]}>
                {element.expenseName}
              </Heading2>
              <Progress.Bar
                progress={element.spent / element.total}
                color={"#558033"}
                width={null}
                height={24}
                borderRadius={32}
                unfilledColor="#ccd9c2"
                style={{ marginBottom: 8 }}
              />
              <BodyText style={[styles.textColor, { marginBottom: 32 }]}>
                ${element.spent} spent out of ${element.total} total budget
              </BodyText>
            </View>
          ))}
        </View>
        <View style={[styles.subsectionContainer, { marginBottom: 0 }]}>
          <Heading2 style={[styles.textColor, styles.h2Small]}>
            Recent Expenses
          </Heading2>
          <View style={styles.flex}>
            <RecentExpense
              value={recentExpensesValues[0]}
              name={recentExpensesNames[0]}
              date={recentExpensesDates[0]}
            />
            <RecentExpense
              value={recentExpensesValues[1]}
              name={recentExpensesNames[1]}
              date={recentExpensesDates[1]}
            />
            <RecentExpense
              value={recentExpensesValues[2]}
              name={recentExpensesNames[2]}
              date={recentExpensesDates[2]}
            />
            <RecentExpense
              value={recentExpensesValues[3]}
              name={recentExpensesNames[3]}
              date={recentExpensesDates[3]}
            />
            <RecentExpense
              value={recentExpensesValues[4]}
              name={recentExpensesNames[4]}
              date={recentExpensesDates[4]}
            />
          </View>
        </View>
      </SectionView>
    </View>
  );
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
