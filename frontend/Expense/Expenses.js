import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Button,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { getBodyTextSize } from "./font-sizes";
import Sidebar from "./sidebar";
import SectionView from "./section-view";
import Heading1 from "./heading1";
import Heading2 from "./heading2";
import RecentExpense from "./recent-expense";
import { SelectList } from "react-native-dropdown-select-list";
import AnimatedButton from "./animated-button";
import BodyText from "./body-text";

const handlePreviousPage = () => {};

const handleNextPage = () => {};

export default function Expenses() {
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);

  const name = "John";
  const monthlyBudget = 1000;
  const spent = Math.trunc(780);
  const available = monthlyBudget - spent;
  const [currPage, setCurrPage] = useState(1);
  const userID = localStorage.getItem("userID");
  const [data, setData] = useState();
  const [userCateogryList, setUserCategoryList] = useState(null);

  useEffect(() => {
    // const url = `http://127.0.0.1:5000/expenses/${userID}/${currPage}`;
    const url = `https://api.pennywise.money/expenses/${userID}/${currPage}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [currPage]);

  useEffect(() => {
    fetch(`https://api.pennywise.money/categories/${userID}`)
      // fetch(`http://127.0.0.1:5000/categories/${userID}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const catNames = data.map((item) => `${item.name} (${item.percent}%)`);
        setUserCategoryList(catNames);
      });
  }, []);

  const Expense = (props) => {
    const { store_name, timestamp, total_spent, sub_expenses } = props.data;
    const index = props.index;

    const [selectedCategory, setSelectedCategory] = useState("");
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleBoxPress = (index) => {
      setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const handleSaveSubExpense = (expenseIndex) => {
      // Insert logic to save sub-expense data to your state or backend
      console.log("Sub-expense saved for expense at index:", expenseIndex);
    };

    const handleSubExpenseChange = (subIndex, text) => {
      // sub expense?
      let updatedExpenses = [...expensesData];
      updatedExpenses[expenseIndex].subExpenses[subIndex].subExpense = text;
      setExpensesData(updatedExpenses);
    };

    function handleDeleteCategory() {
      setFormData({
        ...formData,
        categories: formData.categories.slice(0, -1),
      });
    }

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

    const addSubExpenseCode = () => {
      <View style={styles.rowContainer}>
        <View style={styles.rowColumn}>
          <View style={styles.subExpenseColumn}>
            <View key={subIndex} style={styles.subExpenseBox}>
              <TextInput
                style={styles.input}
                placeholder="Enter Sub Expense"
                // onChangeText={(text) =>
                //   handleSubExpenseChange(
                //     index,
                //     subIndex,
                //     text
                //   )
                // }
              />
              <Button
                title="Save Sub Expenses"
                // onPress={() => handleSaveSubExpense(index)}
                color="#558033"
                style={{
                  backgroundColor: "#558033",
                  borderRadius: 8,
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.rowColumn}>
          <View style={styles.categoryColumn}>
            <BodyText style={styles.catLabel}>Category:</BodyText>
            <SelectList
              style={styles.categoryBox}
              setSelected={
                (val) => console.log(val)
                // setSelectedCategory(val)
              }
              data={userCateogryList}
              selected={selectedCategory}
              onSelect={
                (value) => console.log(value)
                // setSelectedCategory(value)
              }
              search={false}
              save="key"
              title="Select Category"
              placeholder="Pick a Category"
              input={<TextInput />}
            />
            {/* {selectedCategory && (
                        <Text>
                          Selected Category: {selectedCategory}
                        </Text>
                      )} */}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonGap} /> {/* Add a gap between buttons */}
          <AnimatedButton
            bgColor={"#803333"}
            hoverBgColor={"#401A1A"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"🗑️"}
            viewStyle={[styles.addDeleteCategoryButton, styles.button]}
            // onPress={handleDeleteCategory}
          />
        </View>
      </View>;
    };

    // sub_expenses.map((item, key) => {
    //   const {category_name, spent} = item;
    //   console.log(category_name, spent)
    // })

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

    function formatDate(date) {
      const dateSlices = date.split(" ");
      const month =
        monthNames.findIndex((element) => element.includes(dateSlices[2])) + 1;
      const day = dateSlices[1];
      const year = dateSlices[3].slice(2);
      const formattedDate = `${month}/${day}/${year}`;
      return formattedDate;
    }

    const date = formatDate(timestamp);

    return (
      <View style={styles.expenseContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.expenseHeader,
            {
              backgroundColor: expandedIndex === index ? "#BCEE51" : "#fff",
            },
          ]}
          onPress={() => handleBoxPress(index)}
        >
          <RecentExpense value={total_spent} name={store_name} date={date} />
        </Pressable>
        {expandedIndex === index && (
          <View style={styles.dropdownContent}>
            <View style={styles.column}>
              <Text style={styles.subExpensesLabel}>Sub Expenses:</Text>
              {sub_expenses.map((subExpense, subIndex) => {
                const { category_name, spent } = subExpense;
                const today = String(new Date());
                const date = formatDate(today);

                return (
                  <View style={styles.rowContainer}>
                    <View style={styles.rowColumn}>
                      <View style={styles.subExpenseColumn}>
                        <View key={subIndex} style={styles.subExpenseBox}>
                          <View style={styles.spaceBetween}>
                            <BodyText
                              style={[
                                styles.fontSize,
                                { color: spent > 0 ? "#803333" : "#558033" },
                              ]}
                            >
                              {spent > 0 ? "-" : "+"}$
                              {Math.abs(spent).toFixed(2)}
                            </BodyText>
                            <BodyText
                              style={[styles.fontSize, { textAlign: "center" }]}
                            >
                              Sub Expense Name
                            </BodyText>
                            <BodyText
                              style={[styles.fontSize, { textAlign: "center" }]}
                            >
                              {category_name}
                            </BodyText>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
              <AnimatedButton
                bgColor={"#BCEE51"}
                hoverBgColor={"#558033"}
                textColor={"#384718"}
                hoverTextColor={"#fff"}
                text={"+"}
                viewStyle={[styles.addDeleteCategoryButton, styles.LongButton]}
                // onPress={handleAddCategory}
              />
            </View>
          </View>
        )}
      </View>

      // <View style={styles.expenseHeader}>
      //   <RecentExpense value={total_spent} name={store_name} date={date} />

      // </View>
    );
  };

  if (data) {
    return (
      <View style={styles.container}>
        <Sidebar page="expenses" />
        <SectionView>
          <Heading1>Expenses</Heading1>
          <ScrollView style={{ flex: 1, ...styles.subContainer1 }}>
            {data.map((expense, idx) => {
              return <Expense data={expense} index={idx} />;
            })}
            <View style={styles.spaceBetween}>
              <AnimatedButton
                bgColor={"#BCEE51"}
                hoverBgColor={"#558033"}
                textColor={"#384718"}
                hoverTextColor={"#fff"}
                text={"Previous Page"}
                viewStyle={[styles.pageButton]}
                onPress={handlePreviousPage}
              />
              <AnimatedButton
                bgColor={"#BCEE51"}
                hoverBgColor={"#558033"}
                textColor={"#384718"}
                hoverTextColor={"#fff"}
                text={"Next Page"}
                viewStyle={[styles.pageButton]}
                onPress={handleNextPage}
              />
            </View>
          </ScrollView>
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
    subContainer1: {
      width: "100%",
      margin: 20,
      padding: "10%",
      backgroundColor: "#ddd",
      borderRadius: 22,
    },
    expenseContainer: {
      marginBottom: 10,
    },
    expenseHeader: {
      padding: 10,
      backgroundColor: "#fff",
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dropdownContent: {
      padding: 16,
      backgroundColor: "#ddd",
      borderRadius: 8,
      marginTop: 8,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    column: {
      flex: 1,
      // marginRight: 10,
    },
    h2: {
      marginLeft: "-9%",
      marginTop: "-10%",
    },
    subExpenseBox: {
      // marginBottom: 5,
      backgroundColor: "#fff",
      // padding: 10,
      borderRadius: 8,
    },

    categoryBox: {
      marginBottom: 2,

      padding: 10,
      borderRadius: 8,
    },

    input: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: "#ddd",
      borderRadius: 8,
    },

    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center",
      marginBottom: 8,
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 8,
    },

    rowColumn: {
      flexGrow: 2,
      flexShrink: 2,
      flexBasis: "10%",
    },

    subExpenseColumn: {
      width: "100%",
    },

    categoryColumn: {
      width: "100%",
    },

    buttonContainer: {
      flexDirection: "row",
      justifyContent: "right",
      alignItems: "end",
    },

    button: {
      width: 40,
      height: 40,
      borderRadius: 10,
    },
    LongButton: {
      width: "80%",
      height: 40,
      borderRadius: 10,
      margin: "auto",
    },
    pageButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      width: "40%",
      borderRadius: 16,
    },
    buttonGap: {
      width: 10,
    },

    subExpensesLabel: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 10,
    },
    catLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 10,
    },
    spaceBetween: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      // marginBottom: 24,
    },
    fontSize: {
      fontSize: getBodyTextSize(width),
      lineHeight: "1.5",
    },
  });
