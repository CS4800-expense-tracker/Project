import { Pressable } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { bodyTextStyle } from "./body-text";

export default function AnimatedButton(props) {
  const bgColorProp = props.bgColor;
  const hoverBgColor = props.hoverBgColor;
  const textColorProp = props.textColor;
  const hoverTextColor = props.hoverTextColor;
  const textContent = props.text;
  const buttonStyling = props.buttonStyle;
  const viewStyling = props.viewStyle;
  const onPress = props.onPress;

  const bgColor = useSharedValue(bgColorProp);
  const textColor = useSharedValue(textColorProp);

  const buttonHoverIn = () => {
    bgColor.value = withTiming(hoverBgColor);
    textColor.value = withTiming(hoverTextColor);
  };

  const buttonHoverOut = () => {
    bgColor.value = withTiming(bgColorProp);
    textColor.value = withTiming(textColorProp);
  };

  return (
    <Pressable
      onHoverIn={buttonHoverIn}
      onHoverOut={buttonHoverOut}
      onPress={onPress}
      style={buttonStyling}
    >
      <Animated.View style={[viewStyling, { backgroundColor: bgColor }]}>
        <Animated.Text
          style={[bodyTextStyle(), { color: textColor, textAlign: "center" }]}
        >
          {textContent}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
