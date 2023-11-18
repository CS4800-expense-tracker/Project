import { StyleSheet, Text } from "react-native";

export default function Heading1(props) {
  const styling = props.style;
  const children = props.children;

  return <Text style={[styles.h1, styling]}>{children}</Text>;
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: "Rubik_600SemiBold",
    fontSize: 56,
    letterSpacing: -2,
    lineHeight: "1.13",
  },
});
