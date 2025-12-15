import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

function maskDate(value: string) {
  // Remove tudo que não for número
  let v = value.replace(/\D/g, '');
  if (v.length > 8) v = v.slice(0, 8);
  if (v.length > 4) return v.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
  if (v.length > 2) return v.replace(/(\d{2})(\d{0,2})/, '$1/$2');
  return v;
}

export const DateInput = React.forwardRef<TextInput, TextInputProps>(({ value, onChangeText, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      keyboardType="numeric"
      value={value}
      onChangeText={text => {
        const masked = maskDate(text);
        onChangeText && onChangeText(masked);
      }}
      maxLength={10}
      {...props}
    />
  );
});
