import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, cardColors } from './constants/colors';
import { useApp } from './context/AppContext';

interface TherapyModule {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: keyof typeof Ionicons.glyphMap;
  colorIndex: number;
  exercises: number;
}

const therapyModules: TherapyModule[] = [
  {
    id: 'sound-imitation',
    title: 'आवाज अनुकरण',
    titleEn: 'Sound Imitation',
    description: 'सरल आवाजहरू सिक्ने - आ, ई, उ, ए, ओ',
    descriptionEn: 'Learn simple sounds - A, E, I, O, U',
    icon: 'volume-high',
    colorIndex: 0,
    exercises: 8,
  },
  {
    id: 'word-formation',
    title: 'शब्द बनाउने',
    titleEn: 'Word Formation',
    description: 'सरल शब्दहरू बोल्न सिक्ने',
    descriptionEn: 'Learn to speak simple words',
    icon: 'text',
    colorIndex: 1,
    exercises: 10,
  },
  {
    id: 'daily-words',
    title: 'दैनिक शब्दहरू',
    titleEn: 'Daily Life Words',
    description: 'घर, खाना, पानी, आमा, बाबा',
    descriptionEn: 'Home, food, water, mother, father',
    icon: 'home',
    colorIndex: 2,
    exercises: 12,
  },
  {
    id: 'social-words',
    title: 'सामाजिक शब्दहरू',
    titleEn: 'Social Words',
    description: 'नमस्ते, धन्यवाद, माफ गर्नुहोस्',
    descriptionEn: 'Hello, thank you, sorry',
    icon: 'people',
    colorIndex: 3,
    exercises: 8,
  },
];

export default function SpeechTherapyScreen() {
  const router = useRouter();
  const { language, getTextSizeMultiplier } = useApp();
  const multiplier = getTextSizeMultiplier();

  const handleModulePress = (moduleId: string) => {
    router.push({
      pathname: '/speech-module',
      params: { moduleId },
    });
  };

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
            <Ionicons name="chatbubbles" size={40} color={colors.accent} />
          </View>
          <Text style={[styles.headerTitle, { fontSize: 20 * multiplier }]}>
            स्पिच थेरापी
          </Text>
          {language === 'english' && (
            <Text style={[styles.headerSubtitle, { fontSize: 13 * multiplier }]}>
              Speech Therapy
            </Text>
          )}
          <Text style={[styles.headerDescription, { fontSize: 14 * multiplier }]}>
            बच्चालाई बोल्न र कुराकानी गर्न सिकाउने अभ्यासहरू। 
            दैनिक अभ्यासले राम्रो नतिजा दिन्छ।
          </Text>
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={22} color={colors.accent} />
            <Text style={[styles.tipsTitle, { fontSize: 15 * multiplier }]}>
              अभ्यासका लागि सुझाव
            </Text>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[styles.tipText, { fontSize: 13 * multiplier }]}>
                शान्त वातावरणमा अभ्यास गर्नुहोस्
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[styles.tipText, { fontSize: 13 * multiplier }]}>
                बच्चाको अनुहार हेरेर बोल्नुहोस्
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[styles.tipText, { fontSize: 13 * multiplier }]}>
                बिस्तारै र स्पष्ट बोल्नुहोस्
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[styles.tipText, { fontSize: 13 * multiplier }]}>
                प्रशंसा र प्रोत्साहन दिनुहोस्
              </Text>
            </View>
          </View>
        </View>

        {/* Modules */}
        <Text style={[styles.sectionTitle, { fontSize: 18 * multiplier }]}>
          अभ्यास मोड्युलहरू
        </Text>
        {language === 'english' && (
          <Text style={[styles.sectionSubtitle, { fontSize: 12 * multiplier }]}>
            Practice Modules
          </Text>
        )}

        {therapyModules.map((module) => {
          const cardColor = cardColors[module.colorIndex];
          return (
            <TouchableOpacity
              key={module.id}
              style={[styles.moduleCard, { backgroundColor: cardColor.bg, borderColor: cardColor.border }]}
              onPress={() => handleModulePress(module.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.moduleIcon, { backgroundColor: cardColor.border }]}>
                <Ionicons name={module.icon} size={28} color="#FFFFFF" />
              </View>
              <View style={styles.moduleContent}>
                <Text style={[styles.moduleTitle, { fontSize: 16 * multiplier }]}>
                  {module.title}
                </Text>
                {language === 'english' && (
                  <Text style={[styles.moduleTitleEn, { fontSize: 12 * multiplier }]}>
                    {module.titleEn}
                  </Text>
                )}
                <Text style={[styles.moduleDescription, { fontSize: 13 * multiplier }]}>
                  {module.description}
                </Text>
                <View style={styles.moduleFooter}>
                  <Ionicons name="book-outline" size={14} color={colors.textLight} />
                  <Text style={[styles.exerciseCount, { fontSize: 11 * multiplier }]}>
                    {module.exercises} अभ्यासहरू
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={cardColor.border} />
            </TouchableOpacity>
          );
        })}

        {/* Daily Practice Reminder */}
        <View style={styles.reminderCard}>
          <Ionicons name="time" size={24} color={colors.primary} />
          <View style={styles.reminderContent}>
            <Text style={[styles.reminderTitle, { fontSize: 15 * multiplier }]}>
              दैनिक अभ्यास
            </Text>
            <Text style={[styles.reminderText, { fontSize: 13 * multiplier }]}>
              दिनको १५-२० मिनेट अभ्यास गर्नुहोस्। नियमित अभ्यासले राम्रो नतिजा दिन्छ।
            </Text>
          </View>
        </View>

        {/* Parent Note */}
        <View style={styles.parentNote}>
          <Text style={[styles.parentNoteTitle, { fontSize: 15 * multiplier }]}>
            अभिभावकका लागि
          </Text>
          <Text style={[styles.parentNoteText, { fontSize: 13 * multiplier }]}>
            • बच्चालाई जबरजस्ती नगर्नुहोस्{'\n'}
            • खेलको माध्यमबाट सिकाउनुहोस्{'\n'}
            • सानो प्रगतिमा पनि प्रशंसा गर्नुहोस्{'\n'}
            • धैर्य राख्नुहोस्, समय लाग्छ
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
    backgroundColor: colors.cardOrange,
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
    marginBottom: 12,
  },
  headerDescription: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  tipsCard: {
    backgroundColor: colors.cardYellow,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5C653',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsList: {},
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  tipText: {
    color: colors.textSecondary,
    marginLeft: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: colors.textLight,
    marginBottom: 16,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  moduleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleContent: {
    flex: 1,
    marginLeft: 14,
  },
  moduleTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  moduleTitleEn: {
    color: colors.textLight,
    marginTop: 1,
  },
  moduleDescription: {
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  moduleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  exerciseCount: {
    color: colors.textLight,
    marginLeft: 4,
  },
  reminderCard: {
    backgroundColor: colors.cardBlue,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  reminderContent: {
    flex: 1,
    marginLeft: 12,
  },
  reminderTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  reminderText: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  parentNote: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  parentNoteTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 10,
  },
  parentNoteText: {
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
