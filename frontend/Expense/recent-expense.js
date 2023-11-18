import { StyleSheet, Text, View } from "react-native";
import BodyText from "./body-text";

export default function RecentExpense(props) {
  const value = props.value;
  const name = props.name;
  const date = props.date;

  return (
    <View style={styles.spaceBetween}>
      <BodyText style={{ color: value > 0 ? "#803333" : "#558033" }}>
        {value > 0 ? "-" : "+"}${Math.abs(value).toFixed(2)}
      </BodyText>
      <BodyText>{name}</BodyText>
      <BodyText>{date}</BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  spaceBetween: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
});
