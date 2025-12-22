import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './constants/colors';
import { useApp } from './context/AppContext';

interface InfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
}

function InfoCard({ icon, iconColor, title, titleEn, content, contentEn }: InfoCardProps) {
  const { language, getTextSizeMultiplier } = useApp();
  const multiplier = getTextSizeMultiplier();
  
  return (
    <View style={styles.infoCard}>
      <View style={[styles.iconBadge, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { fontSize: 16 * multiplier }]}>
          {title}
        </Text>
        {language === 'english' && titleEn && (
          <Text style={[styles.cardTitleEn, { fontSize: 12 * multiplier }]}>
            {titleEn}
          </Text>
        )}
        <Text style={[styles.cardText, { fontSize: 14 * multiplier }]}>
          {content}
        </Text>
        {language === 'english' && contentEn && (
          <Text style={[styles.cardTextEn, { fontSize: 12 * multiplier }]}>
            {contentEn}
          </Text>
        )}
      </View>
    </View>
  );
}

interface MythCardProps {
  myth: string;
  mythEn?: string;
  truth: string;
  truthEn?: string;
}

function MythCard({ myth, mythEn, truth, truthEn }: MythCardProps) {
  const { language, getTextSizeMultiplier } = useApp();
  const multiplier = getTextSizeMultiplier();
  
  return (
    <View style={styles.mythCard}>
      <View style={styles.mythSection}>
        <View style={styles.mythBadge}>
          <Ionicons name="close-circle" size={18} color={colors.error} />
          <Text style={[styles.mythLabel, { fontSize: 11 * multiplier }]}>भ्रम</Text>
        </View>
        <Text style={[styles.mythText, { fontSize: 14 * multiplier }]}>
          {myth}
        </Text>
        {language === 'english' && mythEn && (
          <Text style={[styles.mythTextEn, { fontSize: 11 * multiplier }]}>
            {mythEn}
          </Text>
        )}
      </View>
      <View style={styles.divider} />
      <View style={styles.truthSection}>
        <View style={styles.truthBadge}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={[styles.truthLabel, { fontSize: 11 * multiplier }]}>सत्य</Text>
        </View>
        <Text style={[styles.truthText, { fontSize: 14 * multiplier }]}>
          {truth}
        </Text>
        {language === 'english' && truthEn && (
          <Text style={[styles.truthTextEn, { fontSize: 11 * multiplier }]}>
            {truthEn}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function AutismInfoScreen() {
  const { language, getTextSizeMultiplier } = useApp();
  const multiplier = getTextSizeMultiplier();

  const infoCards = [
    {
      icon: 'heart-circle' as const,
      iconColor: colors.error,
      title: 'अटिजम रोग होइन',
      titleEn: 'Autism is not a disease',
      content: 'अटिजम एक न्यूरोडेभलपमेन्टल अवस्था हो। यो बच्चाको मस्तिष्कको विकासको फरक तरिका हो।',
      contentEn: 'Autism is a neurodevelopmental condition. It is a different way of brain development.',
    },
    {
      icon: 'sparkles' as const,
      iconColor: colors.accent,
      title: 'फरक, कमजोर होइन',
      titleEn: 'Different, not weak',
      content: 'अटिजम भएका बच्चाहरू "कमजोर" होइनन्। उनीहरू संसारलाई फरक तरिकाले बुझ्छन् र अनुभव गर्छन्।',
      contentEn: 'Children with autism are not "weak". They understand and experience the world differently.',
    },
    {
      icon: 'people' as const,
      iconColor: colors.primary,
      title: 'सामाजिक सम्बन्ध',
      titleEn: 'Social relationships',
      content: 'अटिजम भएका बच्चाहरूलाई अरूसँग सम्बन्ध बनाउन र कुराकानी गर्न गाह्रो हुन सक्छ।',
      contentEn: 'Children with autism may find it difficult to form relationships and communicate with others.',
    },
    {
      icon: 'repeat' as const,
      iconColor: colors.secondary,
      title: 'दोहोरिने व्यवहार',
      titleEn: 'Repetitive behavior',
      content: 'केही बच्चाहरू एउटै काम बारम्बार गर्न मन पराउँछन्। यो उनीहरूको सुरक्षित महसुस गर्ने तरिका हो।',
      contentEn: 'Some children like to do the same thing repeatedly. This is their way of feeling safe.',
    },
    {
      icon: 'bulb' as const,
      iconColor: '#9B7BD5',
      title: 'विशेष क्षमता',
      titleEn: 'Special abilities',
      content: 'धेरै अटिस्टिक बच्चाहरूमा विशेष प्रतिभा हुन्छ - जस्तै संगीत, कला, गणित वा स्मरणशक्ति।',
      contentEn: 'Many autistic children have special talents - like music, art, math, or memory.',
    },
  ];

  const myths = [
    {
      myth: '"अटिजम भएका बच्चाहरूले माया गर्दैनन्"',
      mythEn: '"Children with autism don\'t love"',
      truth: 'उनीहरू माया गर्छन्, तर फरक तरिकाले व्यक्त गर्छन्। आँखा मिलाउन नसक्नु भनेको माया नगर्नु होइन।',
      truthEn: 'They do love, but express it differently. Not making eye contact doesn\'t mean they don\'t care.',
    },
    {
      myth: '"यो आमाबाबुको गल्ती हो"',
      mythEn: '"It\'s the parents\' fault"',
      truth: 'अटिजम कसैको गल्ती होइन। यो जन्मजात अवस्था हो र पालनपोषणको तरिकाले हुँदैन।',
      truthEn: 'Autism is no one\'s fault. It is a congenital condition and is not caused by parenting style.',
    },
    {
      myth: '"अटिजम निको हुन्छ"',
      mythEn: '"Autism can be cured"',
      truth: 'अटिजम "निको" हुने रोग होइन। तर सही सहयोगले बच्चाको जीवन धेरै राम्रो बनाउन सकिन्छ।',
      truthEn: 'Autism is not a disease to be "cured". But proper support can greatly improve the child\'s life.',
    },
    {
      myth: '"सबै अटिस्टिक बच्चा एकै जस्ता हुन्छन्"',
      mythEn: '"All autistic children are the same"',
      truth: 'हरेक अटिस्टिक बच्चा फरक हुन्छ। "एउटा अटिस्टिक बच्चा चिन्नु भनेको सबै चिन्नु होइन।"',
      truthEn: 'Every autistic child is different. "Knowing one autistic child doesn\'t mean knowing all."',
    },
    {
      myth: '"अटिजम भएका बच्चा पढ्न सक्दैनन्"',
      mythEn: '"Children with autism can\'t learn"',
      truth: 'उनीहरू सिक्न सक्छन्, तर फरक तरिकाले। सही शिक्षण विधिले उनीहरूलाई धेरै कुरा सिकाउन सकिन्छ।',
      truthEn: 'They can learn, but differently. The right teaching methods can help them learn many things.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <Ionicons name="heart-circle" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { fontSize: 22 * multiplier }]}>
            अटिजम के हो?
          </Text>
          {language === 'english' && (
            <Text style={[styles.headerSubtitle, { fontSize: 14 * multiplier }]}>
              What is Autism?
            </Text>
          )}
          <Text style={[styles.headerDescription, { fontSize: 15 * multiplier }]}>
            अटिजम एक न्यूरोडेभलपमेन्टल अवस्था हो जसले बच्चाको सामाजिक सम्बन्ध, 
            कुराकानी र व्यवहारमा असर गर्छ।
          </Text>
        </View>

        {/* Info Cards */}
        <Text style={[styles.sectionTitle, { fontSize: 18 * multiplier }]}>
          मुख्य कुराहरू
        </Text>
        {language === 'english' && (
          <Text style={[styles.sectionSubtitle, { fontSize: 12 * multiplier }]}>
            Key Points
          </Text>
        )}

        {infoCards.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}

        {/* Myths Section */}
        <View style={styles.mythsHeader}>
          <Ionicons name="bulb-outline" size={24} color={colors.accent} />
          <Text style={[styles.sectionTitle, { fontSize: 18 * multiplier, marginLeft: 8, marginBottom: 0 }]}>
            भ्रम र सत्य
          </Text>
        </View>
        {language === 'english' && (
          <Text style={[styles.sectionSubtitle, { fontSize: 12 * multiplier }]}>
            Myths and Facts
          </Text>
        )}

        {myths.map((item, index) => (
          <MythCard key={index} {...item} />
        ))}

        {/* Encouragement */}
        <View style={styles.encouragementCard}>
          <Ionicons name="sunny" size={28} color={colors.accent} />
          <Text style={[styles.encouragementTitle, { fontSize: 16 * multiplier }]}>
            याद राख्नुहोस्
          </Text>
          <Text style={[styles.encouragementText, { fontSize: 14 * multiplier }]}>
            तपाईंको बच्चा अनमोल छ। सही सहयोग र माया दिनुहोस्। 
            हरेक सानो प्रगति ठूलो उपलब्धि हो।
          </Text>
          {language === 'english' && (
            <Text style={[styles.encouragementTextEn, { fontSize: 12 * multiplier }]}>
              Your child is precious. Give them the right support and love. 
              Every small progress is a big achievement.
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
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    marginBottom: 12,
  },
  headerDescription: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
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
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardTitleEn: {
    color: colors.textLight,
    marginBottom: 6,
  },
  cardText: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  cardTextEn: {
    color: colors.textLight,
    lineHeight: 18,
    marginTop: 6,
    fontStyle: 'italic',
  },
  mythsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  mythCard: {
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
  mythSection: {
    marginBottom: 12,
  },
  mythBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  mythLabel: {
    color: colors.error,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  mythText: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  mythTextEn: {
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  truthSection: {},
  truthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  truthLabel: {
    color: colors.success,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  truthText: {
    color: colors.textPrimary,
    lineHeight: 22,
    fontWeight: '500',
  },
  truthTextEn: {
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  encouragementCard: {
    backgroundColor: colors.cardYellow,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5C653',
  },
  encouragementTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 8,
  },
  encouragementText: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  encouragementTextEn: {
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
