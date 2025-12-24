import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { colors } from './constants/colors'; // assuming you already have this

export default function DisclaimerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerText}>Disclaimer</Text>

        <Text style={styles.paragraph}>
          This app does not replace professional medical diagnosis or treatment. Please consult qualified healthcare professionals.
        </Text>

        <Text style={styles.paragraph}>
          यो एपले चिकित्सकको व्यावसायिक निदान वा उपचारको सट्टा लिँदैन। कृपया योग्य स्वास्थ्यकर्मीको सल्लाह लिनुहोस्।
        </Text>

        <Text style={styles.paragraph}>
          This app is intended for educational and supportive purposes only. It is designed to assist parents and caregivers, not to provide medical advice.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
});
