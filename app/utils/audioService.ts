import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export type SpeechSpeed = 'slow' | 'normal';

interface SpeakOptions {
  text: string;
  speed?: SpeechSpeed;
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: any) => void;
}

// Speech rates for different speeds
const SPEECH_RATES = {
  slow: 0.5,
  normal: 0.85,
};

// Pitch settings for clearer pronunciation
const SPEECH_PITCH = 1.0;

// Check if Nepali language is available
let nepaliVoiceAvailable: boolean | null = null;
let availableVoices: Speech.Voice[] = [];

export async function initializeAudioService(): Promise<void> {
  try {
    availableVoices = await Speech.getAvailableVoicesAsync();
    
    // Check for Nepali voices (ne, ne-NP, ne-IN)
    const nepaliVoices = availableVoices.filter(
      voice => voice.language.startsWith('ne') || 
               voice.language.includes('Nepal') ||
               voice.identifier?.toLowerCase().includes('nepali')
    );
    
    nepaliVoiceAvailable = nepaliVoices.length > 0;
    
    // Also check for Hindi as a fallback (similar pronunciation)
    if (!nepaliVoiceAvailable) {
      const hindiVoices = availableVoices.filter(
        voice => voice.language.startsWith('hi') || voice.language.includes('Hindi')
      );
      if (hindiVoices.length > 0) {
        nepaliVoiceAvailable = true; // Use Hindi as fallback
      }
    }
  } catch (error) {
    console.log('Error initializing audio service:', error);
    nepaliVoiceAvailable = false;
  }
}

export function isNepaliAvailable(): boolean {
  return nepaliVoiceAvailable ?? false;
}

export function getAvailableVoices(): Speech.Voice[] {
  return availableVoices;
}

export async function speakNepali(options: SpeakOptions): Promise<void> {
  const { text, speed = 'normal', onStart, onDone, onError } = options;
  
  // Stop any ongoing speech
  await stopSpeaking();
  
  try {
    // Determine the best language to use
    let language = 'ne-NP'; // Default to Nepali
    
    // Check available voices and select the best one
    const nepaliVoice = availableVoices.find(v => v.language.startsWith('ne'));
    const hindiVoice = availableVoices.find(v => v.language.startsWith('hi'));
    
    if (nepaliVoice) {
      language = nepaliVoice.language;
    } else if (hindiVoice) {
      language = hindiVoice.language;
    }
    
    const speechOptions: Speech.SpeechOptions = {
      language,
      pitch: SPEECH_PITCH,
      rate: SPEECH_RATES[speed],
      onStart: () => {
        onStart?.();
      },
      onDone: () => {
        onDone?.();
      },
      onError: (error) => {
        console.log('Speech error:', error);
        onError?.(error);
      },
    };
    
    // For web platform, we might need different handling
    if (Platform.OS === 'web') {
      // Web speech synthesis might have different voice availability
      speechOptions.language = 'hi-IN'; // Hindi is more commonly available on web
    }
    
    Speech.speak(text, speechOptions);
  } catch (error) {
    console.log('Error speaking:', error);
    onError?.(error);
  }
}

export async function speakWithPronunciation(
  word: string, 
  pronunciation: string, 
  speed: SpeechSpeed,
  onStart?: () => void,
  onDone?: () => void,
  onError?: (error: any) => void
): Promise<void> {
  // For slow speed, use the syllable-separated pronunciation
  // For normal speed, use the full word
  const textToSpeak = speed === 'slow' ? pronunciation.replace(/-/g, ' ') : word;
  
  await speakNepali({
    text: textToSpeak,
    speed,
    onStart,
    onDone,
    onError,
  });
}

export async function stopSpeaking(): Promise<void> {
  try {
    await Speech.stop();
  } catch (error) {
    console.log('Error stopping speech:', error);
  }
}

export function isSpeaking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}

// Speak a sequence of syllables with pauses
export async function speakSyllables(
  syllables: string[],
  onStart?: () => void,
  onDone?: () => void,
  onError?: (error: any) => void
): Promise<void> {
  await stopSpeaking();
  
  onStart?.();
  
  for (let i = 0; i < syllables.length; i++) {
    await new Promise<void>((resolve) => {
      speakNepali({
        text: syllables[i],
        speed: 'slow',
        onDone: () => {
          // Add a small pause between syllables
          setTimeout(resolve, 300);
        },
        onError: (error) => {
          onError?.(error);
          resolve();
        },
      });
    });
  }
  
  onDone?.();
}

// Practice mode - speaks the word multiple times
export async function practiceWord(
  word: string,
  repetitions: number = 3,
  onStart?: () => void,
  onProgress?: (current: number, total: number) => void,
  onDone?: () => void,
  onError?: (error: any) => void
): Promise<void> {
  await stopSpeaking();
  
  onStart?.();
  
  for (let i = 0; i < repetitions; i++) {
    onProgress?.(i + 1, repetitions);
    
    await new Promise<void>((resolve) => {
      speakNepali({
        text: word,
        speed: i === 0 ? 'slow' : 'normal',
        onDone: () => {
          // Pause between repetitions
          setTimeout(resolve, 800);
        },
        onError: (error) => {
          onError?.(error);
          resolve();
        },
      });
    });
  }
  
  onDone?.();
}
