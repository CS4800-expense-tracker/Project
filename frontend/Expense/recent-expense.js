import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { getBodyTextSize } from "./font-sizes";
import BodyText from "./body-text";

export default function RecentExpense(props) {
  const value = props.value;
  const name = props.name;
  const date = (props.date);

  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);


  

  return (
    <View style={styles.spaceBetween}>
      <BodyText
        style={[styles.fontSize, { color: value > 0 ? "#803333" : "#558033" }]}
      >
        {value > 0 ? "-" : "+"}${Math.abs(value).toFixed(2)}
      </BodyText>
      <BodyText style={[styles.fontSize, { textAlign: "center" }]}>
        {name}
      </BodyText>
      <BodyText style={styles.fontSize}>{date}</BodyText>
    </View>
  );
}

const makeStyles = (width) =>
  StyleSheet.create({
    spaceBetween: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 24,
    },
    fontSize: {
      fontSize: getBodyTextSize(width),
      lineHeight: "1.5",
    },
  });
