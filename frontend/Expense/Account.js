import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Link } from "@react-navigation/native";
import Sidebar from "./sidebar";
import SectionView from "./section-view";
import Heading1 from "./heading1";
import Heading2 from "./heading2";
import BodyText, { bodyTextStyle } from "./body-text";
import AnimatedButton from "./animated-button";
import { SelectList } from "react-native-dropdown-select-list";

export default function Account() {
  const [budget, setBudget] = React.useState("");
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [newCategoryBudget, setNewCategoryBudget] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [editedCategoryBudget, setEditedCategoryBudget] = React.useState("");
  const linkedBank = false;

  const totalBudget = 1000;
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

  let selectListData = [];
  const getSelectListData = (categories) => {
    categories.map((element, i) => {
      selectListData.push({
        key: element.expenseName,
        value:
          element.expenseName +
          " (" +
          Math.trunc((element.total / totalBudget) * 100) +
          "%)",
      });
    });
    console.log(selectListData);
    return selectListData;
  };

  const onMonthlyBudgetChanged = (text) => {
    let newText = "";
    let numbers = "0123456789";

    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) newText += text[i];
    }

    setBudget(newText);
  };
  const onSubmitMonthlyBudgetPress = () => {
    if (budget.length !== 0) {
      // Insert code here to set user's new budget in backend database
      // 'budget' stores the new budget
      setBudget("");
    }
  };
  const onClearMonthlyBudgetPress = () => {
    setBudget("");
  };

  const onNewCategoryNameChanged = (text) => {
    let newText = "";
    let chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '&(),./:-'\"";

    for (let i = 0; i < text.length; i++) {
      if (chars.indexOf(text[i]) > -1) newText += text[i];
    }

    setNewCategoryName(newText);
  };
  const onNewCategoryBudgetChanged = (text) => {
    let newText = "";
    let numbers = "0123456789";

    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) newText += text[i];
    }

    setNewCategoryBudget(newText);
  };
  const onSubmitNewCategoryPress = () => {
    if (newCategoryName.length !== 0 && newCategoryBudget.length !== 0) {
      // Insert code here to set user's new category name and its budget percentage in backend database
      // 'newCategoryName' stores the new category name
      // 'newCategoryBudget' stores the category's budget percentage
      setNewCategoryName("");
      setNewCategoryBudget("");
    }
  };
  const onClearNewCategoryPress = () => {
    setNewCategoryName("");
    setNewCategoryBudget("");
  };

  const onEditCategoryBudgetChanged = (text) => {
    let newText = "";
    let numbers = "0123456789";

    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) newText += text[i];
    }

    setEditedCategoryBudget(newText);
  };
  const onSubmitEditedCategoryPress = () => {
    if (selectedCategory.length !== 0 && editedCategoryBudget.length !== 0) {
      // Insert code here to set user's new budget for the selected category in backend database
      // 'selectedCategory' stores the category name
      // 'editedCategoryBudget' stores the new budget for the selected category
      setEditedCategoryBudget("");
    }
  };
  const onClearEditedCategoryPress = () => {
    setEditedCategoryBudget("");
  };

  return (
    <View style={styles.container}>
      <Sidebar page="account" />
      <SectionView>
        <Heading1 style={styles.bottomMarginLarge}>Account Settings</Heading1>
        <Heading2 style={styles.bottomMarginMediumSmall}>
          Update your monthly budget
        </Heading2>
        <Heading2 style={[styles.bottomMarginXSmall, styles.h2Small]}>
          Current budget
        </Heading2>
        <BodyText style={[styles.input, styles.bottomMarginSmall]}>
          ${totalBudget}
        </BodyText>
        <Heading2 style={[styles.bottomMarginXSmall, styles.h2Small]}>
          New budget
        </Heading2>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text) => onMonthlyBudgetChanged(text)}
          value={budget}
          placeholder="Whole number (e.g. 2250)"
          placeholderTextColor="#888"
          maxLength={6}
          style={[bodyTextStyle(), styles.bottomMarginSmall, styles.input]}
        />
        <View style={[styles.flexRow, styles.bottomMarginLarge]}>
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"Submit"}
            buttonStyle={[styles.budgetButton]}
            viewStyle={styles.budgetButtonView}
            onPress={onSubmitMonthlyBudgetPress}
          />
          <AnimatedButton
            bgColor={"#ddd"}
            hoverBgColor={"#333"}
            textColor={"#333"}
            hoverTextColor={"#fff"}
            text={"Clear"}
            buttonStyle={[styles.budgetButton]}
            viewStyle={styles.budgetButtonView}
            onPress={onClearMonthlyBudgetPress}
          />
        </View>
        <Heading2 style={styles.bottomMarginMediumSmall}>
          Create a new expense category
        </Heading2>
        <Heading2 style={[styles.bottomMarginXSmall, styles.h2Small]}>
          Category name
        </Heading2>
        <TextInput
          keyboardType="default"
          onChangeText={(text) => onNewCategoryNameChanged(text)}
          value={newCategoryName}
          placeholder="Groceries"
          placeholderTextColor="#888"
          maxLength={100}
          style={[bodyTextStyle(), styles.bottomMarginSmall, styles.input]}
        />
        <Heading2 style={[styles.bottomMarginXSmall, styles.h2Small]}>
          Category budget
        </Heading2>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text) => onNewCategoryBudgetChanged(text)}
          value={newCategoryBudget}
          placeholder="Percent (e.g. 20)"
          placeholderTextColor="#888"
          maxLength={2}
          style={[bodyTextStyle(), styles.input]}
        />
        <BodyText style={[styles.bottomMarginXSmall, { fontSize: 14 }]}>
          This is a percentage of your monthly budget.
        </BodyText>
        <View style={[styles.flexRow, styles.bottomMarginLarge]}>
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"Submit"}
            buttonStyle={[styles.budgetButton]}
            viewStyle={styles.budgetButtonView}
            onPress={onSubmitNewCategoryPress}
          />
          <AnimatedButton
            bgColor={"#ddd"}
            hoverBgColor={"#333"}
            textColor={"#333"}
            hoverTextColor={"#fff"}
            text={"Clear"}
            buttonStyle={[styles.budgetButton]}
            viewStyle={styles.budgetButtonView}
            onPress={onClearNewCategoryPress}
          />
        </View>
        <Heading2 style={styles.bottomMarginMediumSmall}>
          Edit an expense category
        </Heading2>
        <Heading2 style={[styles.bottomMarginXSmall, styles.h2Small]}>
          Category name
        </Heading2>
        <SelectList
          setSelected={(val) => setSelectedCategory(val)}
          data={getSelectListData(expenseCategories)}
          save="key"
          search={false}
          boxStyles={[styles.dropdown, { alignItems: "center" }]}
          dropdownStyles={styles.dropdown}
          inputStyles={bodyTextStyle()}
          dropdownTextStyles={bodyTextStyle()}
        />
        <View style={styles.bottomMarginSmall}></View>
        <Heading2 style={[styles.bottomMarginXSmall, styles.h2Small]}>
          New budget
        </Heading2>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text) => onEditCategoryBudgetChanged(text)}
          value={editedCategoryBudget}
          placeholder="Percent (e.g. 45)"
          placeholderTextColor="#888"
          maxLength={2}
          style={[bodyTextStyle(), styles.input]}
        />
        <BodyText style={[styles.bottomMarginXSmall, { fontSize: 14 }]}>
          This is a percentage of your monthly budget.
        </BodyText>
        <View style={[styles.flexRow, styles.bottomMarginLarge]}>
          <AnimatedButton
            bgColor={"#BCEE51"}
            hoverBgColor={"#558033"}
            textColor={"#384718"}
            hoverTextColor={"#fff"}
            text={"Submit"}
            buttonStyle={[styles.budgetButton]}
            viewStyle={styles.budgetButtonView}
            onPress={onSubmitEditedCategoryPress}
          />
          <AnimatedButton
            bgColor={"#ddd"}
            hoverBgColor={"#333"}
            textColor={"#333"}
            hoverTextColor={"#fff"}
            text={"Clear"}
            buttonStyle={[styles.budgetButton]}
            viewStyle={styles.budgetButtonView}
            onPress={onClearEditedCategoryPress}
          />
        </View>
        <Heading2 style={styles.bottomMarginSmall}>
          Link your bank account
        </Heading2>
        <BodyText style={styles.bottomMarginSmall}>
          You {linkedBank ? "already" : "do not currently"} have a bank account
          connected with PennyWise
        </BodyText>
        <Link
          to={{ screen: "BankLink" }}
          style={{ width: linkedBank ? 216 : 200 }}
        >
          <AnimatedButton
            bgColor={linkedBank ? "#ddd" : "#BCEE51"}
            hoverBgColor={linkedBank ? "#803333" : "#558033"}
            textColor={linkedBank ? "#803333" : "#384718"}
            hoverTextColor={"#fff"}
            text={linkedBank ? "Unlink your account" : "Link your account"}
            buttonStyle={{ width: linkedBank ? 216 : 200 }}
            viewStyle={styles.bankLinkButtonView}
          />
        </Link>
      </SectionView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
    height: "100%",
  },
  bottomMarginXSmall: {
    marginBottom: 8,
  },
  bottomMarginSmall: {
    marginBottom: 16,
  },
  bottomMarginMediumSmall: {
    marginBottom: 24,
  },
  bottomMarginMedium: {
    marginBottom: 32,
  },
  bottomMarginLarge: {
    marginBottom: 64,
  },
  sectionView: {
    display: "flex",
    alignItems: "center",
    width: "80%",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  input: {
    backgroundColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    width: 384,
  },
  budgetButton: {
    width: 128,
  },
  budgetButtonView: {
    borderRadius: 32,
    paddingVertical: 8,
  },
  bankLinkButtonView: {
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  h2Small: {
    fontSize: 24,
  },
  dropdown: {
    backgroundColor: "#ddd",
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingTop: 8,
    width: 384,
    borderWidth: "none",
  },
});
