# Footy Scores

Rozszerzenie Google Chrome wyświetlające wyniki piłkarskie w bocznym panelu przeglądarki (Side Panel). Zbudowane w React + TypeScript z użyciem Vite.

## Wymagania

- [Node.js](https://nodejs.org/) v18+
- Google Chrome v114+ (wymagane dla Side Panel API)

## Instalacja zależności

```bash
npm install
```

## Budowanie

### Jednorazowy build

```bash
npm run build
```

Pliki wyjściowe trafiają do folderu `dist/`.

### Tryb deweloperski (watch)

```bash
npm run dev
```

Vite automatycznie przebudowuje projekt przy każdej zmianie pliku źródłowego. Po każdym przebudowaniu odśwież rozszerzenie w Chrome (patrz niżej).

### Sprawdzanie typów

```bash
npm run typecheck
```

## Instalacja rozszerzenia w Chrome

1. Uruchom `npm run build`, żeby wygenerować folder `dist/`.
2. Otwórz Chrome i przejdź do `chrome://extensions/`.
3. Włącz **Tryb dewelopera** (przełącznik w prawym górnym rogu).
4. Kliknij **Załaduj rozpakowane** i wskaż folder `dist/` w tym repozytorium.
5. Rozszerzenie pojawi się na liście jako **Footy Scores**.

## Użycie

Kliknij ikonę **Footy Scores** na pasku rozszerzeń Chrome — panel otworzy się po prawej stronie przeglądarki, analogicznie do DevTools.

Aby odświeżyć rozszerzenie po przebudowaniu:

1. Wróć do `chrome://extensions/`.
2. Kliknij ikonę odświeżania (↺) przy kafelku Footy Scores.

## Struktura projektu

```
footy-scores-2026/
├── public/
│   ├── manifest.json          # Manifest rozszerzenia (Chrome MV3)
│   └── icons/                 # Ikony SVG rozszerzenia
├── src/
│   ├── background.ts          # Service worker — otwiera Side Panel
│   └── sidepanel/
│       ├── main.tsx           # Punkt wejścia React
│       ├── App.tsx            # Główny komponent aplikacji
│       ├── FootballIcon.tsx   # Ikona SVG jako komponent React
│       └── index.css          # Style globalne
├── sidepanel.html             # Szablon HTML dla Vite
├── vite.config.ts
├── tsconfig.json
└── package.json
```
