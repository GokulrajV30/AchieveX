// ─────────────────────────────────────────────────────────────
// AchieveX — Custom Create Account Form Input Field
// ─────────────────────────────────────────────────────────────

import React, { useState, forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  LayoutChangeEvent,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export interface CreateAccountInputProps {
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  isDropdown?: boolean;
  isDropdownOpen?: boolean;
  rightIconName?: string;
  rightIconFamily?: 'Ionicons' | 'MaterialCommunityIcons';
  showInfoIcon?: boolean;
  onInfoPress?: () => void;
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  editable?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const CreateAccountInput = forwardRef<TextInput, CreateAccountInputProps>(
  function CreateAccountInput(
    {
      placeholder,
      value,
      onChangeText,
      onPress,
      isDropdown = false,
      isDropdownOpen = false,
      rightIconName,
      rightIconFamily = 'Ionicons',
      showInfoIcon = false,
      onInfoPress,
      isPassword = false,
      keyboardType = 'default',
      autoCapitalize = 'sentences',
      error,
      editable = true,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
      onFocus,
      onBlur,
      onLayout,
    },
    ref
  ) {
    const [focused, setFocused] = useState(false);
    const [secureText, setSecureText] = useState(isPassword);

    const handleContainerPress = () => {
      if (onPress) {
        onPress();
      }
    };

    return (
      <View style={styles.outerContainer} onLayout={onLayout}>
        <View style={styles.inputRow}>
          {/* Main Rounded Input Box */}
          <TouchableOpacity
            style={[
              styles.inputBox,
              focused && styles.inputBoxFocused,
              error ? styles.inputBoxError : null,
            ]}
            activeOpacity={isDropdown ? 0.7 : 1}
            onPress={handleContainerPress}
            disabled={!isDropdown}
          >
            {isDropdown ? (
              <Text
                style={[
                  styles.inputText,
                  !value && styles.placeholderText,
                ]}
                numberOfLines={2}
              >
                {value || placeholder}
              </Text>
            ) : (
              <TextInput
                ref={ref}
                style={styles.textInputField}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
                secureTextEntry={isPassword ? secureText : false}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                blurOnSubmit={blurOnSubmit}
                onFocus={() => {
                  setFocused(true);
                  onFocus?.();
                }}
                onBlur={() => {
                  setFocused(false);
                  onBlur?.();
                }}
                editable={editable}
              />
            )}

            {/* Right Icon Inside Box */}
            <View style={styles.rightIconWrapper}>
              {isPassword ? (
                <TouchableOpacity
                  onPress={() => setSecureText(!secureText)}
                  activeOpacity={0.6}
                >
                  <MaterialCommunityIcons
                    name={secureText ? 'lock-outline' : 'lock-open-outline'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              ) : isDropdown ? (
                rightIconName ? (
                  rightIconFamily === 'MaterialCommunityIcons' ? (
                    <MaterialCommunityIcons name={rightIconName as any} size={20} color="#64748B" />
                  ) : (
                    <Ionicons name={rightIconName as any} size={20} color="#64748B" />
                  )
                ) : (
                  <Ionicons
                    name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#64748B"
                  />
                )
              ) : rightIconName ? (
                rightIconFamily === 'MaterialCommunityIcons' ? (
                  <MaterialCommunityIcons name={rightIconName as any} size={20} color="#64748B" />
                ) : (
                  <Ionicons name={rightIconName as any} size={19} color="#64748B" />
                )
              ) : null}
            </View>
          </TouchableOpacity>

          {/* Outside Info (i) Icon for Activation Code */}
          {showInfoIcon && (
            <TouchableOpacity
              style={styles.outsideInfoBtn}
              activeOpacity={0.7}
              onPress={onInfoPress}
            >
              <Ionicons name="information-circle-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Validation Error Message */}
        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

export default CreateAccountInput;

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBox: {
    flex: 1,
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  inputBoxFocused: {
    borderColor: '#6D28D9',
  },
  inputBoxError: {
    borderColor: '#EF4444',
  },
  textInputField: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  inputText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 18,
    color: '#1E293B',
    marginRight: 6,
  },
  placeholderText: {
    color: '#94A3B8',
  },
  rightIconWrapper: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outsideInfoBtn: {
    marginLeft: 8,
    width: 28,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 11.5,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
});
