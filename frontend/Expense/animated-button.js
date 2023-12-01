import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { bodyTextStyle } from "./body-text";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AnimatedButton(props) {
  const bgColorProp = props.bgColor;
  const hoverBgColor = props.hoverBgColor;
  const textColorProp = props.textColor;
  const hoverTextColor = props.hoverTextColor;
  const textContent = props.text;
  const buttonStyling = props.buttonStyle;
  const viewStyling = props.viewStyle;
  const onPress = props.onPress;

  const isHovered = useSharedValue(false);

  const buttonHoverIn = () => {
    isHovered.value = true;
  };

  const buttonHoverOut = () => {
    isHovered.value = false;
  };

  const animatedPressableStyle = useAnimatedStyle(() => {
    const backgroundColor = isHovered.value
      ? withTiming(hoverBgColor)
      : withTiming(bgColorProp);

    return { backgroundColor };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const textColorValue = isHovered.value
      ? withTiming(hoverTextColor)
      : withTiming(textColorProp);

    return {
      color: textColorValue,
    };
  });

  return (
    <AnimatedPressable
      onMouseEnter={buttonHoverIn}
      onMouseLeave={buttonHoverOut}
      onPress={onPress}
      style={[buttonStyling, viewStyling, animatedPressableStyle]}
    >
      <Animated.Text
        style={[bodyTextStyle(), animatedTextStyle, { textAlign: "center" }]}
      >
        {textContent}
      </Animated.Text>
    </AnimatedPressable>
  );
}
