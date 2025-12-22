import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './constants/colors';
import { useApp } from './context/AppContext';
import { 
  speakWithPronunciation, 
  practiceWord, 
  stopSpeaking,
  SpeechSpeed,
} from './utils/audioService';

const { width } = Dimensions.get('window');

interface VideoItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  duration: string;
  category: string;
  word: string;
  pronunciation: string;
}

const videos: VideoItem[] = [
  { id: '1', title: '"आ" आवाज सिक्ने', titleEn: 'Learning "Aa" sound', description: 'मुख खोलेर आवाज निकाल्ने', descriptionEn: 'Opening mouth to make sound', duration: '2:30', category: 'आवाज', word: 'आ', pronunciation: 'आ-आ-आ' },
  { id: '2', title: '"म" आवाज सिक्ने', titleEn: 'Learning "Ma" sound', description: 'होठ मिलाएर आवाज निकाल्ने', descriptionEn: 'Closing lips to make sound', duration: '2:15', category: 'आवाज', word: 'म', pronunciation: 'म-म-म' },
  { id: '3', title: '"आमा" शब्द सिक्ने', titleEn: 'Learning "Ama" word', description: 'पहिलो शब्द बोल्न सिक्ने', descriptionEn: 'Learning first word', duration: '3:00', category: 'शब्द', word: 'आमा', pronunciation: 'आ-मा' },
  { id: '4', title: '"बाबा" शब्द सिक्ने', titleEn: 'Learning "Baba" word', description: 'परिवारको शब्द सिक्ने', descriptionEn: 'Learning family word', duration: '2:45', category: 'शब्द', word: 'बाबा', pronunciation: 'बा-बा' },
  { id: '5', title: 'नमस्ते गर्ने तरिका', titleEn: 'How to say Namaste', description: 'हात जोडेर अभिवादन गर्ने', descriptionEn: 'Greeting with joined hands', duration: '2:00', category: 'सामाजिक', word: 'नमस्ते', pronunciation: 'न-म-स्ते' },
  { id: '6', title: 'धन्यवाद भन्ने', titleEn: 'Saying Thank you', description: 'कृतज्ञता व्यक्त गर्ने', descriptionEn: 'Expressing gratitude', duration: '1:45', category: 'सामाजिक', word: 'धन्यवाद', pronunciation: 'ध-न्य-वा-द' },
  { id: '7', title: 'खाना माग्ने', titleEn: 'Asking for food', description: '"मलाई खाना चाहिन्छ"', descriptionEn: '"I want food"', duration: '2:30', category: 'आवश्यकता', word: 'खाना', pronunciation: 'खा-ना' },
  { id: '8', title: 'पानी माग्ने', titleEn: 'Asking for water', description: '"मलाई पानी चाहिन्छ"', descriptionEn: '"I want water"', duration: '2:15', category: 'आवश्यकता', word: 'पानी', pronunciation: 'पा-नी' },
  { id: '9', title: 'रंगहरू चिन्ने', titleEn: 'Identifying colors', description: 'रातो, निलो, हरियो', descriptionEn: 'Red, blue, green', duration: '4:00', category: 'शिक्षा', word: 'रातो', pronunciation: 'रा-तो' },
  { id: '10', title: 'गिन्ती सिक्ने', titleEn: 'Learning counting', description: 'एक, दुई, तीन...', descriptionEn: 'One, two, three...', duration: '3:30', category: 'शिक्षा', word: 'एक', pronunciation: 'ए-क' },
  { id: '11', title: 'शरीरका अंगहरू', titleEn: 'Body parts', description: 'हात, खुट्टा, आँखा', descriptionEn: 'Hand, leg, eye', duration: '3:45', category: 'शिक्षा', word: 'हात', pronunciation: 'हा-त' },
  { id: '12', title: 'जनावरहरू', titleEn: 'Animals', description: 'कुकुर, बिरालो, गाई', descriptionEn: 'Dog, cat, cow', duration: '4:15', category: 'शिक्षा', word: 'कुकुर', pronunciation: 'कु-कुर' },
];

const categories = ['सबै', 'आवाज', 'शब्द', 'सामाजिक', 'आवश्यकता', 'शिक्षा'];

export default function VideoPracticeScreen() {
  const { language, getTextSizeMultiplier, soundEnabled } = useApp();
  const multiplier = getTextSizeMultiplier();
  const [selectedCategory, setSelectedCategory] = useState('सबै');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceProgress, setPracticeProgress] = useState({ current: 0, total: 0 });
  const [selectedSpeed, setSelectedSpeed] = useState<SpeechSpeed>('slow');
  
  // Animation
  const pulseAnim = useState(new Animated.Value(1))[0];

  const filteredVideos = selectedCategory === 'सबै' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  // Pulse animation for audio indicator
  useEffect(() => {
    if (isPlaying || isPracticing) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, isPracticing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleVideoPress = (video: VideoItem) => {
    stopSpeaking();
    setIsPlaying(false);
    setIsPracticing(false);
    setSelectedVideo(video);
  };

  const closeVideoPlayer = () => {
    stopSpeaking();
    setIsPlaying(false);
    setIsPracticing(false);
    setSelectedVideo(null);
  };

  const handlePlayAudio = useCallback(async (speed: SpeechSpeed) => {
    if (!soundEnabled) {
      Alert.alert(
        'आवाज बन्द छ',
        'कृपया सेटिङ्समा गएर आवाज सक्रिय गर्नुहोस्।',
        [{ text: 'ठीक छ' }]
      );
      return;
    }

    if (!selectedVideo) return;

    if (isPlaying || isPracticing) {
      await stopSpeaking();
      setIsPlaying(false);
      setIsPracticing(false);
      return;
    }

    setSelectedSpeed(speed);
    setIsPlaying(true);

    await speakWithPronunciation(
      selectedVideo.word,
      selectedVideo.pronunciation,
      speed,
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  }, [selectedVideo, soundEnabled, isPlaying, isPracticing]);

  const handlePractice = useCallback(async () => {
    if (!soundEnabled) {
      Alert.alert(
        'आवाज बन्द छ',
        'कृपया सेटिङ्समा गएर आवाज सक्रिय गर्नुहोस्।',
        [{ text: 'ठीक छ' }]
      );
      return;
    }

    if (!selectedVideo) return;

    if (isPracticing) {
      await stopSpeaking();
      setIsPracticing(false);
      setPracticeProgress({ current: 0, total: 0 });
      return;
    }

    setIsPracticing(true);

    await practiceWord(
      selectedVideo.word,
      3,
      () => setIsPracticing(true),
      (currentRep, total) => setPracticeProgress({ current: currentRep, total }),
      () => {
        setIsPracticing(false);
        setPracticeProgress({ current: 0, total: 0 });
      },
      () => {
        setIsPracticing(false);
        setPracticeProgress({ current: 0, total: 0 });
      }
    );
  }, [selectedVideo, soundEnabled, isPracticing]);

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
            <Ionicons name="play-circle" size={40} color="#9B7BD5" />
          </View>
          <Text style={[styles.headerTitle, { fontSize: 20 * multiplier }]}>
            भिडियो अभ्यास
          </Text>
          {language === 'english' && (
            <Text style={[styles.headerSubtitle, { fontSize: 13 * multiplier }]}>
              Video Practice
            </Text>
          )}
          <Text style={[styles.headerDescription, { fontSize: 14 * multiplier }]}>
            भिडियो हेरेर बच्चासँग अभ्यास गर्नुहोस्। 
            मुखको हलचाल र आवाज ध्यानपूर्वक हेर्नुहोस्।
          </Text>
        </View>

        {/* Video Player (when selected) */}
        {selectedVideo && (
          <View style={styles.videoPlayerContainer}>
            <View style={styles.videoPlayer}>
              <View style={styles.videoPlaceholder}>
                {(isPlaying || isPracticing) ? (
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Ionicons name="volume-high" size={64} color="#FFFFFF" />
                  </Animated.View>
                ) : (
                  <Ionicons name="play-circle" size={64} color="#FFFFFF" />
                )}
                <Text style={[styles.videoPlaceholderText, { fontSize: 16 * multiplier }]}>
                  {selectedVideo.title}
                </Text>
                {isPracticing && practiceProgress.total > 0 && (
                  <Text style={[styles.practiceIndicator, { fontSize: 14 * multiplier }]}>
                    अभ्यास {practiceProgress.current}/{practiceProgress.total}
                  </Text>
                )}
              </View>
            </View>

            {/* Word Display */}
            <View style={styles.wordDisplay}>
              <Text style={[styles.wordText, { fontSize: 48 * multiplier }]}>
                {selectedVideo.word}
              </Text>
              <TouchableOpacity 
                style={styles.pronunciationBadge}
                onPress={() => handlePlayAudio('slow')}
              >
                <Ionicons name="volume-high" size={18} color={colors.primary} />
                <Text style={[styles.pronunciationText, { fontSize: 16 * multiplier }]}>
                  {selectedVideo.pronunciation}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Speed Selection */}
            <View style={styles.speedContainer}>
              <Text style={[styles.speedLabel, { fontSize: 12 * multiplier }]}>
                गति:
              </Text>
              <TouchableOpacity
                style={[
                  styles.speedBtn,
                  selectedSpeed === 'slow' && styles.speedBtnActive,
                ]}
                onPress={() => handlePlayAudio('slow')}
              >
                <Text style={[
                  styles.speedBtnText,
                  { fontSize: 12 * multiplier },
                  selectedSpeed === 'slow' && styles.speedBtnTextActive,
                ]}>
                  बिस्तारै
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.speedBtn,
                  selectedSpeed === 'normal' && styles.speedBtnActive,
                ]}
                onPress={() => handlePlayAudio('normal')}
              >
                <Text style={[
                  styles.speedBtnText,
                  { fontSize: 12 * multiplier },
                  selectedSpeed === 'normal' && styles.speedBtnTextActive,
                ]}>
                  सामान्य
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.videoControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => handlePlayAudio('slow')}
              >
                <Ionicons name="play-back" size={28} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.playButton, isPlaying && styles.playButtonActive]}
                onPress={() => handlePlayAudio(selectedSpeed)}
              >
                <Ionicons 
                  name={isPlaying ? "stop" : "play"} 
                  size={32} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => handlePlayAudio('normal')}
              >
                <Ionicons name="play-forward" size={28} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.controlButton, isPracticing && styles.controlButtonActive]}
                onPress={handlePractice}
              >
                <Ionicons name="repeat" size={28} color={isPracticing ? '#FFFFFF' : colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.videoInfo}>
              <Text style={[styles.videoInfoTitle, { fontSize: 18 * multiplier }]}>
                {selectedVideo.title}
              </Text>
              {language === 'english' && (
                <Text style={[styles.videoInfoTitleEn, { fontSize: 13 * multiplier }]}>
                  {selectedVideo.titleEn}
                </Text>
              )}
              <Text style={[styles.videoInfoDescription, { fontSize: 14 * multiplier }]}>
                {selectedVideo.description}
              </Text>
            </View>

            <View style={styles.videoInstructions}>
              <Text style={[styles.instructionsTitle, { fontSize: 15 * multiplier }]}>
                अभिभावकका लागि निर्देशन:
              </Text>
              <Text style={[styles.instructionsText, { fontSize: 13 * multiplier }]}>
                • बच्चालाई आफ्नो छेउमा बसाउनुहोस्{'\n'}
                • आवाज सुनाउनुहोस् र मुखको हलचाल देखाउनुहोस्{'\n'}
                • बच्चालाई नक्कल गर्न प्रोत्साहित गर्नुहोस्{'\n'}
                • सफल प्रयासमा प्रशंसा गर्नुहोस्
              </Text>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity 
                style={[styles.actionBtn, isPlaying && styles.actionBtnActive]}
                onPress={() => handlePlayAudio(selectedSpeed)}
              >
                <Ionicons 
                  name={isPlaying ? "stop-circle" : "volume-high"} 
                  size={20} 
                  color={isPlaying ? '#FFFFFF' : colors.primary} 
                />
                <Text style={[
                  styles.actionBtnText, 
                  { fontSize: 13 * multiplier },
                  isPlaying && styles.actionBtnTextActive,
                ]}>
                  {isPlaying ? 'रोक्नुहोस्' : 'सुन्नुहोस्'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.practiceBtn, isPracticing && styles.practiceBtnActive]}
                onPress={handlePractice}
              >
                <Ionicons 
                  name={isPracticing ? "stop-circle" : "mic"} 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={[styles.actionBtnTextWhite, { fontSize: 13 * multiplier }]}>
                  {isPracticing ? 'रोक्नुहोस्' : 'अभ्यास (३x)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Practice Progress */}
            {isPracticing && practiceProgress.total > 0 && (
              <View style={styles.practiceProgressContainer}>
                <View style={styles.practiceProgressBar}>
                  <View 
                    style={[
                      styles.practiceProgressFill, 
                      { width: `${(practiceProgress.current / practiceProgress.total) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={[styles.practiceProgressText, { fontSize: 12 * multiplier }]}>
                  {practiceProgress.current} / {practiceProgress.total} पटक
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeVideoPlayer}
            >
              <Text style={[styles.closeButtonText, { fontSize: 14 * multiplier }]}>
                बन्द गर्नुहोस्
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                { fontSize: 13 * multiplier },
                selectedCategory === category && styles.categoryTextActive,
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Video List */}
        <Text style={[styles.sectionTitle, { fontSize: 16 * multiplier }]}>
          {filteredVideos.length} भिडियोहरू
        </Text>

        {filteredVideos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => handleVideoPress(video)}
            activeOpacity={0.7}
          >
            <View style={styles.videoThumbnail}>
              <Ionicons name="volume-high" size={24} color="#FFFFFF" />
              <Text style={styles.wordPreview}>{video.word}</Text>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{video.duration}</Text>
              </View>
            </View>
            <View style={styles.videoContent}>
              <Text style={[styles.videoTitle, { fontSize: 15 * multiplier }]}>
                {video.title}
              </Text>
              {language === 'english' && (
                <Text style={[styles.videoTitleEn, { fontSize: 11 * multiplier }]}>
                  {video.titleEn}
                </Text>
              )}
              <Text style={[styles.videoDescription, { fontSize: 12 * multiplier }]}>
                {video.description}
              </Text>
              <View style={styles.categoryBadge}>
                <Text style={[styles.categoryBadgeText, { fontSize: 10 * multiplier }]}>
                  {video.category}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        ))}

        {/* Audio Tips */}
        <View style={styles.audioTipsCard}>
          <Ionicons name="headset" size={20} color={colors.primary} />
          <View style={styles.audioTipsContent}>
            <Text style={[styles.audioTipsTitle, { fontSize: 14 * multiplier }]}>
              आवाज सुविधा
            </Text>
            <Text style={[styles.audioTipsText, { fontSize: 12 * multiplier }]}>
              • "बिस्तारै" - ढिलो गतिमा सुन्नुहोस्{'\n'}
              • "सामान्य" - सामान्य गतिमा सुन्नुहोस्{'\n'}
              • "अभ्यास" - ३ पटक दोहोरिन्छ
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color={colors.accent} />
            <Text style={[styles.tipsTitle, { fontSize: 15 * multiplier }]}>
              भिडियो अभ्यासका लागि सुझाव
            </Text>
          </View>
          <Text style={[styles.tipsText, { fontSize: 13 * multiplier }]}>
            • दिनको एक-दुई भिडियो मात्र हेर्नुहोस्{'\n'}
            • एउटै भिडियो धेरै पटक दोहोर्याउनुहोस्{'\n'}
            • बच्चा थाकेमा रोक्नुहोस्{'\n'}
            • खेलको रूपमा अभ्यास गर्नुहोस्
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
    backgroundColor: colors.cardPurple,
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
  videoPlayerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  videoPlayer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  videoPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#9B7BD5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontWeight: '600',
  },
  practiceIndicator: {
    color: '#FFFFFF',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wordDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  wordText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  pronunciationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBlue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pronunciationText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  speedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  speedLabel: {
    color: colors.textSecondary,
    marginRight: 8,
  },
  speedBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.cardBlue,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  speedBtnActive: {
    backgroundColor: colors.primary,
  },
  speedBtnText: {
    color: colors.primary,
    fontWeight: '600',
  },
  speedBtnTextActive: {
    color: '#FFFFFF',
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  controlButtonActive: {
    backgroundColor: colors.accent,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  playButtonActive: {
    backgroundColor: colors.accent,
  },
  videoInfo: {
    marginBottom: 16,
  },
  videoInfoTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  videoInfoTitleEn: {
    color: colors.textLight,
    marginTop: 2,
  },
  videoInfoDescription: {
    color: colors.textSecondary,
    marginTop: 6,
  },
  videoInstructions: {
    backgroundColor: colors.cardYellow,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  instructionsTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionsText: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.cardBlue,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionBtnActive: {
    backgroundColor: colors.primary,
  },
  practiceBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  practiceBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  actionBtnText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionBtnTextActive: {
    color: '#FFFFFF',
  },
  actionBtnTextWhite: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  practiceProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardOrange,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  practiceProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
    marginRight: 10,
  },
  practiceProgressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  practiceProgressText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeButtonText: {
    color: colors.textLight,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 12,
  },
  videoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#9B7BD5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  wordPreview: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  videoContent: {
    flex: 1,
    marginLeft: 12,
  },
  videoTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  videoTitleEn: {
    color: colors.textLight,
    marginTop: 1,
  },
  videoDescription: {
    color: colors.textSecondary,
    marginTop: 3,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cardPurple,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
  },
  categoryBadgeText: {
    color: '#9B7BD5',
    fontWeight: '600',
  },
  audioTipsCard: {
    backgroundColor: colors.cardBlue,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  audioTipsContent: {
    flex: 1,
    marginLeft: 10,
  },
  audioTipsTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  audioTipsText: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: colors.cardYellow,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5C653',
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
    lineHeight: 22,
  },
});
