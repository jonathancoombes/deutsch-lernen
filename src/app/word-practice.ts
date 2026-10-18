import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Word } from './data';

type PracticeMethod = 'quiz' | 'flashcards';

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

@Component({
  selector: 'app-word-practice',
  template: `
    <div class="card builder">
      @if (method() === 'quiz') {
        <p class="prompt">{{ activity().prompt }}</p>
        <div class="avatars">
          @for (choice of activity().choices; track choice) {
            <button class="chip" [class.placed]="selected() === choice && choice === activity().answer"
              [disabled]="answered()" (click)="check(choice)">{{ choice }}</button>
          }
        </div>
        @if (answered()) { <p class="feedback good">🎉 Richtig!</p>         }
      } @else {
        <p class="prompt">How do you say “{{ activity().word.en }}” in German?</p>
        <button class="btn primary" [disabled]="speechState() === 'listening' || speechState() === 'correct' || speechState() === 'wrong'"
          (click)="listen()">{{ speechState() === 'listening' ? 'Listening…' : '🎙️ Speak your answer' }}</button>
        @if (speechFeedback()) { <p class="feedback" [class.good]="speechState() === 'correct'" [class.bad]="speechState() === 'wrong' || speechState() === 'error'">{{ speechFeedback() }}</p> }
        @if (speechState() === 'correct') { <p class="flash-answer">{{ activity().word.de }}</p> }
      }
    </div>`,
})
export class WordPractice {
  words = input.required<Word[]>();
  method = input.required<PracticeMethod>();
  index = input.required<number>();
  solved = output<void>();
  skipped = output<void>();

  answered = signal(false);
  selected = signal('');
  speechState = signal<'idle' | 'listening' | 'correct' | 'wrong' | 'error'>('idle');
  speechFeedback = signal('');
  private recognition: SpeechRecognitionLike | null = null;
  private skipTimer: ReturnType<typeof setTimeout> | undefined;
  activities = computed(() => {
    const words = this.words();
    return Array.from({ length: 20 }, (_, index) => {
      const wordIndex = index % words.length;
      const word = words[wordIndex];
      const germanToEnglish = Math.floor(index / words.length) % 2 === 1;
      const answer = germanToEnglish ? word.en : word.de;
      const distractors = [1, 2, 3]
        .map(offset => words[(wordIndex + offset) % words.length])
        .filter((candidate, i, all) => candidate !== word && all.indexOf(candidate) === i)
        .map(candidate => germanToEnglish ? candidate.en : candidate.de);
      const choices = [answer, ...distractors].sort((a, b) => a.localeCompare(b));
      return {
        prompt: germanToEnglish ? `What does “${word.de}” mean?` : `How do you say “${word.en}” in German?`,
        answer,
        choices,
        word,
      };
    });
  });
  activity = computed(() => this.activities()[this.index()]);

  constructor() {
    effect(() => {
      this.index();
      this.recognition?.abort();
      this.recognition = null;
      clearTimeout(this.skipTimer);
      this.skipTimer = undefined;
      this.answered.set(false);
      this.selected.set('');
      this.speechState.set('idle');
      this.speechFeedback.set('');
    });
  }

  check(choice: string) {
    this.selected.set(choice);
    if (choice === this.activity().answer) {
      this.answered.set(true);
      this.solved.emit();
    }
  }

  listen() {
    const browserWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      this.speechState.set('error');
      this.speechFeedback.set('Speech recognition is not available in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new Recognition();
    this.recognition = recognition;
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    this.speechState.set('listening');
    this.speechFeedback.set('Listening…');
    recognition.onresult = event => {
      const results = event.results[event.results.length - 1];
      if (!results?.length) return;
      const expected = this.normalize(this.activity().word.de);
      let correct = false;
      for (let i = 0; i < results.length; i++) {
        if (this.normalize(results[i].transcript) === expected) correct = true;
      }
      if (correct) {
        this.speechState.set('correct');
        this.speechFeedback.set('🎉 Richtig!');
        this.solved.emit();
      } else {
        this.speechState.set('wrong');
        this.speechFeedback.set('Not quite — moving on without points.');
        this.skipTimer = setTimeout(() => {
          this.skipTimer = undefined;
          this.skipped.emit();
        }, 900);
      }
    };
    recognition.onerror = event => {
      this.speechState.set('error');
      this.speechFeedback.set(event.error === 'not-allowed'
        ? 'Microphone access is blocked. Allow microphone access and try again.'
        : 'I couldn’t hear that. Please try again.');
    };
    recognition.onend = () => {
      if (this.speechState() === 'listening') {
        this.speechState.set('error');
        this.speechFeedback.set('I didn’t catch that. Please try again.');
      }
      if (this.recognition === recognition) this.recognition = null;
    };
    try {
      recognition.start();
    } catch {
      this.speechState.set('error');
      this.speechFeedback.set('Could not start the microphone. Please try again.');
    }
  }

  private normalize(value: string) {
    return value.toLocaleLowerCase('de-DE').normalize('NFKC').replace(/[^\p{L}\p{N}]/gu, '');
  }
}
