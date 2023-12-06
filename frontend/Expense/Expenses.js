import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Link } from "@react-navigation/native";
import Sidebar from "./sidebar";
import SectionView from "./section-view";

export default function Expenses() {
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);

  return (
    <View style={styles.container}>
      <Sidebar page="expenses" />
      <SectionView>
        <Text>lorem ipsum</Text>
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
  });
