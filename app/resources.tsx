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

interface TherapistContact {
  id: string;
  name: string;
  nameEn: string;
  specialty: string;
  specialtyEn: string;
  location: string;
  locationEn: string;
  phone?: string;
}

interface SchoolReadinessItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const therapists: TherapistContact[] = [
  { id: '1', name: 'त्रिवि शिक्षण अस्पताल', nameEn: 'TU Teaching Hospital', specialty: 'बाल मनोचिकित्सा', specialtyEn: 'Child Psychiatry', location: 'महाराजगंज, काठमाडौं', locationEn: 'Maharajgunj, Kathmandu' },
  { id: '2', name: 'Autism Care Nepal', nameEn: 'Autism Care Nepal', specialty: 'अटिजम सहयोग सेवा', specialtyEn: 'Autism Support Services', location: 'काठमाडौं', locationEn: 'Kathmandu' },
  { id: '3', name: 'कान्ति बाल अस्पताल', nameEn: 'Kanti Children\'s Hospital', specialty: 'बाल विकास विभाग', specialtyEn: 'Child Development', location: 'महाराजगंज, काठमाडौं', locationEn: 'Maharajgunj, Kathmandu' },
  { id: '4', name: 'पाटन अस्पताल', nameEn: 'Patan Hospital', specialty: 'बाल मनोचिकित्सा', specialtyEn: 'Child Psychiatry', location: 'ललितपुर', locationEn: 'Lalitpur' },
  { id: '5', name: 'Nepal Disabled Women Association', nameEn: 'Nepal Disabled Women Association', specialty: 'विशेष शिक्षा', specialtyEn: 'Special Education', location: 'काठमाडौं', locationEn: 'Kathmandu' },
];

const schoolReadiness: SchoolReadinessItem[] = [
  { id: '1', title: 'आफ्नो नाम भन्न सक्ने', titleEn: 'Can say own name', description: 'बच्चाले आफ्नो नाम बोल्न सक्नुपर्छ', descriptionEn: 'Child should be able to say their name', icon: 'person' },
  { id: '2', title: 'सरल निर्देशन पालना', titleEn: 'Follow simple instructions', description: '"बस", "उठ" जस्ता निर्देशन बुझ्ने', descriptionEn: 'Understand commands like "sit", "stand"', icon: 'ear' },
  { id: '3', title: 'शौचालय प्रयोग', titleEn: 'Toilet use', description: 'शौचालय जाने बताउन सक्ने', descriptionEn: 'Can indicate need to use toilet', icon: 'water' },
  { id: '4', title: 'अरूसँग बस्न सक्ने', titleEn: 'Can sit with others', description: 'समूहमा केही समय बस्न सक्ने', descriptionEn: 'Can sit in a group for some time', icon: 'people' },
  { id: '5', title: 'आफ्नो सामान चिन्ने', titleEn: 'Recognize own belongings', description: 'आफ्नो झोला, जुत्ता चिन्ने', descriptionEn: 'Recognize own bag, shoes', icon: 'bag' },
  { id: '6', title: 'खाना खान सक्ने', titleEn: 'Can eat independently', description: 'आफैं खाना खान सक्ने', descriptionEn: 'Can eat food independently', icon: 'restaurant' },
];

export default function ResourcesScreen() {
  const { language, getTextSizeMultiplier } = useApp();
  const multiplier = getTextSizeMultiplier();
  const [activeTab, setActiveTab] = useState<'therapists' | 'school' | 'progress'>('therapists');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getReadinessProgress = () => {
    return Math.round((checkedItems.size / schoolReadiness.length) * 100);
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
            <Ionicons name="book" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { fontSize: 20 * multiplier }]}>
            थप स्रोतहरू
          </Text>
          {language === 'english' && (
            <Text style={[styles.headerSubtitle, { fontSize: 13 * multiplier }]}>
              Additional Resources
            </Text>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'therapists' && styles.tabActive]}
            onPress={() => setActiveTab('therapists')}
          >
            <Ionicons 
              name="medical" 
              size={18} 
              color={activeTab === 'therapists' ? '#FFFFFF' : colors.textSecondary} 
            />
            <Text style={[
              styles.tabText, 
              { fontSize: 12 * multiplier },
              activeTab === 'therapists' && styles.tabTextActive
            ]}>
              थेरापिस्ट
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'school' && styles.tabActive]}
            onPress={() => setActiveTab('school')}
          >
            <Ionicons 
              name="school" 
              size={18} 
              color={activeTab === 'school' ? '#FFFFFF' : colors.textSecondary} 
            />
            <Text style={[
              styles.tabText, 
              { fontSize: 12 * multiplier },
              activeTab === 'school' && styles.tabTextActive
            ]}>
              स्कूल तयारी
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'progress' && styles.tabActive]}
            onPress={() => setActiveTab('progress')}
          >
            <Ionicons 
              name="trending-up" 
              size={18} 
              color={activeTab === 'progress' ? '#FFFFFF' : colors.textSecondary} 
            />
            <Text style={[
              styles.tabText, 
              { fontSize: 12 * multiplier },
              activeTab === 'progress' && styles.tabTextActive
            ]}>
              प्रगति
            </Text>
          </TouchableOpacity>
        </View>

        {/* Therapists Tab */}
        {activeTab === 'therapists' && (
          <View>
            <Text style={[styles.sectionTitle, { fontSize: 17 * multiplier }]}>
              नेपालमा थेरापिस्ट सम्पर्क
            </Text>
            {language === 'english' && (
              <Text style={[styles.sectionSubtitle, { fontSize: 12 * multiplier }]}>
                Therapist Contacts in Nepal
              </Text>
            )}

            {therapists.map((therapist) => (
              <View key={therapist.id} style={styles.therapistCard}>
                <View style={styles.therapistIcon}>
                  <Ionicons name="medical" size={24} color={colors.primary} />
                </View>
                <View style={styles.therapistInfo}>
                  <Text style={[styles.therapistName, { fontSize: 15 * multiplier }]}>
                    {therapist.name}
                  </Text>
                  {language === 'english' && therapist.name !== therapist.nameEn && (
                    <Text style={[styles.therapistNameEn, { fontSize: 11 * multiplier }]}>
                      {therapist.nameEn}
                    </Text>
                  )}
                  <Text style={[styles.therapistSpecialty, { fontSize: 13 * multiplier }]}>
                    {therapist.specialty}
                  </Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color={colors.textLight} />
                    <Text style={[styles.therapistLocation, { fontSize: 12 * multiplier }]}>
                      {therapist.location}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.contactButton}>
                  <Ionicons name="call" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.noteCard}>
              <Ionicons name="information-circle" size={20} color={colors.info} />
              <Text style={[styles.noteText, { fontSize: 12 * multiplier }]}>
                भेट्नु अघि फोन गरेर समय लिनुहोस्। विशेषज्ञको सल्लाह महत्त्वपूर्ण छ।
              </Text>
            </View>
          </View>
        )}

        {/* School Readiness Tab */}
        {activeTab === 'school' && (
          <View>
            <Text style={[styles.sectionTitle, { fontSize: 17 * multiplier }]}>
              स्कूल तयारी चेकलिस्ट
            </Text>
            {language === 'english' && (
              <Text style={[styles.sectionSubtitle, { fontSize: 12 * multiplier }]}>
                School Readiness Checklist
              </Text>
            )}

            <View style={styles.progressCard}>
              <Text style={[styles.progressLabel, { fontSize: 14 * multiplier }]}>
                तयारी प्रगति
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${getReadinessProgress()}%` }]} />
                </View>
                <Text style={[styles.progressPercent, { fontSize: 16 * multiplier }]}>
                  {getReadinessProgress()}%
                </Text>
              </View>
            </View>

            {schoolReadiness.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.readinessItem,
                  checkedItems.has(item.id) && styles.readinessItemChecked,
                ]}
                onPress={() => toggleCheck(item.id)}
              >
                <View style={[
                  styles.checkbox,
                  checkedItems.has(item.id) && styles.checkboxChecked,
                ]}>
                  {checkedItems.has(item.id) && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <View style={[styles.readinessIcon, { backgroundColor: colors.cardBlue }]}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.readinessContent}>
                  <Text style={[
                    styles.readinessTitle, 
                    { fontSize: 14 * multiplier },
                    checkedItems.has(item.id) && styles.readinessTitleChecked,
                  ]}>
                    {item.title}
                  </Text>
                  {language === 'english' && (
                    <Text style={[styles.readinessTitleEn, { fontSize: 11 * multiplier }]}>
                      {item.titleEn}
                    </Text>
                  )}
                  <Text style={[styles.readinessDescription, { fontSize: 12 * multiplier }]}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.noteCard}>
              <Ionicons name="bulb" size={20} color={colors.accent} />
              <Text style={[styles.noteText, { fontSize: 12 * multiplier }]}>
                यो चेकलिस्ट सामान्य मार्गदर्शन हो। हरेक बच्चा फरक हुन्छ। 
                विशेषज्ञसँग परामर्श गर्नुहोस्।
              </Text>
            </View>
          </View>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <View>
            <Text style={[styles.sectionTitle, { fontSize: 17 * multiplier }]}>
              प्रगति ट्र्याकिङ
            </Text>
            {language === 'english' && (
              <Text style={[styles.sectionSubtitle, { fontSize: 12 * multiplier }]}>
                Progress Tracking
              </Text>
            )}

            <View style={styles.progressOverview}>
              <View style={styles.progressStat}>
                <View style={[styles.statIcon, { backgroundColor: colors.cardBlue }]}>
                  <Ionicons name="calendar" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.statValue, { fontSize: 24 * multiplier }]}>0</Text>
                <Text style={[styles.statLabel, { fontSize: 12 * multiplier }]}>
                  दिन अभ्यास
                </Text>
              </View>
              <View style={styles.progressStat}>
                <View style={[styles.statIcon, { backgroundColor: colors.cardGreen }]}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.secondary} />
                </View>
                <Text style={[styles.statValue, { fontSize: 24 * multiplier }]}>0</Text>
                <Text style={[styles.statLabel, { fontSize: 12 * multiplier }]}>
                  पूरा भएको
                </Text>
              </View>
              <View style={styles.progressStat}>
                <View style={[styles.statIcon, { backgroundColor: colors.cardOrange }]}>
                  <Ionicons name="trophy" size={24} color={colors.accent} />
                </View>
                <Text style={[styles.statValue, { fontSize: 24 * multiplier }]}>0</Text>
                <Text style={[styles.statLabel, { fontSize: 12 * multiplier }]}>
                  उपलब्धि
                </Text>
              </View>
            </View>

            <View style={styles.milestoneCard}>
              <Text style={[styles.milestoneTitle, { fontSize: 16 * multiplier }]}>
                हालको लक्ष्य
              </Text>
              <View style={styles.milestoneItem}>
                <Ionicons name="flag" size={20} color={colors.primary} />
                <Text style={[styles.milestoneText, { fontSize: 14 * multiplier }]}>
                  दैनिक अभ्यास नियमित गर्ने
                </Text>
              </View>
              <View style={styles.milestoneProgress}>
                <View style={styles.milestoneBar}>
                  <View style={[styles.milestoneFill, { width: '0%' }]} />
                </View>
                <Text style={[styles.milestonePercent, { fontSize: 12 * multiplier }]}>
                  0%
                </Text>
              </View>
            </View>

            <View style={styles.noteCard}>
              <Ionicons name="information-circle" size={20} color={colors.info} />
              <Text style={[styles.noteText, { fontSize: 12 * multiplier }]}>
                यो प्रगति ट्र्याकिङ सुविधा भविष्यमा थप विकास हुनेछ। 
                अहिलेको लागि दैनिक अभ्यास पृष्ठमा प्रगति हेर्नुहोस्।
              </Text>
            </View>
          </View>
        )}
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
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#FFFFFF',
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
  therapistCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  therapistIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  therapistInfo: {
    flex: 1,
    marginLeft: 12,
  },
  therapistName: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  therapistNameEn: {
    color: colors.textLight,
    marginTop: 1,
  },
  therapistSpecialty: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  therapistLocation: {
    color: colors.textLight,
    marginLeft: 4,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteCard: {
    backgroundColor: colors.cardBlue,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  noteText: {
    color: colors.textSecondary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  progressCard: {
    backgroundColor: colors.cardGreen,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  progressLabel: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 5,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 5,
  },
  progressPercent: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  readinessItem: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  readinessItemChecked: {
    backgroundColor: colors.cardGreen,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  readinessIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  readinessContent: {
    flex: 1,
  },
  readinessTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  readinessTitleChecked: {
    textDecorationLine: 'line-through',
  },
  readinessTitleEn: {
    color: colors.textLight,
    marginTop: 1,
  },
  readinessDescription: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  progressOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  milestoneCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  milestoneTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 12,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneText: {
    color: colors.textSecondary,
    marginLeft: 10,
  },
  milestoneProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginRight: 10,
  },
  milestoneFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  milestonePercent: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
