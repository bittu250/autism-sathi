import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './constants/colors';
import { useApp } from './context/AppContext';

interface AgeGroupData {
  age: string;
  ageEn: string;
  color: string;
  signs: {
    nepali: string;
    english: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[];
}

const ageGroups: AgeGroupData[] = [
  {
    age: '१-२ वर्ष',
    ageEn: '1-2 Years',
    color: colors.primary,
    signs: [
      { nepali: 'नाम बोलाउँदा प्रतिक्रिया नदिने', english: 'Does not respond when name is called', icon: 'ear' },
      { nepali: 'आँखा मिलाउन नसक्ने', english: 'Difficulty making eye contact', icon: 'eye-off' },
      { nepali: 'औंला देखाएर कुरा नगर्ने', english: 'Does not point to show things', icon: 'hand-left' },
      { nepali: 'हाँसो वा मुस्कान कम', english: 'Less smiling or laughing', icon: 'happy' },
      { nepali: 'बाबुआमाको अनुहार नहेर्ने', english: 'Does not look at parents\' faces', icon: 'people' },
      { nepali: 'खेलौना सँग असामान्य खेल्ने', english: 'Unusual play with toys', icon: 'cube' },
      { nepali: 'एक्लै बस्न रुचाउने', english: 'Prefers to be alone', icon: 'person' },
      { nepali: 'बोली विकास ढिलो', english: 'Delayed speech development', icon: 'chatbubble' },
    ],
  },
  {
    age: '२-३ वर्ष',
    ageEn: '2-3 Years',
    color: colors.secondary,
    signs: [
      { nepali: 'शब्दहरू नबोल्ने वा कम बोल्ने', english: 'Does not speak or speaks very little', icon: 'chatbubble-ellipses' },
      { nepali: 'अरू बच्चासँग नखेल्ने', english: 'Does not play with other children', icon: 'people-circle' },
      { nepali: 'एउटै काम बारम्बार गर्ने', english: 'Repeats the same action over and over', icon: 'repeat' },
      { nepali: 'परिवर्तनमा रिसाउने', english: 'Gets upset with changes', icon: 'swap-horizontal' },
      { nepali: 'कुनै एउटा कुरामा मात्र ध्यान', english: 'Intense focus on one thing only', icon: 'search' },
      { nepali: 'आफ्नो नाम भन्न नसक्ने', english: 'Cannot say own name', icon: 'person-circle' },
      { nepali: 'हातमा हात राखेर घुमाउने', english: 'Hand flapping or spinning', icon: 'sync' },
      { nepali: 'आवाज वा बत्तीमा असामान्य प्रतिक्रिया', english: 'Unusual reaction to sounds or lights', icon: 'flash' },
    ],
  },
  {
    age: '३-५ वर्ष',
    ageEn: '3-5 Years',
    color: colors.accent,
    signs: [
      { nepali: 'कल्पनाशील खेल नखेल्ने', english: 'Does not engage in pretend play', icon: 'color-wand' },
      { nepali: 'साथीहरू बनाउन गाह्रो', english: 'Difficulty making friends', icon: 'people' },
      { nepali: 'भावना बुझ्न र व्यक्त गर्न कठिन', english: 'Difficulty understanding and expressing emotions', icon: 'heart' },
      { nepali: 'एउटै विषयमा मात्र कुरा गर्ने', english: 'Talks only about one topic', icon: 'chatbubbles' },
      { nepali: 'नियम र दिनचर्यामा कडा', english: 'Rigid about rules and routines', icon: 'list' },
      { nepali: 'शारीरिक स्पर्श मन नपराउने', english: 'Does not like physical touch', icon: 'hand-right' },
      { nepali: 'असामान्य बोलीको लय', english: 'Unusual speech rhythm', icon: 'musical-notes' },
      { nepali: 'खाना खानमा छनौट', english: 'Very picky about food', icon: 'restaurant' },
    ],
  },
];

export default function SignsScreen() {
  const { language, getTextSizeMultiplier } = useApp();
  const multiplier = getTextSizeMultiplier();
  const [expandedGroup, setExpandedGroup] = useState<number | null>(0);

  const toggleGroup = (index: number) => {
    setExpandedGroup(expandedGroup === index ? null : index);
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
            <Ionicons name="eye" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { fontSize: 20 * multiplier }]}>
            प्रारम्भिक लक्षणहरू
          </Text>
          {language === 'english' && (
            <Text style={[styles.headerSubtitle, { fontSize: 13 * multiplier }]}>
              Early Signs of Autism
            </Text>
          )}
          <Text style={[styles.headerDescription, { fontSize: 14 * multiplier }]}>
            यी लक्षणहरू देखिएमा विशेषज्ञसँग परामर्श लिनुहोस्। 
            चाँडो पहिचानले बच्चालाई धेरै मद्दत गर्छ।
          </Text>
        </View>

        {/* Age Groups */}
        {ageGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.ageGroupContainer}>
            <TouchableOpacity 
              style={[styles.ageGroupHeader, { backgroundColor: group.color + '15', borderColor: group.color }]}
              onPress={() => toggleGroup(groupIndex)}
              activeOpacity={0.7}
            >
              <View style={[styles.ageBadge, { backgroundColor: group.color }]}>
                <Text style={[styles.ageText, { fontSize: 16 * multiplier }]}>
                  {group.age}
                </Text>
              </View>
              <View style={styles.ageInfo}>
                {language === 'english' && (
                  <Text style={[styles.ageTextEn, { fontSize: 12 * multiplier }]}>
                    {group.ageEn}
                  </Text>
                )}
                <Text style={[styles.signsCount, { fontSize: 12 * multiplier }]}>
                  {group.signs.length} लक्षणहरू
                </Text>
              </View>
              <Ionicons 
                name={expandedGroup === groupIndex ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                color={group.color} 
              />
            </TouchableOpacity>

            {expandedGroup === groupIndex && (
              <View style={styles.signsContainer}>
                {group.signs.map((sign, signIndex) => (
                  <View key={signIndex} style={styles.signItem}>
                    <View style={[styles.signIcon, { backgroundColor: group.color + '20' }]}>
                      <Ionicons name={sign.icon} size={20} color={group.color} />
                    </View>
                    <View style={styles.signContent}>
                      <Text style={[styles.signText, { fontSize: 14 * multiplier }]}>
                        {sign.nepali}
                      </Text>
                      {language === 'english' && (
                        <Text style={[styles.signTextEn, { fontSize: 11 * multiplier }]}>
                          {sign.english}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Important Note */}
        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Ionicons name="information-circle" size={24} color={colors.info} />
            <Text style={[styles.noteTitle, { fontSize: 16 * multiplier }]}>
              महत्त्वपूर्ण कुरा
            </Text>
          </View>
          <Text style={[styles.noteText, { fontSize: 14 * multiplier }]}>
            • यी लक्षणहरू देखिनु भनेको निश्चित रूपमा अटिजम हो भन्ने होइन।{'\n'}
            • केही बच्चाहरूमा विकास ढिलो हुन सक्छ तर अटिजम नहुन सक्छ।{'\n'}
            • सही निदानको लागि विशेषज्ञ डाक्टरसँग जानुहोस्।{'\n'}
            • नेपालमा बाल मनोचिकित्सक वा बाल विकास विशेषज्ञसँग भेट्नुहोस्।
          </Text>
          {language === 'english' && (
            <Text style={[styles.noteTextEn, { fontSize: 12 * multiplier }]}>
              These signs don't necessarily mean autism. Consult a child psychiatrist or developmental specialist in Nepal for proper diagnosis.
            </Text>
          )}
        </View>

        {/* Encouragement */}
        <View style={styles.encouragementCard}>
          <Ionicons name="heart" size={24} color={colors.error} />
          <Text style={[styles.encouragementText, { fontSize: 14 * multiplier }]}>
            चिन्ता नगर्नुहोस्। चाँडो पहिचान र सहयोगले बच्चाको जीवनमा ठूलो फरक ल्याउँछ।
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.contactCard}>
          <Text style={[styles.contactTitle, { fontSize: 16 * multiplier }]}>
            नेपालमा सम्पर्क
          </Text>
          <View style={styles.contactItem}>
            <Ionicons name="medical" size={20} color={colors.primary} />
            <Text style={[styles.contactText, { fontSize: 13 * multiplier }]}>
              त्रिवि शिक्षण अस्पताल - बाल मनोचिकित्सा विभाग
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="business" size={20} color={colors.primary} />
            <Text style={[styles.contactText, { fontSize: 13 * multiplier }]}>
              Autism Care Nepal Society
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="school" size={20} color={colors.primary} />
            <Text style={[styles.contactText, { fontSize: 13 * multiplier }]}>
              स्थानीय विशेष शिक्षा केन्द्रहरू
            </Text>
          </View>
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
    backgroundColor: colors.cardGreen,
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
  ageGroupContainer: {
    marginBottom: 12,
  },
  ageGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
  },
  ageBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ageText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  ageInfo: {
    flex: 1,
    marginLeft: 12,
  },
  ageTextEn: {
    color: colors.textLight,
  },
  signsCount: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  signsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginTop: 8,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  signItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  signIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  signContent: {
    flex: 1,
  },
  signText: {
    color: colors.textPrimary,
    lineHeight: 22,
  },
  signTextEn: {
    color: colors.textLight,
    marginTop: 2,
    fontStyle: 'italic',
  },
  noteCard: {
    backgroundColor: colors.cardBlue,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginLeft: 8,
  },
  noteText: {
    color: colors.textSecondary,
    lineHeight: 24,
  },
  noteTextEn: {
    color: colors.textLight,
    marginTop: 12,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  encouragementCard: {
    backgroundColor: colors.cardPink,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F8D7DA',
  },
  encouragementText: {
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  contactCard: {
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
  contactTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
});
