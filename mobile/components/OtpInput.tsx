import { useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';

type Props = {
  onComplete: (code: string) => void;
  disabled?: boolean;
};

const LENGTH = 6;

export default function OtpInput({ onComplete, disabled }: Props) {
  const [values, setValues] = useState<string[]>(Array(LENGTH).fill(''));
  const refs = Array.from({ length: LENGTH }, () => useRef<TextInput>(null));

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      const chars = text.replace(/\D/g, '').slice(0, LENGTH).split('');
      const next = [...values];
      chars.forEach((c, i) => {
        if (index + i < LENGTH) next[index + i] = c;
      });
      setValues(next);
      const focusIdx = Math.min(index + chars.length, LENGTH - 1);
      refs[focusIdx].current?.focus();
      if (next.every(Boolean)) onComplete(next.join(''));
      return;
    }

    const next = [...values];
    next[index] = text;
    setValues(next);
    if (text && index < LENGTH - 1) refs[index + 1].current?.focus();
    if (next.every(Boolean)) onComplete(next.join(''));
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !values[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  return (
    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
      {values.map((val, i) => (
        <TextInput
          key={i}
          ref={refs[i]}
          value={val}
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          editable={!disabled}
          keyboardType="number-pad"
          maxLength={6}
          selectTextOnFocus
          style={{
            width: 46,
            height: 56,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: val ? '#C58D85' : '#EDE5E3',
            backgroundColor: '#FFFFFF',
            textAlign: 'center',
            fontSize: 22,
            fontWeight: '600',
            color: '#3D2B29',
          }}
        />
      ))}
    </View>
  );
}
