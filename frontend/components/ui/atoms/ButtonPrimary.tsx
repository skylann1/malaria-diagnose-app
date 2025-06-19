// components/Button.tsx
import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native'


interface ButtonProps {
  title: string
  onPress: (event: GestureResponderEvent) => void
  backgroundColor?: string
  textColor?: string
  style?: ViewStyle
}

const ButtonPrimary: React.FC<ButtonProps> = ({
  title,
  onPress,
  backgroundColor = '#4CAF50', // default green
  textColor = '#fff',
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 8,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: 'inter-Bold',
  },
})

export default ButtonPrimary
