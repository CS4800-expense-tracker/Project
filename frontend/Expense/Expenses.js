import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Link } from "@react-navigation/native";
import Sidebar from "./sidebar";
import SectionView from "./section-view";
import Heading1 from "./heading1";




export default function Expenses() {
  return (
    <View style={styles.container}>
      <Sidebar page="expenses" />
      <SectionView>
        <Heading1>Expenses</Heading1>
        <View style={styles.subContainer} />
        <View style={styles.subContainer1} />
        <View style={styles.subContainer2} />
        <View style={styles.subContainer3} />
      </SectionView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "space-between",
    height: "100%",
    width: "100%"
  },
 
  subContainer: {
    flexDirection: "row",
    alignContent: "space-between",
  },
  subContainer1: {
    width: 100,
    height: 100,
    margin: 20,
    flex: 1,
    padding: 10, // Adjust padding as needed
    backgroundColor: "#ddd",
    borderRadius: 32,
  },
  subContainer2: {
    width: 100,
    height: 100,
    margin: 20,
    flex: 2,
    padding: 10, // Adjust padding as needed
    backgroundColor: "#ddd",
    borderRadius: 32,
  },
  subContainer3: {
    width: 100,
    height: 100,
    margin: 20,
    flex: 1,
    padding: 10, // Adjust padding as needed
    backgroundColor: "#ddd",
    borderRadius: 32,
  },
});


