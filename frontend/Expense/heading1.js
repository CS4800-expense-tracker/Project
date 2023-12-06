import { StyleSheet, Text, useWindowDimensions } from "react-native";
import { getH1MobileSize } from "./font-sizes";

export default function Heading1(props) {
  const styling = props.style;
  const children = props.children;

  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);

  return <Text style={[styles.h1, styling]}>{children}</Text>;
}

const makeStyles = (width) =>
  StyleSheet.create({
    h1: {
      fontFamily: "Rubik_600SemiBold",
      fontSize: getH1MobileSize(width),
      letterSpacing: -2,
      lineHeight: "1.13",
    },
  });
