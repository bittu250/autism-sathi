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

interface GuideSection {
  id: string;
  title: string;
  titleEn: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  content: string[];
  contentEn: string[];
}

const guideSections: GuideSection[] = [
  {
    id: 'communication',
    title: 'बच्चासँग कसरी कुरा गर्ने',
    titleEn: 'How to talk to your child',
    icon: 'chatbubbles',
    color: colors.primary,
    content: [
      'बच्चाको आँखाको स्तरमा बसेर कुरा गर्नुहोस्',
      'सरल र छोटा वाक्य प्रयोग गर्नुहोस्',
      'बिस्तारै र स्पष्ट बोल्नुहोस्',
      'बच्चाले बुझ्ने समय दिनुहोस्',
      'एकै पटक धेरै कुरा नभन्नुहोस्',
      'बच्चाको प्रतिक्रियाको पर्खनुहोस्',
      'हाउभाउ र अनुहारको भाव प्रयोग गर्नुहोस्',
    ],
    contentEn: [
      'Sit at your child\'s eye level when talking',
      'Use simple and short sentences',
      'Speak slowly and clearly',
      'Give time for the child to understand',
      'Don\'t say too many things at once',
      'Wait for the child\'s response',
      'Use gestures and facial expressions',
    ],
  },
  {
    id: 'donts',
    title: 'के नगर्ने',
    titleEn: 'What NOT to do',
    icon: 'close-circle',
    color: colors.error,
    content: [
      'गाली वा रिस नगर्नुहोस्',
      'जबरजस्ती बोलाउन नलगाउनुहोस्',
      'अरू बच्चासँग तुलना नगर्नुहोस्',
      'बच्चालाई "बोल्दैन" भनेर नभन्नुहोस्',
      'लाज मान्नुहोस् भन्ने नसिकाउनुहोस्',
      'बच्चालाई एक्लो नछोड्नुहोस्',
      'धेरै टिभी वा मोबाइल नदिनुहोस्',
    ],
    contentEn: [
      'Don\'t scold or get angry',
      'Don\'t force the child to speak',
      'Don\'t compare with other children',
      'Don\'t say "he/she doesn\'t talk"',
      'Don\'t teach to feel ashamed',
      'Don\'t leave the child alone',
      'Don\'t give too much TV or mobile',
    ],
  },
  {
    id: 'stigma',
    title: 'सामाजिक कलंक (स्टिग्मा) सामना गर्ने',
    titleEn: 'Dealing with social stigma',
    icon: 'shield',
    color: '#9B7BD5',
    content: [
      'अटिजम लुकाउनु पर्दैन - यो लाजको कुरा होइन',
      'परिवार र साथीहरूलाई बुझाउनुहोस्',
      'अरूको गलत टिप्पणीमा ध्यान नदिनुहोस्',
      'समान अनुभव भएका अभिभावकसँग भेट्नुहोस्',
      'बच्चाको क्षमतामा विश्वास राख्नुहोस्',
      'सकारात्मक सोच राख्नुहोस्',
      'आफ्नो मानसिक स्वास्थ्यको पनि ख्याल राख्नुहोस्',
    ],
    contentEn: [
      'Don\'t hide autism - it\'s not shameful',
      'Educate family and friends',
      'Ignore negative comments from others',
      'Meet parents with similar experiences',
      'Believe in your child\'s abilities',
      'Stay positive',
      'Take care of your own mental health too',
    ],
  },
  {
    id: 'family',
    title: 'परिवारको भूमिका',
    titleEn: 'Role of family',
    icon: 'people',
    color: colors.secondary,
    content: [
      'सबै परिवारले बच्चालाई स्वीकार गर्नुपर्छ',
      'हजुरआमा-हजुरबुबालाई पनि बुझाउनुहोस्',
      'दाजुभाइ-दिदीबहिनीलाई सहयोग गर्न सिकाउनुहोस्',
      'सबैले एकै तरिकाले व्यवहार गर्नुपर्छ',
      'बच्चालाई सामाजिक कार्यक्रममा लैजानुहोस्',
      'परिवारको समय (family time) दिनुहोस्',
      'सबैले धैर्य राख्नुपर्छ',
    ],
    contentEn: [
      'All family members should accept the child',
      'Educate grandparents too',
      'Teach siblings to help',
      'Everyone should behave consistently',
      'Take the child to social events',
      'Give family time',
      'Everyone should be patient',
    ],
  },
  {
    id: 'daily-life',
    title: 'दैनिक जीवनमा सहयोग',
    titleEn: 'Support in daily life',
    icon: 'home',
    color: colors.accent,
    content: [
      'नियमित दिनचर्या बनाउनुहोस्',
      'खाना, सुत्ने, खेल्ने समय निश्चित राख्नुहोस्',
      'परिवर्तन अघि बच्चालाई तयार गर्नुहोस्',
      'शान्त र सुरक्षित वातावरण दिनुहोस्',
      'बच्चाको रुचि अनुसार खेल खेलाउनुहोस्',
      'सानो-सानो काम गर्न सिकाउनुहोस्',
      'स्वतन्त्र हुन मद्दत गर्नुहोस्',
    ],
    contentEn: [
      'Create a regular routine',
      'Keep fixed times for eating, sleeping, playing',
      'Prepare the child before changes',
      'Provide a calm and safe environment',
      'Play games according to child\'s interests',
      'Teach small tasks',
      'Help them become independent',
    ],
  },
  {
    id: 'self-care',
    title: 'अभिभावकको आत्म-हेरचाह',
    titleEn: 'Parent self-care',
    icon: 'heart',
    color: colors.error,
    content: [
      'आफ्नो लागि पनि समय निकाल्नुहोस्',
      'थकान महसुस गर्दा विश्राम लिनुहोस्',
      'अरू अभिभावकसँग अनुभव साझा गर्नुहोस्',
      'पेशेवर सहयोग लिन नहिचकिचाउनुहोस्',
      'आफ्नो भावना व्यक्त गर्नुहोस्',
      'सकारात्मक सोच राख्नुहोस्',
      'सानो उपलब्धिमा पनि खुसी मनाउनुहोस्',
    ],
    contentEn: [
      'Take time for yourself too',
      'Rest when you feel tired',
      'Share experiences with other parents',
      'Don\'t hesitate to seek professional help',
      'Express your feelings',
      'Stay positive',
      'Celebrate small achievements',
    ],
  },
];

export default function ParentGuideScreen() {
  const { language, getTextSizeMultiplier } = useApp();
  const multiplier = getTextSizeMultiplier();
  const [expandedSection, setExpandedSection] = useState<string | null>('communication');

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
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
            <Ionicons name="people" size={40} color={colors.error} />
          </View>
          <Text style={[styles.headerTitle, { fontSize: 20 * multiplier }]}>
            अभिभावकका लागि
          </Text>
          {language === 'english' && (
            <Text style={[styles.headerSubtitle, { fontSize: 13 * multiplier }]}>
              For Parents & Caregivers
            </Text>
          )}
          <Text style={[styles.headerDescription, { fontSize: 14 * multiplier }]}>
            तपाईं एक्लो हुनुहुन्न। यो यात्रामा हामी तपाईंसँग छौं। 
            यहाँ केही महत्त्वपूर्ण सुझावहरू छन्।
          </Text>
        </View>

        {/* Encouragement Card */}
        <View style={styles.encouragementCard}>
          <Ionicons name="heart" size={24} color={colors.error} />
          <Text style={[styles.encouragementText, { fontSize: 14 * multiplier }]}>
            तपाईं राम्रो अभिभावक हुनुहुन्छ। तपाईंको माया र धैर्यले बच्चाको जीवनमा ठूलो फरक ल्याउँछ।
          </Text>
        </View>

        {/* Guide Sections */}
        {guideSections.map((section) => (
          <View key={section.id} style={styles.sectionContainer}>
            <TouchableOpacity
              style={[styles.sectionHeader, { backgroundColor: section.color + '15', borderColor: section.color }]}
              onPress={() => toggleSection(section.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.sectionIcon, { backgroundColor: section.color }]}>
                <Ionicons name={section.icon} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.sectionInfo}>
                <Text style={[styles.sectionTitle, { fontSize: 16 * multiplier }]}>
                  {section.title}
                </Text>
                {language === 'english' && (
                  <Text style={[styles.sectionTitleEn, { fontSize: 12 * multiplier }]}>
                    {section.titleEn}
                  </Text>
                )}
              </View>
              <Ionicons
                name={expandedSection === section.id ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={section.color}
              />
            </TouchableOpacity>

            {expandedSection === section.id && (
              <View style={styles.sectionContent}>
                {section.content.map((item, index) => (
                  <View key={index} style={styles.contentItem}>
                    <View style={[styles.bullet, { backgroundColor: section.color }]} />
                    <View style={styles.contentTextContainer}>
                      <Text style={[styles.contentText, { fontSize: 14 * multiplier }]}>
                        {item}
                      </Text>
                      {language === 'english' && section.contentEn[index] && (
                        <Text style={[styles.contentTextEn, { fontSize: 11 * multiplier }]}>
                          {section.contentEn[index]}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Support Resources */}
        <View style={styles.resourcesCard}>
          <Text style={[styles.resourcesTitle, { fontSize: 17 * multiplier }]}>
            सहयोग स्रोतहरू
          </Text>
          {language === 'english' && (
            <Text style={[styles.resourcesTitleEn, { fontSize: 12 * multiplier }]}>
              Support Resources
            </Text>
          )}

          <View style={styles.resourceItem}>
            <Ionicons name="business" size={20} color={colors.primary} />
            <View style={styles.resourceInfo}>
              <Text style={[styles.resourceName, { fontSize: 14 * multiplier }]}>
                Autism Care Nepal Society
              </Text>
              <Text style={[styles.resourceDetail, { fontSize: 12 * multiplier }]}>
                अटिजम सम्बन्धी जानकारी र सहयोग
              </Text>
            </View>
          </View>

          <View style={styles.resourceItem}>
            <Ionicons name="medical" size={20} color={colors.primary} />
            <View style={styles.resourceInfo}>
              <Text style={[styles.resourceName, { fontSize: 14 * multiplier }]}>
                त्रिवि शिक्षण अस्पताल
              </Text>
              <Text style={[styles.resourceDetail, { fontSize: 12 * multiplier }]}>
                बाल मनोचिकित्सा विभाग
              </Text>
            </View>
          </View>

          <View style={styles.resourceItem}>
            <Ionicons name="school" size={20} color={colors.primary} />
            <View style={styles.resourceInfo}>
              <Text style={[styles.resourceName, { fontSize: 14 * multiplier }]}>
                विशेष शिक्षा केन्द्रहरू
              </Text>
              <Text style={[styles.resourceDetail, { fontSize: 12 * multiplier }]}>
                स्थानीय विशेष शिक्षा सेवाहरू
              </Text>
            </View>
          </View>
        </View>

        {/* Final Encouragement */}
        <View style={styles.finalCard}>
          <Ionicons name="sunny" size={32} color={colors.accent} />
          <Text style={[styles.finalTitle, { fontSize: 18 * multiplier }]}>
            याद राख्नुहोस्
          </Text>
          <Text style={[styles.finalText, { fontSize: 14 * multiplier }]}>
            हरेक बच्चा आफ्नै गतिमा बढ्छ। तपाईंको माया, धैर्य र निरन्तर प्रयासले 
            बच्चाको जीवनमा अद्भुत परिवर्तन ल्याउन सक्छ।
          </Text>
          {language === 'english' && (
            <Text style={[styles.finalTextEn, { fontSize: 12 * multiplier }]}>
              Every child grows at their own pace. Your love, patience, and continuous effort 
              can bring amazing changes in your child's life.
            </Text>
          )}
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
    backgroundColor: colors.cardPink,
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
  encouragementCard: {
    backgroundColor: colors.cardPink,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F8D7DA',
  },
  encouragementText: {
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  sectionContainer: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sectionTitleEn: {
    color: colors.textLight,
    marginTop: 2,
  },
  sectionContent: {
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
  contentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  contentTextContainer: {
    flex: 1,
  },
  contentText: {
    color: colors.textPrimary,
    lineHeight: 22,
  },
  contentTextEn: {
    color: colors.textLight,
    marginTop: 2,
    fontStyle: 'italic',
  },
  resourcesCard: {
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
  resourcesTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  resourcesTitleEn: {
    color: colors.textLight,
    marginBottom: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  resourceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resourceName: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  resourceDetail: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  finalCard: {
    backgroundColor: colors.cardYellow,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5C653',
  },
  finalTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 10,
  },
  finalText: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  finalTextEn: {
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
