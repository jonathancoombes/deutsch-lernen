import { Injectable, signal, computed } from '@angular/core';

export const USERS = [
  { name: 'mom', label: 'Mom', avatar: '👩', color: '#e84393' },
  { name: 'dad', label: 'Dad', avatar: '👨', color: '#0984e3' },
  { name: 'jamie', label: 'Jamie', avatar: '🧒', color: '#00b894' },
];
export const POINTS_PER_SENTENCE = 10;
export const WEEKLY_PRIZE_TARGET = 100;
export const PRIZES = ['🍦 Ice cream outing', '🎬 Movie night', '🍕 Pizza of your choice', '🎮 Pick the family game'];

export interface Event { user: string; points: number; topic: string; mode: 'single' | 'group'; ts: number; }

export function weekStart(d = new Date()): number {
  const x = new Date(d); x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x.getTime();
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<string | null>(localStorage.getItem('dl.user'));
  readonly user = this._user.asReadonly();
  readonly profile = computed(() => USERS.find(u => u.name === this._user()) ?? null);
  /** Simple family login: each user has a PIN equal to their name unless changed (demo only, not secure). */
  login(name: string, pin: string): boolean {
    const u = USERS.find(x => x.name === name);
    if (!u || pin.trim().toLowerCase() !== u.name) return false;
    localStorage.setItem('dl.user', name); this._user.set(name); return true;
  }
  logout() { localStorage.removeItem('dl.user'); this._user.set(null); }
}

@Injectable({ providedIn: 'root' })
export class ScoreService {
  readonly events = signal<Event[]>(JSON.parse(localStorage.getItem('dl.events') ?? '[]'));

  add(user: string, points: number, topic: string, mode: 'single' | 'group') {
    const next = [...this.events(), { user, points, topic, mode, ts: Date.now() }];
    this.events.set(next); localStorage.setItem('dl.events', JSON.stringify(next));
  }
  total(user: string) { return this.events().filter(e => e.user === user).reduce((s, e) => s + e.points, 0); }
  weekly(user: string) { const w = weekStart(); return this.events().filter(e => e.user === user && e.ts >= w).reduce((s, e) => s + e.points, 0); }
  count(user: string) { return this.events().filter(e => e.user === user).length; }
  byTopic(user: string) {
    const m = new Map<string, number>();
    this.events().filter(e => e.user === user).forEach(e => m.set(e.topic, (m.get(e.topic) ?? 0) + e.points));
    return [...m.entries()];
  }
  recent(user: string) { return this.events().filter(e => e.user === user).slice(-8).reverse(); }
  leaderboard() { return USERS.map(u => ({ ...u, weekly: this.weekly(u.name), total: this.total(u.name) })).sort((a, b) => b.weekly - a.weekly); }
  prize() { return PRIZES[Math.floor(weekStart() / 604800000) % PRIZES.length]; }
}
