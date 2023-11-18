import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Link } from "@react-navigation/native";
import Sidebar from "./sidebar";
import SectionView from "./section-view";

export default function Expenses() {
  return (
    <View style={styles.container}>
      <Sidebar page="expenses" />
      <SectionView>
        <Text>lorem ipsum</Text>
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
});
