import { StyleSheet, Text, useWindowDimensions } from "react-native";
import { getH2MobileSize } from "./font-sizes";

export default function Heading2(props) {
  const styling = props.style;
  const children = props.children;

  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);

  return <Text style={[styles.h2, styling]}>{children}</Text>;
}

const makeStyles = (width) =>
  StyleSheet.create({
    h2: {
      fontFamily: "Rubik_500Medium",
      fontSize: getH2MobileSize(width),
      letterSpacing: -1,
      lineHeight: "1.13",
    },
  });
