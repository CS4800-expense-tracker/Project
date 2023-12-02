import { ScrollView, View, StyleSheet } from "react-native";

export default function SectionView(props) {
  const children = props.children;

  return (
    <ScrollView contentContainerStyle={styles.rootView}>
      <View style={styles.childView}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rootView: {
    display: "flex",
    alignItems: "center",
  },
  childView: {
    width: "90%",
    marginTop: 48,
    paddingBottom: 64,
  },
});
