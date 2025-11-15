interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

const DEFAULT_OPTIONS: Required<SpeechOptions> = {
  lang: 'es-ES',
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
};

function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
}

function speak(text: string, options: SpeechOptions = {}): void {
  if (!isSpeechSupported()) {
    console.warn('[TTS] Speech synthesis not supported');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const opts = { ...DEFAULT_OPTIONS, ...options };

  utterance.lang = opts.lang;
  utterance.rate = opts.rate;
  utterance.pitch = opts.pitch;
  utterance.volume = opts.volume;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function cancel(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

export const TTS = {
  speak,
  cancel,
  isSupported: isSpeechSupported,
};

export class VoiceInstructor {
  private lastMessage = '';
  private debounceTimeout: number | null = null;

  announce(message: string, immediate = false): void {
    if (message === this.lastMessage && !immediate) return;

    this.lastMessage = message;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    const delay = immediate ? 0 : 500;
    this.debounceTimeout = window.setTimeout(() => {
      TTS.speak(message);
    }, delay);
  }

  stop(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
    TTS.cancel();
    this.lastMessage = '';
  }
}
