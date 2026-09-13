// ─────────────────────────────────────────────────────────────
// AchieveX — Shared Form Components
// Reusable UI primitives for the Achievement Submission flow
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// ═══════════════════════════════════════════════
//  FormTextInput
// ═══════════════════════════════════════════════
interface FormTextInputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'url';
  prefix?: string;
  editable?: boolean;
}

export function FormTextInput({
  label, value, onChangeText, placeholder, required, error,
  multiline, maxLength, keyboardType, prefix, editable = true,
}: FormTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={fiStyles.fieldContainer}>
      <Text style={fiStyles.label}>
        {label}
        {required && <Text style={fiStyles.required}> *</Text>}
      </Text>
      <View style={[
        fiStyles.inputWrapper,
        focused && fiStyles.inputFocused,
        error ? fiStyles.inputError : null,
        multiline && { height: 90, alignItems: 'flex-start' as const },
      ]}>
        {prefix && <Text style={fiStyles.prefix}>{prefix}</Text>}
        <TextInput
          style={[fiStyles.input, multiline && { textAlignVertical: 'top', paddingTop: 12 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          editable={editable}
        />
      </View>
      <View style={fiStyles.bottomRow}>
        {error ? <Text style={fiStyles.errorText}>{error}</Text> : <View />}
        {maxLength != null && (
          <Text style={fiStyles.counter}>{value.length} / {maxLength}</Text>
        )}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════
//  FormDatePicker (Calendar Modal Selector)
// ═══════════════════════════════════════════════
interface FormDatePickerProps {
  label: string;
  value: string; // Stored as YYYY-MM-DD
  onChangeText: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${day} ${months[monthIdx] || parts[1]} ${year}`;
}

export function FormDatePicker({
  label, value, onChangeText, placeholder, required, error,
}: FormDatePickerProps) {
  const [open, setOpen] = useState(false);

  // Initialize calendar view to value or current date
  const now = new Date();
  const initDate = value ? new Date(value) : now;
  const [currentYear, setCurrentYear] = useState(initDate.getFullYear() || now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initDate.getMonth() !== undefined ? initDate.getMonth() : now.getMonth());

  // Date picker grid logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon...

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const selectedDateStr = `${currentYear}-${mm}-${dd}`;
    onChangeText(selectedDateStr);
    setOpen(false);
  };

  const renderDays = () => {
    const days = [];
    // Empty cells for first day padding
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<View key={`empty-${i}`} style={calStyles.dayCellEmpty} />);
    }
    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = value === dateStr;
      days.push(
        <TouchableOpacity
          key={`day-${d}`}
          style={[calStyles.dayCell, isSelected && calStyles.dayCellSelected]}
          onPress={() => handleSelectDay(d)}
        >
          <Text style={[calStyles.dayText, isSelected && calStyles.dayTextSelected]}>
            {d}
          </Text>
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <View style={fiStyles.fieldContainer}>
      <Text style={fiStyles.label}>
        {label}
        {required && <Text style={fiStyles.required}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[fiStyles.inputWrapper, error ? fiStyles.inputError : null]}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="calendar-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
        <Text style={[fiStyles.input, { paddingVertical: 14 }, !value && { color: '#9CA3AF' }]}>
          {value ? formatDateDisplay(value) : placeholder || 'Select date'}
        </Text>
      </TouchableOpacity>
      {error && <Text style={fiStyles.errorText}>{error}</Text>}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={dropStyles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={calStyles.card} onStartShouldSetResponder={() => true}>
            <View style={calStyles.header}>
              <TouchableOpacity onPress={handlePrevMonth} style={calStyles.navBtn}>
                <Ionicons name="chevron-back" size={20} color="#374151" />
              </TouchableOpacity>
              <Text style={calStyles.headerTitle}>
                {monthsList[currentMonth]} {currentYear}
              </Text>
              <TouchableOpacity onPress={handleNextMonth} style={calStyles.navBtn}>
                <Ionicons name="chevron-forward" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Quick Year jump */}
            <View style={calStyles.yearRow}>
              <TouchableOpacity onPress={() => setCurrentYear((y) => y - 1)} style={calStyles.yearBtn}>
                <Text style={calStyles.yearBtnText}>-{1}</Text>
              </TouchableOpacity>
              <Text style={calStyles.yearText}>Jump Year</Text>
              <TouchableOpacity onPress={() => setCurrentYear((y) => y + 1)} style={calStyles.yearBtn}>
                <Text style={calStyles.yearBtnText}>+{1}</Text>
              </TouchableOpacity>
            </View>

            {/* Days header */}
            <View style={calStyles.weekHeader}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <Text key={d} style={calStyles.weekText}>
                  {d}
                </Text>
              ))}
            </View>

            {/* Grid */}
            <View style={calStyles.grid}>{renderDays()}</View>

            {/* Close Button */}
            <TouchableOpacity style={calStyles.closeBtn} onPress={() => setOpen(false)}>
              <Text style={calStyles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ═══════════════════════════════════════════════
//  FormDropdown (modal-based selector)
// ═══════════════════════════════════════════════
interface FormDropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  searchable?: boolean;
}

export function FormDropdown({
  label, value, options, onSelect, placeholder, required, error, searchable,
}: FormDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = searchable && search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <View style={fiStyles.fieldContainer}>
      <Text style={fiStyles.label}>
        {label}
        {required && <Text style={fiStyles.required}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[fiStyles.inputWrapper, error ? fiStyles.inputError : null]}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        <Text style={[fiStyles.input, { paddingVertical: 14 }, !value && { color: '#9CA3AF' }]}>
          {value || placeholder || 'Select...'}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#6B7280" />
      </TouchableOpacity>
      {error && <Text style={fiStyles.errorText}>{error}</Text>}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={dropStyles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={dropStyles.sheet} onStartShouldSetResponder={() => true}>
            <View style={dropStyles.handle} />
            <Text style={dropStyles.title}>{label}</Text>
            {searchable && (
              <View style={dropStyles.searchWrap}>
                <Ionicons name="search" size={16} color="#9CA3AF" />
                <TextInput
                  style={dropStyles.searchInput}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search..."
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
            <ScrollView style={dropStyles.optionsList} showsVerticalScrollIndicator={false}>
              {filtered.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[dropStyles.option, value === opt && dropStyles.optionActive]}
                  activeOpacity={0.7}
                  onPress={() => { onSelect(opt); setOpen(false); setSearch(''); }}
                >
                  <Text style={[dropStyles.optionText, value === opt && dropStyles.optionTextActive]}>
                    {opt}
                  </Text>
                  {value === opt && <Ionicons name="checkmark-circle" size={20} color="#2563EB" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ═══════════════════════════════════════════════
//  FormToggle (Yes/No or dual option card)
// ═══════════════════════════════════════════════
interface FormToggleProps {
  label: string;
  value: string;
  options: { id: string; label: string; description?: string; icon?: string }[];
  onSelect: (v: string) => void;
  required?: boolean;
}

export function FormToggle({ label, value, options, onSelect, required }: FormToggleProps) {
  return (
    <View style={fiStyles.fieldContainer}>
      <Text style={fiStyles.label}>
        {label}
        {required && <Text style={fiStyles.required}> *</Text>}
      </Text>
      <View style={toggleStyles.row}>
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[toggleStyles.card, active && toggleStyles.cardActive]}
              activeOpacity={0.7}
              onPress={() => onSelect(opt.id)}
            >
              {opt.icon && (
                <View style={[toggleStyles.iconCircle, active && toggleStyles.iconCircleActive]}>
                  <Ionicons
                    name={opt.icon as any}
                    size={20}
                    color={active ? '#2563EB' : '#6B7280'}
                  />
                </View>
              )}
              <Text style={[toggleStyles.cardLabel, active && toggleStyles.cardLabelActive]}>
                {opt.label}
              </Text>
              {opt.description && (
                <Text style={toggleStyles.cardDesc}>{opt.description}</Text>
              )}
              {active && (
                <View style={toggleStyles.checkBadge}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════
//  SelectableCard
// ═══════════════════════════════════════════════
interface SelectableCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function SelectableCard({ title, description, selected, onPress, icon, children }: SelectableCardProps) {
  return (
    <TouchableOpacity
      style={[scStyles.card, selected && scStyles.cardSelected]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={scStyles.headerRow}>
        {icon && <View style={scStyles.iconWrap}>{icon}</View>}
        <View style={scStyles.textWrap}>
          <Text style={[scStyles.title, selected && scStyles.titleSelected]}>{title}</Text>
          {description && <Text style={scStyles.desc}>{description}</Text>}
        </View>
        <View style={[scStyles.radio, selected && scStyles.radioSelected]}>
          {selected && <View style={scStyles.radioDot} />}
        </View>
      </View>
      {children}
    </TouchableOpacity>
  );
}

// ═══════════════════════════════════════════════
//  SectionCard — white card wrapper
// ═══════════════════════════════════════════════
interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <View style={secStyles.card}>
      {title && <Text style={secStyles.title}>{title}</Text>}
      {subtitle && <Text style={secStyles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

// ═══════════════════════════════════════════════
//  InfoBanner
// ═══════════════════════════════════════════════
interface InfoBannerProps {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  icon?: string;
}

export function InfoBanner({ message, type = 'info', icon }: InfoBannerProps) {
  const colors = {
    info: { bg: '#EFF6FF', text: '#1D4ED8', iconColor: '#2563EB' },
    warning: { bg: '#FFFBEB', text: '#92400E', iconColor: '#F59E0B' },
    error: { bg: '#FEF2F2', text: '#991B1B', iconColor: '#DC2626' },
    success: { bg: '#F0FDF4', text: '#166534', iconColor: '#16A34A' },
  };
  const c = colors[type];
  const iconName = icon || (type === 'info' ? 'information-circle' : type === 'warning' ? 'warning' : type === 'error' ? 'close-circle' : 'checkmark-circle');

  return (
    <View style={[bannerStyles.container, { backgroundColor: c.bg }]}>
      <Ionicons name={iconName as any} size={18} color={c.iconColor} style={{ marginRight: 10, marginTop: 1 }} />
      <Text style={[bannerStyles.text, { color: c.text }]}>{message}</Text>
    </View>
  );
}

// ═══════════════════════════════════════════════
//  ChipGroup — horizontal scrollable chips
// ═══════════════════════════════════════════════
interface ChipGroupProps {
  items: string[];
  maxVisible?: number;
}

export function ChipGroup({ items, maxVisible = 4 }: ChipGroupProps) {
  const visible = items.slice(0, maxVisible);
  const remaining = items.length - maxVisible;

  return (
    <View style={chipStyles.row}>
      {visible.map((item) => (
        <View key={item} style={chipStyles.chip}>
          <Text style={chipStyles.chipText}>{item}</Text>
        </View>
      ))}
      {remaining > 0 && (
        <View style={[chipStyles.chip, chipStyles.chipMore]}>
          <Text style={[chipStyles.chipText, chipStyles.chipMoreText]}>+{remaining}</Text>
        </View>
      )}
    </View>
  );
}

// ═══════════════════════════════════════════════
//  PrimaryButton
// ═══════════════════════════════════════════════
interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
}

export function PrimaryButton({ title, onPress, disabled, variant = 'primary', icon }: PrimaryButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          btnStyles.btn,
          isPrimary && btnStyles.btnPrimary,
          isOutline && btnStyles.btnOutline,
          variant === 'secondary' && btnStyles.btnSecondary,
          disabled && btnStyles.btnDisabled,
        ]}
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={18}
            color={isPrimary ? '#FFFFFF' : '#2563EB'}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[
          btnStyles.btnText,
          isPrimary && btnStyles.btnTextPrimary,
          isOutline && btnStyles.btnTextOutline,
          variant === 'secondary' && btnStyles.btnTextSecondary,
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════

const fiStyles = StyleSheet.create({
  fieldContainer: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  required: { color: '#DC2626' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    minHeight: 48,
  },
  inputFocused: { borderColor: '#2563EB', backgroundColor: '#F8FAFF' },
  inputError: { borderColor: '#DC2626', backgroundColor: '#FEF2F2' },
  input: { flex: 1, fontSize: 15, color: '#1F2937', fontWeight: '500' },
  prefix: { fontSize: 15, fontWeight: '600', color: '#6B7280', marginRight: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  errorText: { fontSize: 12, color: '#DC2626', fontWeight: '500', marginTop: 4 },
  counter: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
});

const dropStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center', marginBottom: 16,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 14 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 10,
    paddingHorizontal: 12, marginBottom: 12, height: 42,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1F2937', marginLeft: 8 },
  optionsList: { marginTop: 4 },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 4,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  optionActive: { backgroundColor: '#EFF6FF', borderRadius: 10, paddingHorizontal: 12 },
  optionText: { fontSize: 15, color: '#374151', fontWeight: '500' },
  optionTextActive: { color: '#2563EB', fontWeight: '600' },
});

const toggleStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1, backgroundColor: '#FFFFFF',
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB',
    padding: 16, alignItems: 'center', position: 'relative',
  },
  cardActive: { borderColor: '#2563EB', backgroundColor: '#F8FAFF' },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  iconCircleActive: { backgroundColor: '#DBEAFE' },
  cardLabel: { fontSize: 14, fontWeight: '700', color: '#374151', textAlign: 'center' },
  cardLabelActive: { color: '#1D4ED8' },
  cardDesc: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginTop: 4, lineHeight: 16 },
  checkBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
  },
});

const scStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB',
    padding: 16, marginBottom: 10,
  },
  cardSelected: { borderColor: '#2563EB', backgroundColor: '#FAFBFF' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { marginRight: 14 },
  textWrap: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  titleSelected: { color: '#1D4ED8' },
  desc: { fontSize: 13, color: '#6B7280', marginTop: 3, lineHeight: 18 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: '#2563EB' },
  radioDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#2563EB',
  },
});

const secStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#F0F0ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6B7280', marginBottom: 16, lineHeight: 19 },
});

const bannerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: 14, borderRadius: 12, marginBottom: 16,
  },
  text: { flex: 1, fontSize: 13, fontWeight: '500', lineHeight: 19 },
});

const chipStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  chip: {
    backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: { fontSize: 11, color: '#6B7280', fontWeight: '600' },
  chipMore: { backgroundColor: '#E5E7EB' },
  chipMoreText: { color: '#374151' },
});

const btnStyles = StyleSheet.create({
  btn: {
    height: 50, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: '#2563EB' },
  btnSecondary: { backgroundColor: '#F3F4F6' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#2563EB' },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 15, fontWeight: '700' },
  btnTextPrimary: { color: '#FFFFFF' },
  btnTextSecondary: { color: '#374151' },
  btnTextOutline: { color: '#2563EB' },
});

const calStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 340,
    padding: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 12,
  },
  yearBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  yearBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  yearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 6,
  },
  weekText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    width: 38,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: 4,
  },
  dayCell: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    marginBottom: 4,
  },
  dayCellSelected: {
    backgroundColor: '#2563EB',
  },
  dayCellEmpty: {
    width: 38,
    height: 38,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  closeBtn: {
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
});

