import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './constants/colors';
import { useApp } from './context/AppContext';
import { 
  initializeAudioService, 
  speakWithPronunciation, 
  practiceWord, 
  stopSpeaking,
  isNepaliAvailable,
  SpeechSpeed,
} from './utils/audioService';

interface Exercise {
  id: string;
  nepali: string;
  english: string;
  pronunciation: string;
  instruction: string;
  instructionEn: string;
}

interface ModuleData {
  title: string;
  titleEn: string;
  description: string;
  exercises: Exercise[];
}

const moduleData: Record<string, ModuleData> = {
  'sound-imitation': {
    title: 'आवाज अनुकरण',
    titleEn: 'Sound Imitation',
    description: 'सरल आवाजहरू सिक्ने अभ्यास',
    exercises: [
      { id: '1', nepali: 'आ', english: 'Aa', pronunciation: 'आ-आ-आ', instruction: 'मुख खोलेर "आ" बोल्नुहोस्', instructionEn: 'Open mouth and say "Aa"' },
      { id: '2', nepali: 'ई', english: 'Ee', pronunciation: 'ई-ई-ई', instruction: 'होठ फैलाएर "ई" बोल्नुहोस्', instructionEn: 'Spread lips and say "Ee"' },
      { id: '3', nepali: 'उ', english: 'Oo', pronunciation: 'उ-उ-उ', instruction: 'होठ गोलो बनाएर "उ" बोल्नुहोस्', instructionEn: 'Round lips and say "Oo"' },
      { id: '4', nepali: 'ए', english: 'E', pronunciation: 'ए-ए-ए', instruction: 'होठ थोरै खोलेर "ए" बोल्नुहोस्', instructionEn: 'Slightly open lips and say "E"' },
      { id: '5', nepali: 'ओ', english: 'O', pronunciation: 'ओ-ओ-ओ', instruction: 'होठ गोलो बनाएर "ओ" बोल्नुहोस्', instructionEn: 'Round lips and say "O"' },
      { id: '6', nepali: 'म', english: 'Ma', pronunciation: 'म-म-म', instruction: 'होठ मिलाएर "म" बोल्नुहोस्', instructionEn: 'Close lips and say "Ma"' },
      { id: '7', nepali: 'प', english: 'Pa', pronunciation: 'प-प-प', instruction: 'होठ मिलाएर "प" बोल्नुहोस्', instructionEn: 'Close lips and say "Pa"' },
      { id: '8', nepali: 'ब', english: 'Ba', pronunciation: 'ब-ब-ब', instruction: 'होठ मिलाएर "ब" बोल्नुहोस्', instructionEn: 'Close lips and say "Ba"' },
    ],
  },
  'word-formation': {
    title: 'शब्द बनाउने',
    titleEn: 'Word Formation',
    description: 'सरल शब्दहरू बोल्न सिक्ने',
    exercises: [
      { id: '1', nepali: 'आमा', english: 'Mother', pronunciation: 'आ-मा', instruction: 'बिस्तारै "आ-मा" बोल्नुहोस्', instructionEn: 'Slowly say "Aa-ma"' },
      { id: '2', nepali: 'बाबा', english: 'Father', pronunciation: 'बा-बा', instruction: 'बिस्तारै "बा-बा" बोल्नुहोस्', instructionEn: 'Slowly say "Ba-ba"' },
      { id: '3', nepali: 'दादा', english: 'Brother', pronunciation: 'दा-दा', instruction: 'बिस्तारै "दा-दा" बोल्नुहोस्', instructionEn: 'Slowly say "Da-da"' },
      { id: '4', nepali: 'दिदी', english: 'Sister', pronunciation: 'दि-दी', instruction: 'बिस्तारै "दि-दी" बोल्नुहोस्', instructionEn: 'Slowly say "Di-di"' },
      { id: '5', nepali: 'हजुरआमा', english: 'Grandmother', pronunciation: 'ह-जुर-आ-मा', instruction: 'बिस्तारै बोल्नुहोस्', instructionEn: 'Say slowly' },
      { id: '6', nepali: 'हजुरबुबा', english: 'Grandfather', pronunciation: 'ह-जुर-बु-बा', instruction: 'बिस्तारै बोल्नुहोस्', instructionEn: 'Say slowly' },
      { id: '7', nepali: 'बच्चा', english: 'Baby', pronunciation: 'ब-च्चा', instruction: 'बिस्तारै "ब-च्चा" बोल्नुहोस्', instructionEn: 'Slowly say "Ba-cha"' },
      { id: '8', nepali: 'नानी', english: 'Little girl', pronunciation: 'ना-नी', instruction: 'बिस्तारै "ना-नी" बोल्नुहोस्', instructionEn: 'Slowly say "Na-ni"' },
      { id: '9', nepali: 'बाबु', english: 'Little boy', pronunciation: 'बा-बु', instruction: 'बिस्तारै "बा-बु" बोल्नुहोस्', instructionEn: 'Slowly say "Ba-bu"' },
      { id: '10', nepali: 'साथी', english: 'Friend', pronunciation: 'सा-थी', instruction: 'बिस्तारै "सा-थी" बोल्नुहोस्', instructionEn: 'Slowly say "Sa-thi"' },
    ],
  },
  'daily-words': {
    title: 'दैनिक शब्दहरू',
    titleEn: 'Daily Life Words',
    description: 'दैनिक जीवनमा प्रयोग हुने शब्दहरू',
    exercises: [
      { id: '1', nepali: 'घर', english: 'Home', pronunciation: 'घ-र', instruction: '"घर" बोल्नुहोस्', instructionEn: 'Say "Ghar"' },
      { id: '2', nepali: 'खाना', english: 'Food', pronunciation: 'खा-ना', instruction: '"खाना" बोल्नुहोस्', instructionEn: 'Say "Khana"' },
      { id: '3', nepali: 'पानी', english: 'Water', pronunciation: 'पा-नी', instruction: '"पानी" बोल्नुहोस्', instructionEn: 'Say "Pani"' },
      { id: '4', nepali: 'दूध', english: 'Milk', pronunciation: 'दू-ध', instruction: '"दूध" बोल्नुहोस्', instructionEn: 'Say "Dudh"' },
      { id: '5', nepali: 'भात', english: 'Rice', pronunciation: 'भा-त', instruction: '"भात" बोल्नुहोस्', instructionEn: 'Say "Bhat"' },
      { id: '6', nepali: 'रोटी', english: 'Bread', pronunciation: 'रो-टी', instruction: '"रोटी" बोल्नुहोस्', instructionEn: 'Say "Roti"' },
      { id: '7', nepali: 'फल', english: 'Fruit', pronunciation: 'फ-ल', instruction: '"फल" बोल्नुहोस्', instructionEn: 'Say "Phal"' },
      { id: '8', nepali: 'तरकारी', english: 'Vegetable', pronunciation: 'त-र-का-री', instruction: '"तरकारी" बोल्नुहोस्', instructionEn: 'Say "Tarkari"' },
      { id: '9', nepali: 'लुगा', english: 'Clothes', pronunciation: 'लु-गा', instruction: '"लुगा" बोल्नुहोस्', instructionEn: 'Say "Luga"' },
      { id: '10', nepali: 'जुत्ता', english: 'Shoes', pronunciation: 'जु-त्ता', instruction: '"जुत्ता" बोल्नुहोस्', instructionEn: 'Say "Jutta"' },
      { id: '11', nepali: 'बिस्तरा', english: 'Bed', pronunciation: 'बि-स्त-रा', instruction: '"बिस्तरा" बोल्नुहोस्', instructionEn: 'Say "Bistara"' },
      { id: '12', nepali: 'खेलौना', english: 'Toy', pronunciation: 'खे-लौ-ना', instruction: '"खेलौना" बोल्नुहोस्', instructionEn: 'Say "Khelauna"' },
    ],
  },
  'social-words': {
    title: 'सामाजिक शब्दहरू',
    titleEn: 'Social Words',
    description: 'सामाजिक व्यवहारका शब्दहरू',
    exercises: [
      { id: '1', nepali: 'नमस्ते', english: 'Hello', pronunciation: 'न-म-स्ते', instruction: 'हात जोडेर "नमस्ते" बोल्नुहोस्', instructionEn: 'Join hands and say "Namaste"' },
      { id: '2', nepali: 'धन्यवाद', english: 'Thank you', pronunciation: 'ध-न्य-वा-द', instruction: '"धन्यवाद" बोल्नुहोस्', instructionEn: 'Say "Dhanyabad"' },
      { id: '3', nepali: 'माफ गर्नुहोस्', english: 'Sorry', pronunciation: 'मा-फ गर्-नु-होस्', instruction: '"माफ गर्नुहोस्" बोल्नुहोस्', instructionEn: 'Say "Maaf garnuhos"' },
      { id: '4', nepali: 'कृपया', english: 'Please', pronunciation: 'कृ-प-या', instruction: '"कृपया" बोल्नुहोस्', instructionEn: 'Say "Kripaya"' },
      { id: '5', nepali: 'हो', english: 'Yes', pronunciation: 'हो', instruction: '"हो" बोल्नुहोस्', instructionEn: 'Say "Ho"' },
      { id: '6', nepali: 'होइन', english: 'No', pronunciation: 'हो-इ-न', instruction: '"होइन" बोल्नुहोस्', instructionEn: 'Say "Hoina"' },
      { id: '7', nepali: 'बाई बाई', english: 'Bye bye', pronunciation: 'बा-ई बा-ई', instruction: 'हात हल्लाएर "बाई बाई" बोल्नुहोस्', instructionEn: 'Wave and say "Bye bye"' },
      { id: '8', nepali: 'मलाई चाहिन्छ', english: 'I want', pronunciation: 'म-ला-ई चा-हि-न्छ', instruction: '"मलाई चाहिन्छ" बोल्नुहोस्', instructionEn: 'Say "Malai chahincha"' },
    ],
  },
};

export default function SpeechModuleScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const { language, getTextSizeMultiplier, soundEnabled } = useApp();
  const multiplier = getTextSizeMultiplier();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceProgress, setPracticeProgress] = useState({ current: 0, total: 0 });
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<SpeechSpeed>('slow');
  
  // Animation for audio indicator
  const pulseAnim = useState(new Animated.Value(1))[0];

  const module = moduleData[moduleId || 'sound-imitation'];
  const exercises = module.exercises;
  const current = exercises[currentExercise];

  // Initialize audio service
  useEffect(() => {
    initializeAudioService().then(() => {
      setAudioInitialized(true);
    });
    
    return () => {
      stopSpeaking();
    };
  }, []);

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

  const handlePlayAudio = useCallback(async (speed: SpeechSpeed) => {
    if (!soundEnabled) {
      Alert.alert(
        'आवाज बन्द छ',
        'कृपया सेटिङ्समा गएर आवाज सक्रिय गर्नुहोस्।',
        [{ text: 'ठीक छ' }]
      );
      return;
    }

    if (isPlaying || isPracticing) {
      await stopSpeaking();
      setIsPlaying(false);
      setIsPracticing(false);
      return;
    }

    setSelectedSpeed(speed);
    setIsPlaying(true);

    await speakWithPronunciation(
      current.nepali,
      current.pronunciation,
      speed,
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  }, [current, soundEnabled, isPlaying, isPracticing]);

  const handlePractice = useCallback(async () => {
    if (!soundEnabled) {
      Alert.alert(
        'आवाज बन्द छ',
        'कृपया सेटिङ्समा गएर आवाज सक्रिय गर्नुहोस्।',
        [{ text: 'ठीक छ' }]
      );
      return;
    }

    if (isPracticing) {
      await stopSpeaking();
      setIsPracticing(false);
      setPracticeProgress({ current: 0, total: 0 });
      return;
    }

    setIsPracticing(true);

    await practiceWord(
      current.nepali,
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
  }, [current, soundEnabled, isPracticing]);

  const handleNext = () => {
    stopSpeaking();
    setIsPlaying(false);
    setIsPracticing(false);
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handlePrevious = () => {
    stopSpeaking();
    setIsPlaying(false);
    setIsPracticing(false);
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const handleComplete = () => {
    setCompletedExercises(prev => new Set([...prev, current.id]));
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handleExerciseSelect = (index: number) => {
    stopSpeaking();
    setIsPlaying(false);
    setIsPracticing(false);
    setCurrentExercise(index);
  };

  const isCompleted = completedExercises.has(current.id);
  const progress = ((currentExercise + 1) / exercises.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: module.title }} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={[styles.progressText, { fontSize: 12 * multiplier }]}>
            {currentExercise + 1} / {exercises.length}
          </Text>
        </View>

        {/* Main Exercise Card */}
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={[styles.completedText, { fontSize: 12 * multiplier }]}>
                  सकियो
                </Text>
              </View>
            )}
          </View>

          {/* Audio Playing Indicator */}
          {(isPlaying || isPracticing) && (
            <Animated.View 
              style={[
                styles.audioIndicator,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <Ionicons name="volume-high" size={20} color="#FFFFFF" />
              <Text style={[styles.audioIndicatorText, { fontSize: 12 * multiplier }]}>
                {isPracticing 
                  ? `अभ्यास ${practiceProgress.current}/${practiceProgress.total}` 
                  : selectedSpeed === 'slow' ? 'बिस्तारै' : 'सामान्य'}
              </Text>
            </Animated.View>
          )}

          {/* Main Word */}
          <View style={styles.wordContainer}>
            <Text style={[styles.mainWord, { fontSize: 72 * multiplier }]}>
              {current.nepali}
            </Text>
            <Text style={[styles.englishWord, { fontSize: 18 * multiplier }]}>
              {current.english}
            </Text>
          </View>

          {/* Pronunciation Guide - Tappable */}
          <TouchableOpacity 
            style={styles.pronunciationContainer}
            onPress={() => handlePlayAudio('slow')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isPlaying && selectedSpeed === 'slow' ? "pause-circle" : "volume-high"} 
              size={24} 
              color={colors.primary} 
            />
            <Text style={[styles.pronunciationText, { fontSize: 24 * multiplier }]}>
              {current.pronunciation}
            </Text>
            <View style={styles.tapHint}>
              <Text style={[styles.tapHintText, { fontSize: 10 * multiplier }]}>
                थिच्नुहोस्
              </Text>
            </View>
          </TouchableOpacity>

          {/* Instruction */}
          <View style={styles.instructionContainer}>
            <Ionicons name="information-circle" size={20} color={colors.accent} />
            <Text style={[styles.instructionText, { fontSize: 15 * multiplier }]}>
              {current.instruction}
            </Text>
          </View>
          {language === 'english' && (
            <Text style={[styles.instructionTextEn, { fontSize: 12 * multiplier }]}>
              {current.instructionEn}
            </Text>
          )}
        </View>

        {/* Speed Selection */}
        <View style={styles.speedContainer}>
          <Text style={[styles.speedLabel, { fontSize: 13 * multiplier }]}>
            गति छान्नुहोस्:
          </Text>
          <View style={styles.speedButtons}>
            <TouchableOpacity
              style={[
                styles.speedButton,
                selectedSpeed === 'slow' && styles.speedButtonActive,
              ]}
              onPress={() => handlePlayAudio('slow')}
            >
              <Ionicons 
                name="play-circle" 
                size={18} 
                color={selectedSpeed === 'slow' ? '#FFFFFF' : colors.primary} 
              />
              <Text style={[
                styles.speedButtonText,
                { fontSize: 13 * multiplier },
                selectedSpeed === 'slow' && styles.speedButtonTextActive,
              ]}>
                बिस्तारै
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.speedButton,
                selectedSpeed === 'normal' && styles.speedButtonActive,
              ]}
              onPress={() => handlePlayAudio('normal')}
            >
              <Ionicons 
                name="play-circle" 
                size={18} 
                color={selectedSpeed === 'normal' ? '#FFFFFF' : colors.primary} 
              />
              <Text style={[
                styles.speedButtonText,
                { fontSize: 13 * multiplier },
                selectedSpeed === 'normal' && styles.speedButtonTextActive,
              ]}>
                सामान्य
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              styles.repeatButton,
              isPlaying && styles.actionButtonPlaying,
            ]}
            onPress={() => handlePlayAudio(selectedSpeed)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isPlaying ? "stop-circle" : "repeat"} 
              size={24} 
              color={colors.primary} 
            />
            <Text style={[styles.actionButtonText, { fontSize: 14 * multiplier }]}>
              {isPlaying ? 'रोक्नुहोस्' : 'सुन्नुहोस्'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.actionButton, 
              styles.practiceButton,
              isPracticing && styles.practiceButtonActive,
            ]}
            onPress={handlePractice}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isPracticing ? "stop-circle" : "mic"} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={[styles.actionButtonTextWhite, { fontSize: 14 * multiplier }]}>
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

        {/* Complete Button */}
        <TouchableOpacity 
          style={[styles.completeButton, isCompleted && styles.completedButton]}
          onPress={handleComplete}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={22} 
            color={isCompleted ? colors.success : colors.textSecondary} 
          />
          <Text style={[
            styles.completeButtonText, 
            { fontSize: 15 * multiplier },
            isCompleted && styles.completedButtonText
          ]}>
            {isCompleted ? 'पूरा भयो!' : 'पूरा भयो भने थिच्नुहोस्'}
          </Text>
        </TouchableOpacity>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={[styles.navButton, currentExercise === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentExercise === 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={currentExercise === 0 ? colors.textLight : colors.primary} 
            />
            <Text style={[
              styles.navButtonText, 
              { fontSize: 14 * multiplier },
              currentExercise === 0 && styles.navButtonTextDisabled
            ]}>
              अघिल्लो
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navButton, currentExercise === exercises.length - 1 && styles.navButtonDisabled]}
            onPress={handleNext}
            disabled={currentExercise === exercises.length - 1}
          >
            <Text style={[
              styles.navButtonText, 
              { fontSize: 14 * multiplier },
              currentExercise === exercises.length - 1 && styles.navButtonTextDisabled
            ]}>
              अर्को
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={currentExercise === exercises.length - 1 ? colors.textLight : colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Exercise List */}
        <View style={styles.exerciseList}>
          <Text style={[styles.listTitle, { fontSize: 16 * multiplier }]}>
            सबै अभ्यासहरू
          </Text>
          <View style={styles.exerciseGrid}>
            {exercises.map((exercise, index) => (
              <TouchableOpacity
                key={exercise.id}
                style={[
                  styles.exerciseItem,
                  index === currentExercise && styles.exerciseItemActive,
                  completedExercises.has(exercise.id) && styles.exerciseItemCompleted,
                ]}
                onPress={() => handleExerciseSelect(index)}
              >
                <Text style={[
                  styles.exerciseItemText,
                  { fontSize: 18 * multiplier },
                  index === currentExercise && styles.exerciseItemTextActive,
                ]}>
                  {exercise.nepali}
                </Text>
                {completedExercises.has(exercise.id) && (
                  <View style={styles.exerciseItemCheck}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Audio Tips */}
        <View style={styles.audioTipsCard}>
          <Ionicons name="headset" size={20} color={colors.primary} />
          <View style={styles.audioTipsContent}>
            <Text style={[styles.audioTipsTitle, { fontSize: 14 * multiplier }]}>
              आवाज अभ्यासका लागि
            </Text>
            <Text style={[styles.audioTipsText, { fontSize: 12 * multiplier }]}>
              • "बिस्तारै" मा आवाज ढिलो बज्छ{'\n'}
              • "सामान्य" मा सामान्य गतिमा बज्छ{'\n'}
              • "अभ्यास" मा ३ पटक दोहोरिन्छ
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Ionicons name="bulb" size={20} color={colors.accent} />
          <Text style={[styles.tipsText, { fontSize: 13 * multiplier }]}>
            बच्चाको अनुहार हेरेर, बिस्तारै र स्पष्ट बोल्नुहोस्। 
            बच्चाले नक्कल गर्न प्रयास गर्दा प्रशंसा गर्नुहोस्।
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  progressText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 16,
  },
  exerciseHeader: {
    width: '100%',
    alignItems: 'flex-end',
    minHeight: 24,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: colors.success,
    fontWeight: '600',
    marginLeft: 4,
  },
  audioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  audioIndicatorText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  wordContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  mainWord: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  englishWord: {
    color: colors.textLight,
    marginTop: 8,
  },
  pronunciationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    position: 'relative',
  },
  pronunciationText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 10,
  },
  tapHint: {
    position: 'absolute',
    right: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tapHintText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionText: {
    color: colors.textSecondary,
    marginLeft: 8,
  },
  instructionTextEn: {
    color: colors.textLight,
    marginTop: 6,
    fontStyle: 'italic',
  },
  speedContainer: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  speedLabel: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  speedButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  speedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.cardBlue,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  speedButtonActive: {
    backgroundColor: colors.primary,
  },
  speedButtonText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
  speedButtonTextActive: {
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginHorizontal: 4,
  },
  repeatButton: {
    backgroundColor: colors.cardBlue,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonPlaying: {
    backgroundColor: colors.primaryLight,
  },
  practiceButton: {
    backgroundColor: colors.primary,
  },
  practiceButtonActive: {
    backgroundColor: colors.accent,
  },
  actionButtonText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtonTextWhite: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
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
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 20,
  },
  completedButton: {
    backgroundColor: colors.cardGreen,
    borderColor: colors.success,
  },
  completeButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 8,
  },
  completedButtonText: {
    color: colors.success,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: colors.textLight,
  },
  exerciseList: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  listTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 12,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  exerciseItem: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.cardBlue,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    position: 'relative',
  },
  exerciseItemActive: {
    backgroundColor: colors.primary,
  },
  exerciseItemCompleted: {
    backgroundColor: colors.cardGreen,
  },
  exerciseItemText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  exerciseItemTextActive: {
    color: '#FFFFFF',
  },
  exerciseItemCheck: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTipsCard: {
    backgroundColor: colors.cardBlue,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
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
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5C653',
  },
  tipsText: {
    color: colors.textSecondary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
});
