import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, ScoreService, USERS, POINTS_PER_SENTENCE, WEEKLY_PRIZE_TARGET } from './services';
import { TOPICS, RULES, Topic } from './data';
import { SentenceBuilder } from './sentence-builder';
import { WordPractice } from './word-practice';

type ActivityMethod = 'sentences' | 'quiz' | 'flashcards';
type PracticeMethod = ActivityMethod | 'random';

@Component({
  selector: 'app-login', imports: [FormsModule],
  template: `
  <div class="login">
    <h1 class="logo">🇩🇪 Deutsch Lernen</h1>
    <p>Who is learning today?</p>
    <div class="avatars">
      @for (u of users; track u.name) {
        <button class="avatar" [class.sel]="sel() === u.name" [style.--c]="u.color" (click)="sel.set(u.name)">
          <span>{{ u.avatar }}</span>{{ u.label }}</button>
      }
    </div>
    @if (sel()) {
      <form (submit)="go($event)" class="card">
        <input type="password" [(ngModel)]="pin" name="pin" placeholder="Password (your name in lowercase)" autofocus />
        <button class="btn primary">Los geht's! 🚀</button>
        @if (err()) { <p class="feedback bad">Wrong password</p> }
      </form>
    }
  </div>`,
})
export class Login {
  auth = inject(AuthService); router = inject(Router);
  users = USERS; sel = signal(''); pin = ''; err = signal(false);
  go(e: Event) { e.preventDefault(); if (this.auth.login(this.sel(), this.pin)) this.router.navigateByUrl('/'); else this.err.set(true); }
}

@Component({
  selector: 'app-shell', imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <nav>
    <a routerLink="/" class="brand">🇩🇪 Deutsch Lernen</a>
    <a routerLink="/" routerLinkActive="act" [routerLinkActiveOptions]="{exact:true}">Home</a>
    <a routerLink="/dictionary" routerLinkActive="act">Dictionary</a>
    <a routerLink="/rules" routerLinkActive="act">Rules</a>
    <a routerLink="/profile" routerLinkActive="act">My Scores</a>
    <span class="grow"></span>
    <span class="me">{{ auth.profile()?.avatar }} {{ auth.profile()?.label }} · ⭐ {{ scores.total(auth.user()!) }}</span>
    <button class="btn" (click)="out()">Logout</button>
  </nav>
  <main><router-outlet /></main>`,
})
export class Shell {
  auth = inject(AuthService); scores = inject(ScoreService); router = inject(Router);
  out() { this.auth.logout(); this.router.navigateByUrl('/login'); }
}

@Component({
  selector: 'app-home', imports: [RouterLink],
  template: `
  <h2>Willkommen, {{ auth.profile()?.label }}! {{ auth.profile()?.avatar }}</h2>
  <div class="grid two">
    <a class="card mode" routerLink="/practice"><span class="big bounce">🧍</span><h3>Mode 1: Single Player</h3><p>Practice and progress on your own.</p></a>
    <a class="card mode" routerLink="/group"><span class="big bounce">👨‍👩‍👦</span><h3>Mode 2: Group</h3><p>2–3 players take turns building sentences.</p></a>
  </div>
  <div class="card">
    <h3>🏆 This week</h3>
    @for (p of scores.leaderboard(); track p.name; let i = $index) {
      <div class="row"><span>{{ ['🥇','🥈','🥉'][i] }} {{ p.avatar }} {{ p.label }}</span><b>{{ p.weekly }} pts</b></div>
    }
    <p>Weekly prize (first to {{ target }} pts): <b>{{ scores.prize() }}</b></p>
  </div>`,
})
export class Home { auth = inject(AuthService); scores = inject(ScoreService); target = WEEKLY_PRIZE_TARGET; }

@Component({
  selector: 'app-practice', imports: [SentenceBuilder, WordPractice],
  template: `
  @if (!topic()) {
    <h2>Choose a topic</h2>
    <div class="grid">
      @for (t of topics; track t.id) {
        <button class="card topic" (click)="start(t)"><span class="big">{{ t.icon }}</span><h3>{{ t.name }}</h3><small>{{ activitiesPerMethod }} activities · 4 ways to practise</small></button>
      }
    </div>
  } @else if (!method()) {
    <button class="btn" (click)="topic.set(null)">← Topics</button>
    <h2>{{ topic()!.icon }} {{ topic()!.name }}: choose how to practise</h2>
    <div class="grid">
      <button class="card topic" (click)="startMethod('quiz')"><span class="big">🧠</span><h3>Word quiz</h3><p>Choose the correct German or English translation.</p><small>{{ activitiesPerMethod }} activities</small></button>
      <button class="card topic" (click)="startMethod('flashcards')"><span class="big">🃏</span><h3>Flashcards</h3><p>Reveal each word's translation and practise at your own pace.</p><small>{{ activitiesPerMethod }} activities</small></button>
      <button class="card topic" (click)="startMethod('sentences')"><span class="big">🧩</span><h3>Build sentences</h3><p>Put German words in the right order.</p><small>{{ activitiesPerMethod }} activities</small></button>
      <button class="card topic" (click)="startMethod('random')"><span class="big">🎲</span><h3>Random mix</h3><p>Quiz, flashcards and sentences shuffled in a different order every session.</p><small>{{ activitiesPerMethod }} activities</small></button>
    </div>
  } @else {
    <button class="btn" (click)="method.set(null)">← Practice methods</button>
    <h2>{{ topic()!.icon }} {{ topic()!.name }} · {{ methodName() }} <small>Score this round: ⭐ {{ round() }}</small></h2>
    @if (idx() < activitiesPerMethod) {
      <p>Activity {{ idx() + 1 }} / {{ activitiesPerMethod }}</p>
      @if (currentMethod() === 'sentences') {
        <app-sentence-builder [challenge]="topic()!.challenges[idx() % topic()!.challenges.length]" (solved)="solved()" />
      } @else {
        <app-word-practice [words]="topic()!.words" [method]="currentMethod() === 'flashcards' ? 'flashcards' : 'quiz'" [index]="idx()" (solved)="solved()" />
      }
      @if (done()) { <button class="btn primary pop" (click)="next()">Next ➜</button> }
    } @else {
      <div class="card finish"><span class="big bounce">🏆</span><h3>Practice complete!</h3><p>You completed {{ activitiesPerMethod }} activities and earned {{ round() }} points.</p>
        <button class="btn primary" (click)="method.set(null)">Choose another practice method</button></div>
    }
  }`,
})
export class Practice {
  auth = inject(AuthService); scores = inject(ScoreService);
  topics = TOPICS; activitiesPerMethod = 20;
  topic = signal<Topic | null>(null); method = signal<PracticeMethod | null>(null);
  idx = signal(0); round = signal(0); done = signal(false);
  methodName = computed(() => ({ quiz: 'Word quiz', flashcards: 'Flashcards', sentences: 'Build sentences', random: 'Random mix' }[this.method() ?? 'quiz']));
  plan = signal<ActivityMethod[]>([]);
  currentMethod = computed<ActivityMethod>(() => {
    const m = this.method();
    return m === 'random' ? (this.plan()[this.idx()] ?? 'quiz') : (m ?? 'quiz');
  });
  private makePlan(): ActivityMethod[] {
    const kinds: ActivityMethod[] = ['quiz', 'flashcards', 'sentences'];
    return Array.from({ length: this.activitiesPerMethod }, () => kinds[Math.floor(Math.random() * kinds.length)]);
  }
  start(t: Topic) { this.topic.set(t); this.method.set(null); this.idx.set(0); this.round.set(0); this.done.set(false); }
  startMethod(method: PracticeMethod) { this.plan.set(method === 'random' ? this.makePlan() : []); this.method.set(method); this.idx.set(0); this.round.set(0); this.done.set(false); }
  solved() { this.done.set(true); this.round.update(r => r + POINTS_PER_SENTENCE); this.scores.add(this.auth.user()!, POINTS_PER_SENTENCE, this.topic()!.name, 'single'); }
  next() { this.done.set(false); this.idx.update(i => i + 1); }
}

@Component({
  selector: 'app-group', imports: [SentenceBuilder],
  template: `
  <h2>👨‍👩‍👦 Group mode</h2>
  @if (!playing()) {
    <div class="card">
      <p>Pick 2–3 players:</p>
      <div class="avatars">
        @for (u of users; track u.name) {
          <button class="avatar" [class.sel]="chosen().includes(u.name)" [style.--c]="u.color" (click)="toggle(u.name)"><span>{{ u.avatar }}</span>{{ u.label }}</button>
        }
      </div>
      <p>Topic:</p>
      <div class="avatars">
        @for (t of topics; track t.id) { <button class="chip" [class.placed]="topic()?.id === t.id" (click)="topic.set(t)">{{ t.icon }} {{ t.name }}</button> }
      </div>
      <button class="btn primary" [disabled]="chosen().length < 2 || !topic()" (click)="begin()">Start game 🎲</button>
    </div>
  } @else {
    <div class="scorebar">
      @for (p of players(); track p.name) {
        <div class="pscore" [class.turn]="p.name === current().name" [style.--c]="p.color">{{ p.avatar }} {{ p.label }}<b>{{ game()[p.name] }}</b></div>
      }
    </div>
    @if (round() < total()) {
      <h3>Turn: <span class="turn-name">{{ current().avatar }} {{ current().label }}</span></h3>
      <app-sentence-builder [challenge]="topic()!.challenges[round() % topic()!.challenges.length]" (solved)="solved()" />
      @if (done()) { <button class="btn primary pop" (click)="next()">Next player ➜</button> }
    } @else {
      <div class="card finish"><span class="big bounce">🎉</span><h3>{{ winner() }}</h3>
        <button class="btn primary" (click)="playing.set(false)">Play again</button></div>
    }
  }`,
})
export class Group {
  scores = inject(ScoreService); users = USERS; topics = TOPICS;
  chosen = signal<string[]>([]); topic = signal<Topic | null>(null); playing = signal(false);
  round = signal(0); done = signal(false); game = signal<Record<string, number>>({});
  players = computed(() => USERS.filter(u => this.chosen().includes(u.name)));
  current = computed(() => this.players()[this.round() % this.players().length]);
  total = computed(() => this.players().length * 2);
  toggle(n: string) { this.chosen.update(c => c.includes(n) ? c.filter(x => x !== n) : [...c, n]); }
  begin() { this.round.set(0); this.done.set(false); this.game.set(Object.fromEntries(this.chosen().map(n => [n, 0]))); this.playing.set(true); }
  solved() {
    this.done.set(true); const n = this.current().name;
    this.game.update(g => ({ ...g, [n]: g[n] + POINTS_PER_SENTENCE }));
    this.scores.add(n, POINTS_PER_SENTENCE, this.topic()!.name, 'group');
  }
  next() { this.done.set(false); this.round.update(r => r + 1); }
  winner() {
    const g = this.game(); const max = Math.max(...Object.values(g));
    const w = this.players().filter(p => g[p.name] === max);
    return w.length > 1 ? 'It\'s a tie!' : `${w[0].avatar} ${w[0].label} wins!`;
  }
}

@Component({
  selector: 'app-dictionary', imports: [FormsModule],
  template: `
  <h2>📖 Dictionary</h2>
  <div class="card"><input [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Search German or English…" />
    <div class="avatars"><button class="chip" [class.placed]="!tid()" (click)="tid.set('')">All</button>
      @for (t of topics; track t.id) { <button class="chip" [class.placed]="tid() === t.id" (click)="tid.set(t.id)">{{ t.icon }} {{ t.name }}</button> }</div></div>
  <div class="grid">
    @for (w of list(); track w.de) {
      <div class="card word"><b>{{ w.article ? w.article + ' ' : '' }}{{ w.de }}</b><span>{{ w.en }}</span><small>{{ w.type }} · {{ w.topic }}</small></div>
    }
  </div>`,
})
export class Dictionary {
  topics = TOPICS; q = signal(''); tid = signal('');
  list = computed(() => {
    const q = this.q().toLowerCase();
    return TOPICS.filter(t => !this.tid() || t.id === this.tid()).flatMap(t => t.words.map(w => ({ ...w, topic: t.name })))
      .filter(w => !q || w.de.toLowerCase().includes(q) || w.en.toLowerCase().includes(q));
  });
}

@Component({
  selector: 'app-rules',
  template: `<h2>📐 German rules</h2>
  @for (r of rules; track r.title) {
    <div class="card"><h3>{{ r.title }}</h3><p>{{ r.text }}</p>@for (e of r.examples; track e) { <code>{{ e }}</code> }</div>
  }`,
})
export class Rules { rules = RULES; }

@Component({
  selector: 'app-profile',
  template: `
  <h2>{{ p()?.avatar }} {{ p()?.label }}'s scorecard</h2>
  <div class="grid three">
    <div class="card stat"><b>{{ scores.total(u()) }}</b>Total points</div>
    <div class="card stat"><b>{{ scores.weekly(u()) }}</b>This week</div>
    <div class="card stat"><b>{{ scores.count(u()) }}</b>Activities completed</div>
  </div>
  <div class="card"><h3>🎁 Weekly prize: {{ scores.prize() }}</h3>
    <div class="bar"><div [style.width.%]="pct()"></div></div>
    <p>{{ scores.weekly(u()) }} / {{ target }} points @if (pct() >= 100) { — 🎉 Prize unlocked! }</p></div>
  <div class="card"><h3>By topic</h3>
    @for (t of scores.byTopic(u()); track t[0]) { <div class="row"><span>{{ t[0] }}</span><b>{{ t[1] }}</b></div> } @empty { <p>No points yet – start practising!</p> }</div>
  <div class="card"><h3>Recent activity</h3>
    @for (e of scores.recent(u()); track e.ts) { <div class="row"><span>{{ e.mode === 'group' ? '👥' : '🧍' }} {{ e.topic }}</span><b>+{{ e.points }}</b></div> }</div>
  <div class="card"><h3>Family leaderboard (week)</h3>
    @for (l of scores.leaderboard(); track l.name) { <div class="row"><span>{{ l.avatar }} {{ l.label }}</span><b>{{ l.weekly }}</b></div> }</div>`,
})
export class Profile {
  auth = inject(AuthService); scores = inject(ScoreService); target = WEEKLY_PRIZE_TARGET;
  u = () => this.auth.user()!; p = this.auth.profile;
  pct = () => Math.min(100, (this.scores.weekly(this.u()) / this.target) * 100);
}
