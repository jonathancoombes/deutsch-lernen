import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Word } from './data';

type PracticeMethod = 'quiz' | 'flashcards';
interface Activity {
  prompt: string;
  answer: string;
  choices: string[];
}

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
        @if (answered()) { <p class="feedback good">🎉 Richtig!</p> }
      } @else {
        <p class="prompt">{{ activity().prompt }}</p>
        @if (revealed()) {
          <p class="flash-answer">{{ activity().answer }}</p>
          <button class="btn primary" (click)="complete()">Next ➜</button>
        } @else {
          <button class="btn primary" (click)="revealed.set(true)">Show answer</button>
        }
      }
    </div>`,
})
export class WordPractice {
  words = input.required<Word[]>();
  method = input.required<PracticeMethod>();
  index = input.required<number>();
  solved = output<void>();

  answered = signal(false);
  revealed = signal(false);
  selected = signal('');
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
      };
    });
  });
  activity = computed(() => this.activities()[this.index()]);

  constructor() {
    effect(() => {
      this.index();
      this.answered.set(false);
      this.revealed.set(false);
      this.selected.set('');
    });
  }

  check(choice: string) {
    this.selected.set(choice);
    if (choice === this.activity().answer) {
      this.answered.set(true);
      this.solved.emit();
    }
  }

  complete() {
    this.solved.emit();
  }
}
