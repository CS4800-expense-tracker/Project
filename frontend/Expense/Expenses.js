import React, { useState } from "react";
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
import Sidebar from "./sidebar";
import SectionView from "./section-view";
import Heading1 from "./heading1";
import Heading2 from "./heading2";
import RecentExpense from "./recent-expense";
import { SelectList } from "react-native-dropdown-select-list";
import AnimatedButton from "./animated-button";

export default function Expenses() {
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);

  const name = "John";
  const monthlyBudget = 1000;
  const spent = Math.trunc(780);
  const available = monthlyBudget - spent;
  /*  const [expensesData, setExpensesData] = useState([
    {
      store: "Amazon",
      mainExpense: -120.5,
      date: "11/16/23",
      categories: [
        { name: "Groceries(40%)", subExpenses: [{ value: "" }] },
        { name: "Utilities(30%)", subExpenses: [{ value: "" }] },
        { name: "Electronics(10%)", subExpenses: [{ value: "" }] },
        { name: "Cars(20%)", subExpenses: [{ value: "" }] },
      ],
    },
    #ddd
    // Add other expense items similarly
  ]);*/
  const expensesData = [
    {
      store: "Amazon",
      mainExpense: -120.5,
      date: "11/16/23",
      subExpenses: [{ subExpense: "", category: "Electronics" }],
    },
    {
      store: "In-N-Out Burger",
      mainExpense: 56.78,
      date: "11/20/23",
      category: "Auto Parts",
      subExpenses: [
        { subExpense: "", category: "Auto Parts" },
        { subExpense: "", category: "Auto Parts" },
        // Add more sub-expenses as needed
      ],
    },
    {
      store: "O'Reilly Auto Parts",
      mainExpense: 78.69,
      date: "11/16/23",
      category: "Auto Parts",
      subExpenses: [
        { subExpense: "", category: "Auto Parts" },
        { subExpense: "", category: "Auto Parts" },
        // Add more sub-expenses as needed
      ],
    },
    {
      store: "Walmart",
      mainExpense: 46.69,
      date: "11/5/23",
      category: "Auto Parts",
      subExpenses: [
        { subExpense: "", category: "Groceries" },
        { subExpense: "", category: "Utilities" },
        // Add more sub-expenses as needed
      ],
    },

    {
      store: "Walmart",
      mainExpense: 46.69,
      date: "11/5/23",
      category: "Auto Parts",
      subExpenses: [
        { subExpense: "", category: "Electronics" },
        { subExpense: "", category: "Auto Parts" },
        // Add more sub-expenses as needed
      ],
    },

    {
      store: "Walmart",
      mainExpense: 46.69,
      date: "11/5/23",
      category: "Auto Parts",
      subExpenses: [{ subExpense: "", category: "Auto Parts" }],
    },

    {
      store: "Walmart",
      mainExpense: 46.69,
      date: "11/5/23",
      category: "Auto Parts",
      subExpenses: [
        { subExpense: "", category: "Auto Parts" },
        { subExpense: "", category: "Auto Parts" },
        // Add more sub-expenses as needed
      ],
    },

    {
      store: "Walmart",
      mainExpense: 46.69,
      date: "11/5/23",
      category: "Auto Parts",
      subExpenses: [
        { subExpense: "", category: "Auto Parts" },
        { subExpense: "", category: "Auto Parts" },
        // Add more sub-expenses as needed
      ],
    },

    {
      store: "Walmart",
      mainExpense: 46.69,
      date: "11/5/23",
      category: "Auto Parts",
      subExpenses: [
        { subExpense: "", category: "Auto Parts" },
        { subExpense: "", category: "Auto Parts" },
        // Add more sub-expenses as needed
      ],
    },

    {
      store: "Amazon",
      mainExpense: -120.5,
      date: "11/16/23",
      subExpenses: [
        { subExpense: "", category: "Electronics" },
        { subExpense: "", category: "Electronics" },
        { subExpense: "", category: "Electronics" },
      ],
    },
    {
      store: "Walmart",
      mainExpense: 46.69,
      date: "11/5/23",
      category: "Auto Parts",
      subExpenses: [
        { subExpense: "", category: "Auto Parts" },
        { subExpense: "", category: "Auto Parts" },
        // Add more sub-expenses as needed
      ],
    },
    {
      store: "Walmart",
      mainExpense: 46.69,
      date: "11/5/23",
      category: "Auto Parts",
      subExpenses: [
        { subExpense: "", category: "Auto Parts" },
        { subExpense: "", category: "Auto Parts" },
        // Add more sub-expenses as needed
      ],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleBoxPress = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSaveSubExpense = (expenseIndex) => {
    // Insert logic to save sub-expense data to your state or backend
    console.log("Sub-expense saved for expense at index:", expenseIndex);
  };

  const handleSubExpenseChange = (expenseIndex, subIndex, text) => {
    const updatedExpenses = [...expensesData];
    updatedExpenses[expenseIndex].subExpenses[subIndex].subExpense = text;
    setExpensesData(updatedExpenses);
  };

  const categoriesList = Array.from(
    new Set(
      expensesData.flatMap((item) =>
        item.subExpenses.map((subExpense) => subExpense.category)
      )
    )
  ).map((category) => ({ label: category, value: category }));

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
  return (
    <View style={styles.container}>
      <Sidebar page="expenses" />
      <SectionView>
        <Heading1>Expenses</Heading1>
        <ScrollView style={{ flex: 1, ...styles.subContainer1 }}>
          <Heading2 style={styles.h2}>Recent Expenses: </Heading2>
          <View>
            {expensesData
              .filter(
                (storeData) =>
                  !selectedCategory ||
                  storeData.subExpenses.some(
                    (subExpense) => subExpense.category === selectedCategory
                  )
              )
              .map((storeData, index) => (
                <View key={index} style={styles.expenseContainer}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.expenseHeader,
                      {
                        backgroundColor:
                          expandedIndex === index ? "#BCEE51" : "#fff",
                      },
                    ]}
                    onPress={() => handleBoxPress(index)}
                  >
                    <RecentExpense
                      value={storeData.mainExpense}
                      name={storeData.store}
                      date={storeData.date}
                    />
                  </Pressable>
                  {expandedIndex === index && (
                    <View style={styles.dropdownContent}>
                      <View style={styles.column}>
                        <Text style={styles.subExpensesLabel}>
                          Sub Expenses:
                        </Text>
                        {storeData.subExpenses.map((subExpense, subIndex) => (
                          <View style={styles.rowContainer}>
                            <View style={styles.rowColumn}>
                              <View style={styles.subExpenseColumn}>
                                <View
                                  key={subIndex}
                                  style={styles.subExpenseBox}
                                >
                                  <TextInput
                                    style={styles.input}
                                    placeholder="Enter Sub Expense"
                                    onChangeText={(text) =>
                                      handleSubExpenseChange(
                                        index,
                                        subIndex,
                                        text
                                      )
                                    }
                                  />
                                  <Button
                                    title="Save Sub Expenses"
                                    onPress={() => handleSaveSubExpense(index)}
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
                                <Text style={styles.catLabel}>Category:</Text>
                                <SelectList
                                  style={styles.categoryBox}
                                  setSelected={(val) =>
                                    setSelectedCategory(val)
                                  }
                                  data={categoriesList}
                                  selected={selectedCategory}
                                  onSelect={(value) =>
                                    setSelectedCategory(value)
                                  }
                                  search={false}
                                  save="key"
                                  title="Select Category"
                                  placeholder="Pick a Category"
                                  input={<TextInput />}
                                />
                                {selectedCategory && (
                                  <Text>
                                    Selected Category: {selectedCategory}
                                  </Text>
                                )}
                              </View>
                            </View>
                            <View style={styles.buttonContainer}>
                              <AnimatedButton
                                bgColor={"#BCEE51"}
                                hoverBgColor={"#558033"}
                                textColor={"#384718"}
                                hoverTextColor={"#fff"}
                                text={"+"}
                                viewStyle={[
                                  styles.addDeleteCategoryButton,
                                  styles.button,
                                ]}
                                onPress={handleAddCategory}
                              />
                              <View style={styles.buttonGap} />{" "}
                              {/* Add a gap between buttons */}
                              <AnimatedButton
                                bgColor={"#BCEE51"}
                                hoverBgColor={"#558033"}
                                textColor={"#384718"}
                                hoverTextColor={"#fff"}
                                text={"-"}
                                viewStyle={[
                                  styles.addDeleteCategoryButton,
                                  styles.button,
                                ]}
                                onPress={handleDeleteCategory}
                              />
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              ))}
          </View>
        </ScrollView>
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
      padding: 10,
      backgroundColor: "#ddd",
      borderRadius: 8,
      marginTop: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    column: {
      flex: 1,
      marginRight: 10,
    },
    h2: {
      marginLeft: "-9%",
      marginTop: "-10%",
    },
    subExpenseBox: {
      marginBottom: 5,
      backgroundColor: "#fff",
      padding: 10,
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
      marginBottom: 5,
      backgroundColor: "#fff",
      padding: 10,
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
  });
