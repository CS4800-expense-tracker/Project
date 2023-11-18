import { StyleSheet, Text } from "react-native";

export default function BodyText(props) {
  const styling = props.style;
  const children = props.children;

  return <Text style={[styles.body, styling]}>{children}</Text>;
}

export function bodyTextStyle() {
  return styles.body;
}

const styles = StyleSheet.create({
  body: {
    fontFamily: "Rubik_400Regular",
    fontSize: 18,
    letterSpacing: 0.5,
    lineHeight: "2",
  },
});
