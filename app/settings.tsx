import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './constants/colors';
import { useApp } from './context/AppContext';

export default function SettingsScreen() {
  const { 
    language, 
    setLanguage, 
    textSize, 
    setTextSize, 
    soundEnabled, 
    setSoundEnabled,
    getTextSizeMultiplier,
    resetDailyProgress,
  } = useApp();
  
  const multiplier = getTextSizeMultiplier();

  const textSizeOptions = [
    { value: 'small' as const, label: 'सानो', labelEn: 'Small' },
    { value: 'medium' as const, label: 'मध्यम', labelEn: 'Medium' },
    { value: 'large' as const, label: 'ठूलो', labelEn: 'Large' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <Ionicons name="settings" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { fontSize: 20 * multiplier }]}>
            सेटिङ्स
          </Text>
          {language === 'english' && (
            <Text style={[styles.headerSubtitle, { fontSize: 13 * multiplier }]}>
              Settings
            </Text>
          )}
          <Text style={[styles.headerDescription, { fontSize: 14 * multiplier }]}>
            एप आफ्नो अनुसार अनुकूलन गर्नुहोस्
          </Text>
        </View>

        {/* Language Setting */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={[styles.settingIcon, { backgroundColor: colors.cardBlue }]}>
              <Ionicons name="language" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { fontSize: 16 * multiplier }]}>
                भाषा
              </Text>
              <Text style={[styles.settingSubtitle, { fontSize: 12 * multiplier }]}>
                Language
              </Text>
            </View>
          </View>
          
          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'nepali' && styles.languageButtonActive,
              ]}
              onPress={() => setLanguage('nepali')}
            >
              <Text style={[
                styles.languageButtonText,
                { fontSize: 14 * multiplier },
                language === 'nepali' && styles.languageButtonTextActive,
              ]}>
                नेपाली मात्र
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'english' && styles.languageButtonActive,
              ]}
              onPress={() => setLanguage('english')}
            >
              <Text style={[
                styles.languageButtonText,
                { fontSize: 14 * multiplier },
                language === 'english' && styles.languageButtonTextActive,
              ]}>
                नेपाली + English
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.settingNote, { fontSize: 12 * multiplier }]}>
            {language === 'english' 
              ? 'English subtitles will be shown below Nepali text'
              : 'अंग्रेजी अनुवाद देखाइने छैन'}
          </Text>
        </View>

        {/* Text Size Setting */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={[styles.settingIcon, { backgroundColor: colors.cardGreen }]}>
              <Ionicons name="text" size={24} color={colors.secondary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { fontSize: 16 * multiplier }]}>
                अक्षरको आकार
              </Text>
              <Text style={[styles.settingSubtitle, { fontSize: 12 * multiplier }]}>
                Text Size
              </Text>
            </View>
          </View>
          
          <View style={styles.textSizeOptions}>
            {textSizeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.textSizeButton,
                  textSize === option.value && styles.textSizeButtonActive,
                ]}
                onPress={() => setTextSize(option.value)}
              >
                <Text style={[
                  styles.textSizeLabel,
                  { fontSize: option.value === 'small' ? 12 : option.value === 'large' ? 18 : 15 },
                  textSize === option.value && styles.textSizeLabelActive,
                ]}>
                  अ
                </Text>
                <Text style={[
                  styles.textSizeText,
                  { fontSize: 12 * multiplier },
                  textSize === option.value && styles.textSizeTextActive,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.previewBox}>
            <Text style={[styles.previewLabel, { fontSize: 11 * multiplier }]}>
              पूर्वावलोकन:
            </Text>
            <Text style={[styles.previewText, { fontSize: 14 * multiplier }]}>
              यो अक्षरको आकार हो
            </Text>
          </View>
        </View>

        {/* Sound Setting */}
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingHeader}>
              <View style={[styles.settingIcon, { backgroundColor: colors.cardOrange }]}>
                <Ionicons name="volume-high" size={24} color={colors.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { fontSize: 16 * multiplier }]}>
                  आवाज
                </Text>
                <Text style={[styles.settingSubtitle, { fontSize: 12 * multiplier }]}>
                  Sound
                </Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={soundEnabled ? colors.primary : colors.textLight}
            />
          </View>
          <Text style={[styles.settingNote, { fontSize: 12 * multiplier }]}>
            {soundEnabled ? 'आवाज सक्रिय छ' : 'आवाज बन्द छ'}
          </Text>
        </View>

        {/* Reset Progress */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={[styles.settingIcon, { backgroundColor: colors.cardPink }]}>
              <Ionicons name="refresh" size={24} color={colors.error} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { fontSize: 16 * multiplier }]}>
                दैनिक प्रगति रिसेट
              </Text>
              <Text style={[styles.settingSubtitle, { fontSize: 12 * multiplier }]}>
                Reset Daily Progress
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetDailyProgress}
          >
            <Ionicons name="refresh" size={18} color={colors.error} />
            <Text style={[styles.resetButtonText, { fontSize: 14 * multiplier }]}>
              प्रगति रिसेट गर्नुहोस्
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.settingNote, { fontSize: 12 * multiplier }]}>
            यसले आजको दैनिक अभ्यासको प्रगति मेटाउनेछ
          </Text>
        </View>

        {/* About Section */}
        <View style={styles.aboutCard}>
          <Text style={[styles.aboutTitle, { fontSize: 17 * multiplier }]}>
            Autism Saathi बारेमा
          </Text>
          {language === 'english' && (
            <Text style={[styles.aboutTitleEn, { fontSize: 12 * multiplier }]}>
              About Autism Saathi
            </Text>
          )}
          
          <Text style={[styles.aboutText, { fontSize: 13 * multiplier }]}>
            यो एप नेपाली परिवारहरूको लागि बनाइएको हो जसका बच्चाहरूमा अटिजम छ। 
            यसले अभिभावकहरूलाई बच्चाको विकासमा सहयोग गर्न मद्दत गर्छ।
          </Text>
          
          <View style={styles.versionInfo}>
            <Text style={[styles.versionText, { fontSize: 12 * multiplier }]}>
              संस्करण 1.0.0
            </Text>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.helpCard}>
          <Ionicons name="help-circle" size={24} color={colors.info} />
          <View style={styles.helpContent}>
            <Text style={[styles.helpTitle, { fontSize: 15 * multiplier }]}>
              सहयोग चाहिन्छ?
            </Text>
            <Text style={[styles.helpText, { fontSize: 13 * multiplier }]}>
              कुनै समस्या वा सुझाव भए हामीलाई सम्पर्क गर्नुहोस्।
            </Text>
          </View>
        </View>
                        {/* Disclaimer Section */}
<View style={styles.settingCard}>
  <Ionicons name="alert-circle" size={24} color={colors.error} />
  <View style={{ marginTop: 8 }}>
    <Text style={[styles.disclaimerTitle, { fontSize: 15 * multiplier }]}>
      Disclaimer
    </Text>
    <Text style={[styles.disclaimerText, { fontSize: 13 * multiplier, marginTop: 4 }]}>
      This app does not replace professional medical diagnosis or treatment. 
      Please consult qualified healthcare professionals.
    </Text>
    <Text style={[styles.disclaimerText, { fontSize: 13 * multiplier, marginTop: 4 }]}>
  यो एप पेशेवर मेडिकल डायग्नोसिस वा उपचारको विकल्प होइन। 
  कृपया योग्य स्वास्थ्य पेशेवरसँग परामर्श गर्नुहोस्।
</Text>

  </View>
</View>


        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { fontSize: 12 * multiplier }]}>
            नेपालका परिवारहरूको लागि मायाले बनाइएको
          </Text>
          <Text style={[styles.footerSubtext, { fontSize: 11 * multiplier }]}>
            Made with love for Nepali families
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSection: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.cardBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: colors.textLight,
    marginBottom: 8,
  },
  headerDescription: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  settingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  settingSubtitle: {
    color: colors.textLight,
    marginTop: 2,
  },
  languageOptions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.cardBlue,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  languageButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: '#FFFFFF',
  },
  settingNote: {
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textSizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  textSizeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.cardGreen,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  textSizeButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondaryDark,
  },
  textSizeLabel: {
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 4,
  },
  textSizeLabelActive: {
    color: '#FFFFFF',
  },
  textSizeText: {
    color: colors.textSecondary,
  },
  textSizeTextActive: {
    color: '#FFFFFF',
  },
  previewBox: {
    backgroundColor: colors.borderLight,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  previewLabel: {
    color: colors.textLight,
    marginBottom: 4,
  },
  previewText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.cardPink,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.error,
  },
  resetButtonText: {
    color: colors.error,
    fontWeight: '600',
    marginLeft: 8,
  },
  aboutCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  aboutTitleEn: {
    color: colors.textLight,
    marginBottom: 12,
  },
  aboutText: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  versionInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    alignItems: 'center',
  },
  versionText: {
    color: colors.textLight,
  },
  helpCard: {
    backgroundColor: colors.cardBlue,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  helpContent: {
    flex: 1,
    marginLeft: 12,
  },
  helpTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  helpText: {
    color: colors.textSecondary,
  },
  disclaimerTitle: {
  color: colors.textPrimary,
  fontWeight: '700',
},
disclaimerText: {
  color: colors.textSecondary,
  lineHeight: 20,
},

  footer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  footerText: {
    color: colors.textSecondary,
  },
  footerSubtext: {
    color: colors.textLight,
    marginTop: 4,
  },
});
