import { StyleSheet, Text, useWindowDimensions } from "react-native";
import { getBodyTextSize } from "./font-sizes";

export default function BodyText(props) {
  const styling = props.style;
  const children = props.children;

  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);

  return <Text style={[styles.body, styling]}>{children}</Text>;
}

export function bodyTextStyle() {
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);

  return styles.body;
}

const makeStyles = (width) =>
  StyleSheet.create({
    body: {
      fontFamily: "Rubik_400Regular",
      fontSize: getBodyTextSize(width),
      letterSpacing: 0.5,
      lineHeight: "2",
    },
  });
