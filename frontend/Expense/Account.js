import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, TextInput, View, useWindowDimensions } from "react-native";
import { usePlaidLink } from "react-plaid-link";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Link } from "@react-navigation/native";
import Sidebar from "./sidebar";
import SectionView from "./section-view";
import Heading1 from "./heading1";
import Heading2 from "./heading2";
import BodyText, { bodyTextStyle } from "./body-text";
import AnimatedButton from "./animated-button";
import { SelectList } from "react-native-dropdown-select-list";
import { getH2XSmallMobileSize } from "./font-sizes";
import { AppContext } from "./AppContext";

export default function Account({ navigation }) {
  const [budget, setBudget] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");
  const [selectedCategoryEdit, setSelectedCategoryEdit] = useState("");
  const [categoryEditName, setCategoryEditName] = useState("");
  const [editedCategoryBudget, setEditedCategoryBudget] = useState("");
  const [selectedCategoryDelete, setSelectedCategoryDelete] = useState("");
  const [deleteAccount, setDeleteAccount] = useState("");
  const { state, dispatch } = useContext(AppContext);
  const user_id = localStorage.getItem("userID");
  var linkedBank = localStorage.getItem("isBankLinked");

  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);

  const [userBudget, setUserBudget] = useState({});
  const [userCategories, setUserCategories] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    fetch(`https://cs4800.acgandhi.com/total_budget/${user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserBudget(data);
        console.log("This is from fetch", data);
      })
      .catch((err) => console.error(err));
    fetch(`https://cs4800.acgandhi.com/categories/${user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserCategories(data);
      });
  }, [update]);

  const totalBudget = 1000;
  const expenseCategories = [
    {
      name: "Groceries",
      percent: 40,
    },
    {
      name: "Utilities",
      percent: 30,
    },
    {
      name: "Electronics",
      percent: 20,
    },
    {
      name: "Cars",
      percent: 10,
    },
  ];

  let selectListData = [];
  const getSelectListData = (categories) => {
    selectListData = [];
    categories.map((element, i) => {
      selectListData.push({
        key: element.name,
        value: element.name + ` (${element.percent}%)`,
      });
    });
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
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total_budget: budget }),
      };

      fetch(
        `https://cs4800.acgandhi.com/total_budget/${user_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
        })
        .catch((err) => console.error(err));
      setBudget("");
      setTimeout(() => {
        setUpdate(!update);
      }, 500);
    }
  };
  const onClearMonthlyBudgetPress = () => {
    setBudget("");
  };

  const onNewCategoryNameChanged = (text) => {
    let newText = "";
    let chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789 '&(),./:-'\"";

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
    let totalCurrentPercentages = 0;
    userCategories.map((element) => {
      totalCurrentPercentages += element.percent;
    });
    const newTotalPercentages =
      totalCurrentPercentages + Number(newCategoryBudget);
    if (
      newCategoryName.length !== 0 &&
      newCategoryBudget.length !== 0 &&
      totalCurrentPercentages <= 100 &&
      newTotalPercentages <= 100
    ) {
      // Insert code here to set user's new category name and its budget percentage in backend database
      // 'newCategoryName' stores the new category name
      // 'newCategoryBudget' stores the category's budget percentage
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          percent: Number(newCategoryBudget),
        }),
      };

      fetch(`https://cs4800.acgandhi.com/category/${user_id}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
        })
        .catch((err) => console.error(err));
      setNewCategoryName("");
      setNewCategoryBudget("");
      setTimeout(() => {
        setUpdate(!update);
      }, 500);
    }
  };
  const onClearNewCategoryPress = () => {
    setNewCategoryName("");
    setNewCategoryBudget("");
  };

  const onEditCategoryNameChanged = (text) => {
    let newText = "";
    let chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789 '&(),./:-'\"";

    for (let i = 0; i < text.length; i++) {
      if (chars.indexOf(text[i]) > -1) newText += text[i];
    }

    setCategoryEditName(newText);
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
    let totalCurrentPercentages = 0;
    userCategories.map((element) => {
      totalCurrentPercentages += element.percent;
    });
    const newTotalPercentages =
      totalCurrentPercentages -
      selectedCategoryEdit.split(" ")[1].slice(1, 3) +
      Number(newCategoryBudget);
    if (
      selectedCategoryEdit.length !== 0 &&
      editedCategoryBudget.length !== 0 &&
      totalCurrentPercentages <= 100 &&
      newTotalPercentages <= 100
    ) {
      // Insert code here to set user's new budget for the selected category in backend database
      // 'selectedCategory' stores the category name
      // 'editedCategoryBudget' stores the new budget for the selected category
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:
            categoryEditName.length === 0
              ? selectedCategoryEdit.split(" ")[0]
              : categoryEditName,
          percent: Number(editedCategoryBudget),
        }),
      };

      fetch(
        `https://cs4800.acgandhi.com/category/${user_id}/${
          selectedCategoryEdit.split(" ")[0]
        }`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
        })
        .catch((err) => console.error(err));
      setCategoryEditName("");
      setEditedCategoryBudget("");
      setTimeout(() => {
        location.reload(true);
      }, 500);
    }
  };
  const onClearEditedCategoryPress = () => {
    setEditedCategoryBudget("");
    setCategoryEditName("");
  };

  const onDeleteCategory = () => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    fetch(
      `https://cs4800.acgandhi.com/category/${user_id}/${
        selectedCategoryDelete.split(" ")[0]
      }`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
      })
      .catch((err) => console.error(err));
    setTimeout(() => {
      location.reload(true);
    }, 500);
  };

  const onDeleteAccountPress = () => {
    if (deleteAccount.toLowerCase() === "delete my account") {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };

      fetch(`https://cs4800.acgandhi.com/user/${user_id}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
        })
        .catch((err) => console.error(err));
      setTimeout(() => {
        navigation.navigate("Landing");
      }, 500);
    }
  };

  const BankButton = () => {
    const [linkToken, setLinkToken] = useState();
    const generateToken = async () => {
      const tokenConfig = {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ user_id: user_id }),
      };
      // fetch("http://127.0.0.1:5000/create_link_token", tokenConfig)
      fetch("https://cs4800.acgandhi.com/create_link_token", tokenConfig)
        .then((response) => response.json())
        .then((data) => {
          setLinkToken(data.link_token);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    useEffect(() => {
      generateToken();
    }, []);
    return linkToken != null ? <PlaidLink linkToken={linkToken} /> : <></>;
  };

  const PlaidLink = (props) => {
    const onSuccess = React.useCallback((public_token, metadata) => {
      // send public_token to server
      const response = fetch("https://cs4800.acgandhi.com/set_access_token", {
        // const response = fetch("http://127.0.0.1:5000/set_access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_token: public_token, user_id: user_id }),
      });
      localStorage.setItem("isBankLinked", true);
    }, []);
    const config = {
      token: props.linkToken,
      onSuccess,
    };
    const { open, ready } = usePlaidLink(config);
    return (
      <AnimatedButton
        bgColor={linkedBank ? "#ddd" : "#BCEE51"}
        hoverBgColor={linkedBank ? "#803333" : "#558033"}
        textColor={linkedBank ? "#803333" : "#384718"}
        hoverTextColor={"#fff"}
        text={linkedBank ? "Unlink your account" : "Link your account"}
        buttonStyle={{ width: linkedBank ? 216 : 200 }}
        viewStyle={styles.bankLinkButtonView}
        onPress={() => open()}
        disabled={!ready}
      />
    );
  };

  if (userBudget && userCategories) {
    return (
      <View style={styles.container}>
        <Sidebar page="account" />
        <SectionView alignItems={width >= 1200 ? "" : "center"}>
          <Heading1 style={[styles.bottomMarginLarge, styles.mobileCenter]}>
            Account Settings
          </Heading1>
          <Heading2
            style={[styles.bottomMarginMediumSmall, styles.mobileCenter]}
          >
            Update your monthly budget
          </Heading2>
          <Heading2
            style={[
              styles.bottomMarginXSmall,
              styles.h2XSmall,
              styles.mobileCenter,
            ]}
          >
            Current budget
          </Heading2>
          <BodyText style={[styles.input, styles.bottomMarginSmall]}>
            ${userBudget.totalBudget}
          </BodyText>
          <Heading2
            style={[
              styles.bottomMarginXSmall,
              styles.h2XSmall,
              styles.mobileCenter,
            ]}
          >
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
          <Heading2
            style={[styles.bottomMarginMediumSmall, styles.mobileCenter]}
          >
            Create a new expense category
          </Heading2>
          <Heading2
            style={[
              styles.bottomMarginXSmall,
              styles.h2XSmall,
              styles.mobileCenter,
            ]}
          >
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
          <Heading2
            style={[
              styles.bottomMarginXSmall,
              styles.h2XSmall,
              styles.mobileCenter,
            ]}
          >
            Category budget percentage
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
          <BodyText
            style={[
              styles.bottomMarginXSmall,
              styles.mobileCenter,
              styles.subText,
            ]}
          >
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
          <Heading2
            style={[styles.bottomMarginMediumSmall, styles.mobileCenter]}
          >
            Edit an expense category
          </Heading2>
          <Heading2
            style={[
              styles.bottomMarginXSmall,
              styles.h2XSmall,
              styles.mobileCenter,
            ]}
          >
            Category name
          </Heading2>
          <View style={{ width: "100%" }}>
            <SelectList
              setSelected={(val) => setSelectedCategoryEdit(val)}
              data={getSelectListData(userCategories)}
              save="value"
              search={false}
              boxStyles={[styles.dropdown, { alignItems: "center" }]}
              dropdownStyles={styles.dropdown}
              inputStyles={bodyTextStyle()}
              dropdownTextStyles={bodyTextStyle()}
            />
          </View>
          <View style={styles.bottomMarginSmall}></View>
          <Heading2
            style={[
              styles.bottomMarginXSmall,
              styles.h2XSmall,
              styles.mobileCenter,
            ]}
          >
            New name
          </Heading2>
          <TextInput
            keyboardType="numeric"
            onChangeText={(text) => onEditCategoryNameChanged(text)}
            value={categoryEditName}
            placeholder="Groceries"
            placeholderTextColor="#888"
            maxLength={100}
            style={[bodyTextStyle(), styles.input]}
          />
          <View style={styles.bottomMarginXSmall}></View>
          <BodyText
            style={[
              styles.bottomMarginXSmall,
              styles.mobileCenter,
              styles.subText,
            ]}
          >
            Leave this field blank if you do not wish to change the name.
          </BodyText>
          <Heading2
            style={[
              styles.bottomMarginXSmall,
              styles.h2XSmall,
              styles.mobileCenter,
            ]}
          >
            New budget percentage
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
          <BodyText
            style={[
              styles.bottomMarginXSmall,
              styles.mobileCenter,
              styles.subText,
            ]}
          >
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
          <Heading2
            style={[styles.bottomMarginMediumSmall, styles.mobileCenter]}
          >
            Delete an expense category
          </Heading2>
          <Heading2
            style={[
              styles.bottomMarginXSmall,
              styles.h2XSmall,
              styles.mobileCenter,
            ]}
          >
            Category name
          </Heading2>
          <View style={[styles.bottomMarginXSmall, { width: "100%" }]}>
            <SelectList
              setSelected={(val) => setSelectedCategoryDelete(val)}
              data={getSelectListData(userCategories)}
              save="value"
              search={false}
              boxStyles={[styles.dropdown, { alignItems: "center" }]}
              dropdownStyles={styles.dropdown}
              inputStyles={bodyTextStyle()}
              dropdownTextStyles={bodyTextStyle()}
            />
          </View>
          <BodyText
            style={[
              styles.bottomMarginXSmall,
              styles.mobileCenter,
              styles.subText,
            ]}
          >
            Deleting a category will also delete all sub expenses associated
            with the category.
          </BodyText>
          <AnimatedButton
            bgColor={"#ddd"}
            hoverBgColor={"#803333"}
            textColor={"#803333"}
            hoverTextColor={"#fff"}
            text={"Delete category"}
            buttonStyle={{ width: "max-content" }}
            viewStyle={[styles.bankLinkButtonView, styles.bottomMarginLarge]}
            onPress={onDeleteCategory}
          />
          <Heading2 style={[styles.bottomMarginSmall, styles.mobileCenter]}>
            Link your bank account
          </Heading2>
          <BodyText style={[styles.bottomMarginSmall, styles.mobileCenter]}>
            You {linkedBank ? "already" : "do not currently"} have a bank
            account connected with PennyWise
          </BodyText>
          <BankButton />
          <View style={styles.bottomMarginLarge}></View>
          <Heading2 style={[styles.bottomMarginSmall, styles.mobileCenter]}>
            Delete your account
          </Heading2>
          <BodyText style={[styles.bottomMarginSmall, styles.mobileCenter]}>
            Delete your account, including all data associated with it. This is
            NOT reversible.
          </BodyText>
          <Heading2
            style={[
              styles.bottomMarginXSmall,
              styles.h2XSmall,
              styles.mobileCenter,
            ]}
          >
            Confirm deletion
          </Heading2>
          <TextInput
            keyboardType="default"
            onChangeText={(text) => setDeleteAccount(text)}
            value={deleteAccount}
            placeholder="Delete my account"
            placeholderTextColor="#888"
            maxLength={17}
            style={[bodyTextStyle(), styles.input]}
          />
          <BodyText
            style={[
              styles.bottomMarginXSmall,
              styles.mobileCenter,
              styles.subText,
            ]}
          >
            Type "Delete my account" to confirm account deletion.
          </BodyText>
          <AnimatedButton
            bgColor={"#ddd"}
            hoverBgColor={"#803333"}
            textColor={"#803333"}
            hoverTextColor={"#fff"}
            text={"Delete your account"}
            buttonStyle={{ width: "max-content" }}
            viewStyle={styles.bankLinkButtonView}
            onPress={onDeleteAccountPress}
          />
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
      maxWidth: 384,
      width: "100%",
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
    h2XSmall: {
      fontSize: getH2XSmallMobileSize(width),
    },
    dropdown: {
      backgroundColor: "#ddd",
      borderRadius: 8,
      paddingLeft: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingTop: 8,
      maxWidth: 384,
      width: "100%",
      alignSelf: width >= 1200 ? "auto" : "center",
      borderWidth: "none",
    },
    mobileCenter: {
      textAlign: width >= 1200 ? "auto" : "center",
    },
    subText: {
      fontSize: width >= 600 ? 14 : 12,
      maxWidth: 384,
    },
  });
