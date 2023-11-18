import { View, StyleSheet } from "react-native";

export default function SectionView(props) {
  const children = props.children;

  return (
    <View style={styles.rootView}>
      <View style={styles.childView}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootView: {
    display: "flex",
    alignItems: "center",
    width: "80%",
  },
  childView: {
    width: "90%",
    marginTop: 48,
  },
});
