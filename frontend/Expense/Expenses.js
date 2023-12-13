import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, Pressable, Button, ScrollView } from "react-native";
import Sidebar from "./sidebar";
import SectionView from "./section-view";
import Heading1 from "./heading1";
import Heading2 from "./heading2";
import RecentExpense from "./recent-expense";
import { SelectList } from "react-native-dropdown-select-list";
import AnimatedButton from "./animated-button";


export default function Expenses() {
  const name = "John";
  const monthlyBudget = 1000;
  const spent = Math.trunc(780);
  const available = monthlyBudget - spent;
  const [currPage, setCurrPage] = useState(1)
  const userID = localStorage.getItem("userID")
  const [data, setData] = useState()

  useEffect(() => {
    const url = `http://127.0.0.1:5000/expenses/${userID}/${currPage}`;
    // const url = `http://api.pennywise.money/expenses/${userID}/${currPage}`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      setData(data)
    })
  }, [])

  useEffect(() => {console.log(data)}, [data])

  if (data) {
    return (
      <View style={styles.container}>
        <Sidebar page="expenses" />
          <SectionView>
          <Heading1>Expenses</Heading1>
          <ScrollView style={{flex:1, ...styles.subContainer1}}>
            <Heading2 style={styles.h2}>Recent Expenses: </Heading2>
            {/* Should be a white rectangle that houses the info for the epxense */}
            <View>
              <Heading2>{data[0].store_name}</Heading2>
              <Heading2>Spent: {data[0].total_spent}</Heading2>
            </View>  
          </ScrollView>
        </SectionView>
      </View>
    );
  } else {
    return <></>;
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "space-between",
    height: "100%",
    width: "100%",
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
    marginBottom: 2 ,

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
    flexBasis: "10%"
  },

  subExpenseColumn: {
    width: "100%"
  },

  categoryColumn: {
    width: "100%"
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
      fontWeight: 'bold',    
      color: '#333',          
      marginBottom: 10,       
    },
  catLabel: {
      fontSize: 16,          
      fontWeight: 'bold',    
      color: '#333',          
      marginBottom: 10,       
    },
  });
  