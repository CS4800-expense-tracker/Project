import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Link } from "@react-navigation/native";
import Sidebar from "./sidebar";
import SectionView from "./section-view";
import Heading1 from "./heading1";

export default function Account() {
  return (
    <View style={styles.container}>
      <Sidebar page="account" />
      <SectionView>
        <Heading1>Account Settings</Heading1>
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
  sectionView: {
    display: "flex",
    alignItems: "center",
    width: "80%",
  },
});
