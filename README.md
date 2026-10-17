# Deutsch Lernen 🇩🇪

Angular app for the family (mom, dad, jamie) to learn German.

- Login: pick a user; the password is the user's name in lowercase (demo only, no real security).
- Single player: choose a topic and practise with a 20-activity word quiz, flashcards, or sentence building (+10 points each).
- Group mode: 2–3 players take turns building sentences.
- Scorecard per user, weekly leaderboard and prize progress; dictionary and grammar rules.
- Data is stored in the browser's localStorage.

```
npm install
npm start      # http://localhost:4200
npm run build
```

## Hosting on GitHub Pages
Merge to `main`, then in the repo go to Settings → Pages → Source: **GitHub Actions**.
The workflow in `.github/workflows/deploy.yml` publishes to `https://<user>.github.io/deutsch-lernen/`.
