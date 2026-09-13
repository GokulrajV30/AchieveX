// ─────────────────────────────────────────────────────────────
// AchieveX — Global Premium Popup & Feedback System
// ─────────────────────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export type DialogType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'confirmation'
  | 'actionRequired';

export interface DialogAction {
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}

export interface DialogOptions {
  type?: DialogType;
  title: string;
  message: string;
  primaryAction?: DialogAction;
  secondaryAction?: DialogAction;
  onDismiss?: () => void;
}

export interface ToastOptions {
  type?: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
}

interface FeedbackContextType {
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
  showToast: (options: ToastOptions | string) => void;
  hideToast: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

// Global imperative bridge refs
let globalShowDialog: ((options: DialogOptions) => void) | null = null;
let globalHideDialog: (() => void) | null = null;
let globalShowToast: ((options: ToastOptions | string) => void) | null = null;
let globalHideToast: (() => void) | null = null;

export const showAchieveXDialog = (options: DialogOptions) => {
  if (globalShowDialog) {
    globalShowDialog(options);
  }
};

export const hideAchieveXDialog = () => {
  if (globalHideDialog) {
    globalHideDialog();
  }
};

export const showAchieveXToast = (options: ToastOptions | string) => {
  if (globalShowToast) {
    globalShowToast(options);
  }
};

export const hideAchieveXToast = () => {
  if (globalHideToast) {
    globalHideToast();
  }
};

export const dismissAllFeedback = () => {
  hideAchieveXDialog();
  hideAchieveXToast();
};

/**
 * Drop-in replacement adapter for Alert.alert(...)
 */
export const AchieveXAlert = {
  alert: (
    title: string,
    message?: string,
    buttons?: Array<{
      text?: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }>,
    _options?: { cancelable?: boolean; onDismiss?: () => void }
  ) => {
    let dialogType: DialogType = 'info';
    const lowerTitle = (title || '').toLowerCase();
    const lowerMsg = (message || '').toLowerCase();

    if (
      lowerTitle.includes('error') ||
      lowerTitle.includes('failed') ||
      lowerTitle.includes('wrong')
    ) {
      dialogType = 'error';
    } else if (
      lowerTitle.includes('success') ||
      lowerTitle.includes('verified') ||
      lowerTitle.includes('approved') ||
      lowerTitle.includes('submitted') ||
      lowerTitle.includes('saved') ||
      lowerTitle.includes('ready') ||
      lowerTitle.includes('created') ||
      lowerTitle.includes('updated') ||
      lowerTitle.includes('assigned')
    ) {
      dialogType = 'success';
    } else if (
      lowerTitle.includes('delete') ||
      lowerTitle.includes('reject') ||
      lowerTitle.includes('remove')
    ) {
      dialogType = 'actionRequired';
    } else if (
      lowerTitle.includes('?') ||
      lowerTitle.includes('confirm') ||
      lowerTitle.includes('logout') ||
      lowerTitle.includes('log out')
    ) {
      dialogType = 'confirmation';
    } else if (
      lowerTitle.includes('warning') ||
      lowerTitle.includes('alert') ||
      lowerTitle.includes('notice')
    ) {
      dialogType = 'warning';
    }

    if (!buttons || buttons.length === 0) {
      showAchieveXDialog({
        type: dialogType,
        title,
        message: message || '',
        primaryAction: {
          label: 'Done',
          onPress: hideAchieveXDialog,
        },
      });
      return;
    }

    if (buttons.length === 1) {
      const b = buttons[0];
      showAchieveXDialog({
        type: dialogType,
        title,
        message: message || '',
        primaryAction: {
          label: b.text || 'Done',
          destructive: b.style === 'destructive',
          onPress: () => {
            hideAchieveXDialog();
            b.onPress?.();
          },
        },
      });
      return;
    }

    // 2 buttons (cancel vs action)
    const cancelBtn = buttons.find((b) => b.style === 'cancel') || buttons[0];
    const actionBtn = buttons.find((b) => b !== cancelBtn) || buttons[1];

    showAchieveXDialog({
      type: dialogType,
      title,
      message: message || '',
      secondaryAction: {
        label: cancelBtn.text || 'Cancel',
        onPress: () => {
          hideAchieveXDialog();
          cancelBtn.onPress?.();
        },
      },
      primaryAction: {
        label: actionBtn.text || 'Continue',
        destructive: actionBtn.style === 'destructive' || lowerTitle.includes('delete') || lowerTitle.includes('reject'),
        onPress: () => {
          hideAchieveXDialog();
          actionBtn.onPress?.();
        },
      },
    });
  },
};

export const useAchieveXFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (!context) {
    return {
      showDialog: showAchieveXDialog,
      hideDialog: hideAchieveXDialog,
      showToast: showAchieveXToast,
      hideToast: hideAchieveXToast,
    };
  }
  return context;
};

interface AchieveXFeedbackProviderProps {
  children: React.ReactNode;
}

export function AchieveXFeedbackProvider({ children }: AchieveXFeedbackProviderProps) {
  const insets = useSafeAreaInsets();
  // Dialog State
  const [dialogState, setDialogState] = useState<{
    visible: boolean;
    options: DialogOptions | null;
  }>({
    visible: false,
    options: null,
  });

  // Toast State
  const [toastState, setToastState] = useState<{
    visible: boolean;
    options: ToastOptions | null;
  }>({
    visible: false,
    options: null,
  });

  const dialogAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showDialog = useCallback((options: DialogOptions) => {
    setDialogState({ visible: true, options });
    dialogAnim.setValue(0);
    Animated.timing(dialogAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [dialogAnim]);

  const hideDialog = useCallback(() => {
    setDialogState((prev) => {
      prev.options?.onDismiss?.();
      return { visible: false, options: null };
    });
    dialogAnim.setValue(0);
  }, [dialogAnim]);

  const hideToast = useCallback(() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    Animated.timing(toastAnim, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      setToastState({ visible: false, options: null });
    });
  }, [toastAnim]);

  const showToast = useCallback(
    (opts: ToastOptions | string) => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      const options: ToastOptions =
        typeof opts === 'string'
          ? { message: opts, type: 'success', duration: 2500 }
          : { type: 'success', duration: 2500, ...opts };

      setToastState({ visible: true, options });
      toastAnim.setValue(0);
      Animated.spring(toastAnim, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 4,
        speed: 14,
      }).start();

      toastTimeoutRef.current = setTimeout(() => {
        hideToast();
      }, options.duration || 2500);
    },
    [toastAnim, hideToast]
  );

  // Sync to global imperative bridges
  useEffect(() => {
    globalShowDialog = showDialog;
    globalHideDialog = hideDialog;
    globalShowToast = showToast;
    globalHideToast = hideToast;

    return () => {
      globalShowDialog = null;
      globalHideDialog = null;
      globalShowToast = null;
      globalHideToast = null;
    };
  }, [showDialog, hideDialog, showToast, hideToast]);

  const currentOpts = dialogState.options;
  const currentToast = toastState.options;

  // Icon configuration helper
  const getIconConfig = (type: DialogType = 'info') => {
    switch (type) {
      case 'success':
        return {
          iconName: 'checkmark',
          bgColor: '#ECFDF5',
          color: '#059669',
          iconSize: 22,
        };
      case 'error':
        return {
          iconName: 'close',
          bgColor: '#FEF2F2',
          color: '#DC2626',
          iconSize: 22,
        };
      case 'warning':
        return {
          iconName: 'alert',
          bgColor: '#FFFBEB',
          color: '#D97706',
          iconSize: 22,
        };
      case 'actionRequired':
        return {
          iconName: 'alert-circle',
          bgColor: '#FFF7ED',
          color: '#EA580C',
          iconSize: 22,
        };
      case 'confirmation':
        return {
          iconName: 'help',
          bgColor: '#EEF2FF',
          color: '#4F46E5',
          iconSize: 20,
        };
      case 'info':
      default:
        return {
          iconName: 'information',
          bgColor: '#EFF6FF',
          color: '#2563EB',
          iconSize: 22,
        };
    }
  };

  const getToastIcon = (type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    switch (type) {
      case 'error':
        return { iconName: 'close-circle', color: '#DC2626' };
      case 'warning':
        return { iconName: 'alert-circle', color: '#D97706' };
      case 'info':
        return { iconName: 'information-circle', color: '#2563EB' };
      case 'success':
      default:
        return { iconName: 'checkmark-circle', color: '#059669' };
    }
  };

  const iconCfg = getIconConfig(currentOpts?.type);
  const toastIcon = getToastIcon(currentToast?.type);

  return (
    <FeedbackContext.Provider
      value={{ showDialog, hideDialog, showToast, hideToast }}
    >
      {children}

      {/* GLOBAL TOAST OVERLAY */}
      {toastState.visible && currentToast && (
        <Animated.View
          style={[
            styles.toastWrapper,
            {
              top: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24) + 12,
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-24, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.toastCard}>
            <Ionicons
              name={toastIcon.iconName as any}
              size={18}
              color={toastIcon.color}
              style={styles.toastIcon}
            />
            <Text style={styles.toastMessage} numberOfLines={2}>
              {currentToast.message}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* GLOBAL DIALOG MODAL */}
      <Modal
        visible={dialogState.visible}
        transparent={true}
        animationType="none"
        onRequestClose={hideDialog}
        statusBarTranslucent
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={hideDialog}
          />
          <Animated.View
            style={[
              styles.dialogContainer,
              {
                opacity: dialogAnim,
                transform: [
                  {
                    scale: dialogAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.93, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Status Icon */}
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: iconCfg.bgColor },
              ]}
            >
              <Ionicons
                name={iconCfg.iconName as any}
                size={iconCfg.iconSize}
                color={iconCfg.color}
              />
            </View>

            {/* Title */}
            <Text style={styles.dialogTitle}>{currentOpts?.title}</Text>

            {/* Supporting Message */}
            {Boolean(currentOpts?.message) && (
              <Text style={styles.dialogMessage}>{currentOpts?.message}</Text>
            )}

            {/* Actions */}
            <View style={styles.actionsContainer}>
              {currentOpts?.secondaryAction ? (
                <View style={styles.twoActionRow}>
                  {/* Secondary Left */}
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    activeOpacity={0.75}
                    onPress={() => {
                      const cb = currentOpts?.secondaryAction?.onPress;
                      hideDialog();
                      cb?.();
                    }}
                  >
                    <Text style={styles.secondaryBtnText}>
                      {currentOpts.secondaryAction.label || 'Cancel'}
                    </Text>
                  </TouchableOpacity>

                  {/* Primary Right */}
                  <TouchableOpacity
                    style={[
                      styles.primaryBtn,
                      currentOpts.primaryAction?.destructive &&
                        styles.destructiveBtn,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      const cb = currentOpts?.primaryAction?.onPress;
                      hideDialog();
                      cb?.();
                    }}
                  >
                    <Text style={styles.primaryBtnText}>
                      {currentOpts.primaryAction?.label || 'Continue'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* One-action single button */
                <TouchableOpacity
                  style={[
                    styles.singlePrimaryBtn,
                    currentOpts?.primaryAction?.destructive &&
                      styles.destructiveBtn,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    const cb = currentOpts?.primaryAction?.onPress;
                    hideDialog();
                    cb?.();
                  }}
                >
                  <Text style={styles.primaryBtnText}>
                    {currentOpts?.primaryAction?.label || 'Done'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </FeedbackContext.Provider>
  );
}

const styles = StyleSheet.create({
  // Modal Scrim
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.40)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  // Centered Dialog Card
  dialogContainer: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },

  // Icon Treatment
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  // Typography
  dialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  dialogMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  // Action Buttons Layout
  actionsContainer: {
    width: '100%',
  },
  twoActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  singlePrimaryBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveBtn: {
    backgroundColor: '#DC2626',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#334155',
    fontSize: 14.5,
    fontWeight: '600',
  },

  // Toast Layout
  toastWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    maxWidth: '92%',
  },
  toastIcon: {
    marginRight: 8,
  },
  toastMessage: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
});
