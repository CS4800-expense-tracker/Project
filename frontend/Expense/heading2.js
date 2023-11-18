import { StyleSheet, Text } from "react-native";

export default function Heading2(props) {
  const styling = props.style;
  const children = props.children;

  return <Text style={[styles.h2, styling]}>{children}</Text>;
}

const styles = StyleSheet.create({
  h2: {
    fontFamily: "Rubik_500Medium",
    fontSize: 32,
    letterSpacing: -1,
    lineHeight: "1.13",
  },
});
