import classNames from "classnames";
import React, { useRef } from "react";

import { Animated, Pressable, Text } from "react-native";

export interface IButtonProps {
  title?: string;
  backgroundColor?: string;
  color?: string;
  children?: any;
  onPress?(): void;
  disabled?: boolean;
  style?: string;
  buttonStyle?: string;
  textStyle?: string;
}

export default function Button(props: IButtonProps) {
  const {
    onPress,
    title,
    backgroundColor,
    color,
    style,
    children,
    disabled,
    buttonStyle,
    textStyle,
  } = props;

  const animated = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    if (disabled) return;

    Animated.timing(animated, {
      toValue: 0.4,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    if (disabled) return;

    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      style={[{ opacity: disabled ? 0.5 : 1 }]}
      className={style}
      onPressIn={fadeIn}
      onPressOut={fadeOut}
      onPress={disabled ? null : onPress}
    >
      <Animated.View
        className={classNames("bg-main py-1 px-4 rounded-full ", buttonStyle, {
          "bg-gray": disabled,
        })}
        style={[
          {
            opacity: animated,
          },
        ]}
      >
        {title ? (
          <Text
            className={classNames(
              "text-white font-semibold text-center text-lg font-bold",
              textStyle
            )}
          >
            {title}
          </Text>
        ) : (
          children
        )}
      </Animated.View>
    </Pressable>
  );
}

Button.defaultProps = {
  title: null,
  children: null,
  onPress: null,
  disabled: false,
  style: null,
  buttonStyle: null,
  textStyle: null,
};
