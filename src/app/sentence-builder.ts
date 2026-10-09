import { Component, computed, input, output, signal, effect } from '@angular/core';
import { Challenge } from './data';

@Component({
  selector: 'app-sentence-builder',
  template: `
    <div class="card builder">
      <p class="prompt">Translate: <strong>“{{ challenge().en }}”</strong></p>
      <div class="slots" [class.ok]="state() === 'correct'" [class.shake]="state() === 'wrong'">
        @for (w of answer(); track $index) {
          <button class="chip placed" (click)="remove($index)">{{ w }}</button>
        }
        @if (!answer().length) { <span class="hint">Tap words to build the sentence…</span> }
      </div>
      <div class="bank">
        @for (w of bank(); track $index) {
          <button class="chip" (click)="pick($index)" [disabled]="state() === 'correct'">{{ w }}</button>
        }
      </div>
      <div class="actions">
        <button class="btn" (click)="reset()" [disabled]="state() === 'correct'">↺ Reset</button>
        <button class="btn primary" (click)="check()" [disabled]="!answer().length || state() === 'correct'">Check ✔</button>
      </div>
      @if (state() === 'correct') { <p class="feedback good">🎉 Richtig! Correct!</p> }
      @if (state() === 'wrong') { <p class="feedback bad">Nicht ganz – try again!</p> }
    </div>`,
})
export class SentenceBuilder {
  challenge = input.required<Challenge>();
  solved = output<void>();
  wrong = output<void>();
  answer = signal<string[]>([]);
  used = signal<number[]>([]);
  state = signal<'idle' | 'correct' | 'wrong'>('idle');
  shuffled = computed(() => {
    const w = [...this.challenge().words];
    for (let i = w.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [w[i], w[j]] = [w[j], w[i]]; }
    return w;
  });
  bank = computed(() => this.shuffled().filter((_, i) => !this.used().includes(i)));
  constructor() { effect(() => { this.challenge(); this.answer.set([]); this.used.set([]); this.state.set('idle'); }); }

  pick(bankIdx: number) {
    const remaining = this.shuffled().map((w, i) => ({ w, i })).filter(x => !this.used().includes(x.i));
    const item = remaining[bankIdx];
    this.used.update(u => [...u, item.i]);
    this.answer.update(a => [...a, item.w]);
    this.state.set('idle');
  }
  remove(idx: number) {
    if (this.state() === 'correct') return;
    const w = this.answer()[idx];
    const si = this.shuffled().findIndex((s, i) => s === w && this.used().includes(i));
    this.answer.update(a => a.filter((_, i) => i !== idx));
    this.used.update(u => u.filter(i => i !== si));
    this.state.set('idle');
  }
  reset() { this.answer.set([]); this.used.set([]); this.state.set('idle'); }
  check() {
    const ok = this.answer().join(' ') === this.challenge().words.join(' ');
    this.state.set(ok ? 'correct' : 'wrong');
    if (ok) this.solved.emit(); else { this.wrong.emit(); setTimeout(() => this.state() === 'wrong' && this.state.set('idle'), 700); }
  }
}
