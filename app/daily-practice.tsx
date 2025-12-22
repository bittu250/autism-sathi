import React from 'react';
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

interface PracticeItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: keyof typeof Ionicons.glyphMap;
  time: string;
}

interface RoutineSection {
  title: string;
  titleEn: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  items: PracticeItem[];
}

const routines: RoutineSection[] = [
  {
    title: 'बिहानको अभ्यास',
    titleEn: 'Morning Practice',
    icon: 'sunny',
    color: colors.accent,
    items: [
      { id: 'morning-1', title: 'नमस्ते गर्ने', titleEn: 'Saying Namaste', description: 'परिवारलाई नमस्ते गर्ने अभ्यास', descriptionEn: 'Practice greeting family', icon: 'hand-left', time: '2 मिनेट' },
      { id: 'morning-2', title: 'आफ्नो नाम भन्ने', titleEn: 'Saying own name', description: 'आफ्नो नाम बोल्ने अभ्यास', descriptionEn: 'Practice saying own name', icon: 'person', time: '3 मिनेट' },
      { id: 'morning-3', title: 'शरीरका अंग चिन्ने', titleEn: 'Identifying body parts', description: 'हात, खुट्टा, आँखा देखाउने', descriptionEn: 'Point to hand, leg, eye', icon: 'body', time: '5 मिनेट' },
    ],
  },
  {
    title: 'दिउँसोको अभ्यास',
    titleEn: 'Afternoon Practice',
    icon: 'partly-sunny',
    color: colors.primary,
    items: [
      { id: 'afternoon-1', title: 'वस्तुहरू नाम भन्ने', titleEn: 'Naming objects', description: 'घरका वस्तुहरूको नाम भन्ने', descriptionEn: 'Name household items', icon: 'cube', time: '5 मिनेट' },
      { id: 'afternoon-2', title: 'रंग चिन्ने', titleEn: 'Identifying colors', description: 'रातो, निलो, हरियो चिन्ने', descriptionEn: 'Identify red, blue, green', icon: 'color-palette', time: '5 मिनेट' },
      { id: 'afternoon-3', title: 'आवश्यकता व्यक्त गर्ने', titleEn: 'Expressing needs', description: '"मलाई पानी चाहिन्छ" भन्ने', descriptionEn: 'Say "I want water"', icon: 'chatbubble', time: '5 मिनेट' },
      { id: 'afternoon-4', title: 'गिन्ती अभ्यास', titleEn: 'Counting practice', description: 'एक, दुई, तीन गन्ने', descriptionEn: 'Count one, two, three', icon: 'calculator', time: '5 मिनेट' },
    ],
  },
  {
    title: 'बेलुकाको अभ्यास',
    titleEn: 'Evening Practice',
    icon: 'moon',
    color: '#9B7BD5',
    items: [
      { id: 'evening-1', title: 'दिनको समीक्षा', titleEn: 'Day review', description: 'आज के गर्यौ भन्ने', descriptionEn: 'What did we do today', icon: 'calendar', time: '5 मिनेट' },
      { id: 'evening-2', title: 'परिवारको नाम', titleEn: 'Family names', description: 'आमा, बाबा, दिदी भन्ने', descriptionEn: 'Say mom, dad, sister', icon: 'people', time: '3 मिनेट' },
      { id: 'evening-3', title: 'शुभरात्रि भन्ने', titleEn: 'Saying goodnight', description: 'सुत्नु अघि अभिवादन', descriptionEn: 'Greeting before sleep', icon: 'bed', time: '2 मिनेट' },
    ],
  },
];

export default function DailyPracticeScreen() {
  const { language, getTextSizeMultiplier, dailyProgress, toggleProgress } = useApp();
  const multiplier = getTextSizeMultiplier();

  const getTotalProgress = () => {
    const totalItems = routines.reduce((acc, r) => acc + r.items.length, 0);
    const completedItems = Object.values(dailyProgress).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const getRoutineProgress = (routine: RoutineSection) => {
    const completed = routine.items.filter(item => dailyProgress[item.id]).length;
    return { completed, total: routine.items.length };
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
            <Ionicons name="calendar" size={40} color={colors.accent} />
          </View>
          <Text style={[styles.headerTitle, { fontSize: 20 * multiplier }]}>
            दैनिक अभ्यास
          </Text>
          {language === 'english' && (
            <Text style={[styles.headerSubtitle, { fontSize: 13 * multiplier }]}>
              Daily Practice
            </Text>
          )}
          <Text style={[styles.headerDescription, { fontSize: 14 * multiplier }]}>
            नियमित अभ्यासले बच्चाको विकासमा ठूलो मद्दत गर्छ। 
            हरेक दिन यी अभ्यासहरू गर्नुहोस्।
          </Text>
        </View>

        {/* Overall Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Ionicons name="trophy" size={24} color={colors.accent} />
            <Text style={[styles.progressTitle, { fontSize: 16 * multiplier }]}>
              आजको प्रगति
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${getTotalProgress()}%` }]} />
            </View>
            <Text style={[styles.progressPercent, { fontSize: 18 * multiplier }]}>
              {getTotalProgress()}%
            </Text>
          </View>
          <Text style={[styles.progressSubtext, { fontSize: 12 * multiplier }]}>
            {Object.values(dailyProgress).filter(Boolean).length} / {routines.reduce((acc, r) => acc + r.items.length, 0)} अभ्यास पूरा
          </Text>
        </View>

        {/* Routines */}
        {routines.map((routine, routineIndex) => {
          const progress = getRoutineProgress(routine);
          return (
            <View key={routineIndex} style={styles.routineSection}>
              <View style={[styles.routineHeader, { backgroundColor: routine.color + '15' }]}>
                <View style={[styles.routineIconContainer, { backgroundColor: routine.color }]}>
                  <Ionicons name={routine.icon} size={24} color="#FFFFFF" />
                </View>
                <View style={styles.routineInfo}>
                  <Text style={[styles.routineTitle, { fontSize: 17 * multiplier }]}>
                    {routine.title}
                  </Text>
                  {language === 'english' && (
                    <Text style={[styles.routineTitleEn, { fontSize: 12 * multiplier }]}>
                      {routine.titleEn}
                    </Text>
                  )}
                </View>
                <View style={styles.routineProgress}>
                  <Text style={[styles.routineProgressText, { fontSize: 13 * multiplier, color: routine.color }]}>
                    {progress.completed}/{progress.total}
                  </Text>
                </View>
              </View>

              <View style={styles.practiceItems}>
                {routine.items.map((item) => {
                  const isCompleted = dailyProgress[item.id];
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.practiceItem, isCompleted && styles.practiceItemCompleted]}
                      onPress={() => toggleProgress(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.checkbox,
                        isCompleted && { backgroundColor: colors.success, borderColor: colors.success }
                      ]}>
                        {isCompleted && (
                          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        )}
                      </View>
                      <View style={[styles.itemIcon, { backgroundColor: routine.color + '20' }]}>
                        <Ionicons name={item.icon} size={20} color={routine.color} />
                      </View>
                      <View style={styles.itemContent}>
                        <Text style={[
                          styles.itemTitle, 
                          { fontSize: 15 * multiplier },
                          isCompleted && styles.itemTitleCompleted
                        ]}>
                          {item.title}
                        </Text>
                        {language === 'english' && (
                          <Text style={[styles.itemTitleEn, { fontSize: 11 * multiplier }]}>
                            {item.titleEn}
                          </Text>
                        )}
                        <Text style={[styles.itemDescription, { fontSize: 12 * multiplier }]}>
                          {item.description}
                        </Text>
                        <View style={styles.itemTime}>
                          <Ionicons name="time-outline" size={12} color={colors.textLight} />
                          <Text style={[styles.itemTimeText, { fontSize: 11 * multiplier }]}>
                            {item.time}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Encouragement */}
        <View style={styles.encouragementCard}>
          <Ionicons name="heart" size={28} color={colors.error} />
          <Text style={[styles.encouragementTitle, { fontSize: 16 * multiplier }]}>
            शाबास! 🎉
          </Text>
          <Text style={[styles.encouragementText, { fontSize: 14 * multiplier }]}>
            हरेक सानो प्रयास ठूलो उपलब्धि हो। बच्चालाई प्रोत्साहन दिनुहोस्।
          </Text>
          {language === 'english' && (
            <Text style={[styles.encouragementTextEn, { fontSize: 12 * multiplier }]}>
              Every small effort is a big achievement. Encourage your child.
            </Text>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color={colors.accent} />
            <Text style={[styles.tipsTitle, { fontSize: 15 * multiplier }]}>
              अभ्यासका लागि सुझाव
            </Text>
          </View>
          <Text style={[styles.tipsText, { fontSize: 13 * multiplier }]}>
            • बच्चालाई जबरजस्ती नगर्नुहोस्{'\n'}
            • खेलको माध्यमबाट सिकाउनुहोस्{'\n'}
            • एकै पटक धेरै नगर्नुहोस्{'\n'}
            • बच्चा थाकेमा विश्राम दिनुहोस्{'\n'}
            • सानो प्रगतिमा पनि प्रशंसा गर्नुहोस्
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
    backgroundColor: colors.cardYellow,
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
  progressCard: {
    backgroundColor: colors.cardYellow,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5C653',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginLeft: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 6,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 6,
  },
  progressPercent: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  progressSubtext: {
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  routineSection: {
    marginBottom: 16,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
  },
  routineIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineInfo: {
    flex: 1,
    marginLeft: 12,
  },
  routineTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  routineTitleEn: {
    color: colors.textLight,
    marginTop: 2,
  },
  routineProgress: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  routineProgressText: {
    fontWeight: '700',
  },
  practiceItems: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  practiceItemCompleted: {
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
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  itemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  itemTitleEn: {
    color: colors.textLight,
    marginTop: 1,
  },
  itemDescription: {
    color: colors.textSecondary,
    marginTop: 3,
  },
  itemTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  itemTimeText: {
    color: colors.textLight,
    marginLeft: 4,
  },
  encouragementCard: {
    backgroundColor: colors.cardPink,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F8D7DA',
  },
  encouragementTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
  },
  encouragementText: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  encouragementTextEn: {
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
  tipsCard: {
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
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipsTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsText: {
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
