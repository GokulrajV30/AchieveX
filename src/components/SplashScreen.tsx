import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7FF" />
      <TouchableOpacity
        activeOpacity={0.98}
        onPress={onFinish}
        style={styles.container}
      >
        {/* Exact Full Resolution Image Asset uploaded by user */}
        <Image
          source={require('../../assets/Splash Screen - achievex.png')}
          style={styles.fullSplashImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullSplashImage: {
    width: width,
    height: height,
  },
});
