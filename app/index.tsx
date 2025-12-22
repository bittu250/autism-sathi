import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, cardColors } from './constants/colors';
import { images } from './constants/images';
import { useApp } from './context/AppContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface NavCardProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  image?: string;
  colorIndex: number;
  onPress: () => void;
}

function NavCard({ title, subtitle, icon, image, colorIndex, onPress }: NavCardProps) {
  const { getTextSizeMultiplier } = useApp();
  const multiplier = getTextSizeMultiplier();
  const cardColor = cardColors[colorIndex % cardColors.length];
  
  return (
    <TouchableOpacity 
      style={[styles.navCard, { backgroundColor: cardColor.bg, borderColor: cardColor.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.cardImage} />
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: cardColor.border }]}>
          <Ionicons name={icon} size={32} color="#FFFFFF" />
        </View>
      )}
      <Text style={[styles.cardTitle, { fontSize: 15 * multiplier }]} numberOfLines={2}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.cardSubtitle, { fontSize: 11 * multiplier }]} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { language, getTextSizeMultiplier } = useApp();
  const multiplier = getTextSizeMultiplier();

  const navigationItems = [
    {
      title: 'अटिजम के हो?',
      subtitle: 'What is Autism?',
      icon: 'heart-circle' as const,
      image: images.autismInfo,
      route: '/autism-info',
    },
    {
      title: 'लक्षणहरू',
      subtitle: 'Early Signs',
      icon: 'eye' as const,
      image: images.signs,
      route: '/signs',
    },
    {
      title: 'स्पिच थेरापी',
      subtitle: 'Speech Therapy',
      icon: 'chatbubbles' as const,
      image: images.speechTherapy,
      route: '/speech-therapy',
    },
    {
      title: 'भिडियो अभ्यास',
      subtitle: 'Video Practice',
      icon: 'play-circle' as const,
      image: images.videoTherapy,
      route: '/video-practice',
    },
    {
      title: 'अभिभावकका लागि',
      subtitle: 'For Parents',
      icon: 'people' as const,
      image: images.parentGuide,
      route: '/parent-guide',
    },
    {
      title: 'दैनिक अभ्यास',
      subtitle: 'Daily Practice',
      icon: 'calendar' as const,
      image: images.dailyPractice,
      route: '/daily-practice',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.appTitle, { fontSize: 24 * multiplier }]}>
              Autism Saathi
            </Text>
            <Text style={[styles.appSubtitle, { fontSize: 14 * multiplier }]}>
              अटिजम साथी
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Image source={{ uri: images.hero }} style={styles.heroImage} />
          <View style={styles.welcomeOverlay}>
            <Text style={[styles.welcomeTitle, { fontSize: 20 * multiplier }]}>
              नमस्ते! स्वागत छ 🙏
            </Text>
            <Text style={[styles.welcomeText, { fontSize: 14 * multiplier }]}>
              तपाईंको बच्चाको विकासमा हामी साथ छौं।
            </Text>
            {language === 'english' && (
              <Text style={[styles.welcomeSubtext, { fontSize: 12 * multiplier }]}>
                We are here to support your child's development.
              </Text>
            )}
          </View>
        </View>

        {/* Encouragement Card */}
        <View style={styles.encouragementCard}>
          <Ionicons name="heart" size={20} color={colors.error} />
          <Text style={[styles.encouragementText, { fontSize: 13 * multiplier }]}>
            हरेक बच्चा विशेष छ। धैर्य र माया सबैभन्दा ठूलो औषधि हो।
          </Text>
        </View>

        {/* Navigation Cards */}
        <Text style={[styles.sectionTitle, { fontSize: 18 * multiplier }]}>
          के सिक्ने?
        </Text>
        {language === 'english' && (
          <Text style={[styles.sectionSubtitle, { fontSize: 12 * multiplier }]}>
            What would you like to learn?
          </Text>
        )}

        <View style={styles.cardsGrid}>
          {navigationItems.map((item, index) => (
            <NavCard
              key={item.route}
              title={item.title}
              subtitle={language === 'english' ? item.subtitle : undefined}
              icon={item.icon}
              image={item.image}
              colorIndex={index}
              onPress={() => router.push(item.route as any)}
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/resources')}
          >
            <Ionicons name="book-outline" size={20} color={colors.primary} />
            <Text style={[styles.quickActionText, { fontSize: 13 * multiplier }]}>
              थप स्रोतहरू
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="language-outline" size={20} color={colors.primary} />
            <Text style={[styles.quickActionText, { fontSize: 13 * multiplier }]}>
              भाषा बदल्नुहोस्
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { fontSize: 11 * multiplier }]}>
            नेपालका परिवारहरूको लागि बनाइएको
          </Text>
          <Text style={[styles.footerSubtext, { fontSize: 10 * multiplier }]}>
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
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  appSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeSection: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  welcomeOverlay: {
    padding: 16,
  },
  welcomeTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeText: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  welcomeSubtext: {
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  encouragementCard: {
    backgroundColor: colors.cardPink,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F8D7DA',
  },
  encouragementText: {
    color: colors.textPrimary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
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
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navCard: {
    width: cardWidth,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 10,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardSubtitle: {
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    color: colors.textSecondary,
  },
  footerSubtext: {
    color: colors.textLight,
    marginTop: 4,
  },
});
