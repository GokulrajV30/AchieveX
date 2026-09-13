// ─────────────────────────────────────────────────────────────
// AchieveX — Photo Upload Modal Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';

interface PhotoUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectImage: (uri: string) => void;
}

export default function PhotoUploadModal({
  visible,
  onClose,
  onSelectImage,
}: PhotoUploadModalProps) {
  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showAchieveXDialog({
          type: 'warning',
          title: 'Permission Required',
          message: 'Camera access is required to take a photo.',
          primaryAction: {
            label: 'Got It',
          },
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        onSelectImage(result.assets[0].uri);
        onClose();
      }
    } catch (err) {
      console.warn('Error taking photo:', err);
      showAchieveXDialog({
        type: 'error',
        title: 'Upload Failed',
        message: 'Unable to open camera. Try again.',
        primaryAction: {
          label: 'Try Again',
        },
      });
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showAchieveXDialog({
          type: 'warning',
          title: 'Permission Required',
          message: 'Photo library access is needed to select a photo.',
          primaryAction: {
            label: 'Got It',
          },
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        onSelectImage(result.assets[0].uri);
        onClose();
      }
    } catch (err) {
      console.warn('Error picking image:', err);
      showAchieveXDialog({
        type: 'error',
        title: 'Upload Failed',
        message: 'Unable to open gallery. Try again.',
        primaryAction: {
          label: 'Try Again',
        },
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetCard}>
          <View style={styles.handleBar} />

          <Text style={styles.sheetTitle}>Update Profile Photo</Text>
          <Text style={styles.sheetSubtitle}>Choose a photo to update your student profile.</Text>

          {/* Option 1: Take Photo */}
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={handleTakePhoto}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="camera-outline" size={22} color="#2563EB" />
            </View>
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          {/* Option 2: Choose from Gallery */}
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={handleChooseFromGallery}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="images-outline" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          {/* Option 3: Cancel */}
          <TouchableOpacity
            style={styles.cancelBtn}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  cancelBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    marginTop: 4,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
});
