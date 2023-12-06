import {
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

export default function SectionView(props) {
  const children = props.children;
  const alignItems = props.alignItems;

  const { height, width } = useWindowDimensions();
  const styles = makeStyles(width);

  return (
    <ScrollView contentContainerStyle={styles.rootView}>
      <View style={[styles.childView, { alignItems: alignItems }]}>
        {children}
      </View>
    </ScrollView>
  );
}

const makeStyles = (width) =>
  StyleSheet.create({
    rootView: {
      display: "flex",
      alignItems: "center",
    },
    childView: {
      width: "90%",
      maxWidth: 2000,
      marginTop: 48,
      paddingBottom: 64,
    },
  });
