# Zer0Write

## Project Overview
Zer0Write is a browser-first text integrity tool that detects, decodes, and removes hidden Unicode payloads from pasted content.

It is designed for real-world LLM safety and content sanitation workflows where invisible carriers can be abused for obfuscation, prompt injection, or metadata smuggling.

Core outputs:
- `Detected + Decoded` view (human-readable reveal of hidden carriers)
- `Cleaned Output` (normalization + stealth stripping)
- Real-time stats (count, density, entropy, category breakdown)

## Detection Scope
Zer0Write currently covers:
- Zero-width and invisible characters
- Unicode tag ranges (AWS tag-style carriers)
- SneakyBits-style binary carriers
- Bidirectional control characters and isolate/closure imbalance
- Variation selectors and regional indicators
- Non-standard spaces, smart quotes, bullets, and punctuation artifacts

## Architecture
The project is organized into three layers:

1. Web Surface (`/app`, `/src/components`)
- Input panel, scan controls, stats cards, decoded highlights, cleaned output
- Responsive layout with a single hydration-safe DOM and CSS media queries

2. Runtime Hooks (`/src/hooks`)
- `useScanner`: input state, scan trigger mode, result lifecycle
- `useDebounce`: controlled live-scan scheduling with cancellation
- `useClipboard`: copy/share fallback handling for browser environments

3. Detection Engine (`/src/engine`)
- `classifier.ts`: code point classification into stealth categories
- `decoders.ts`: run-based decoding (tag/sneaky/bidi/VS/regional)
- `processor.ts`: full processing pipeline
  - walk raw input
  - classify and decode runs
  - build render segments
  - clean with `normalize('NFKC') + STEALTH_REGEX`
  - compute statistics

Flow:
`Input -> useScanner -> processText -> segments/stats/cleaned -> render`

## Project Structure
- `app/`: web entry points and global styles
- `src/components/`: UI components
- `src/hooks/`: runtime/state hooks
- `src/engine/`: stealth detection and decoding pipeline
- `public/brand/zw.svg`: brand logo asset

## Install, Run, Build
### Prerequisites
- Node.js 20+
- npm

### Install
```bash
npm install
```

### Run (Development)
```bash
npm run dev
```

### Type Check
```bash
npm run lint
```

### Test
```bash
npm run test
```

### Build (Production)
```bash
npm run build
```

## Deploy (Vercel)
Recommended pre-deploy checks:
```bash
nvm use
npm ci
npm run check:deploy
```

Deploy command:
```bash
vercel --prod
```

## Security Notes
- Keep secrets in deployment environment settings only.
- Do not commit `.env*`, key files, or credential material.
- Current repository includes ignore rules for common secret/hidden files.

## Citations
- Gao et al., *Imperceptible Jailbreaking against Large Language Models* (arXiv:2510.05025, 2025)  
  [https://arxiv.org/abs/2510.05025](https://arxiv.org/abs/2510.05025)

- Lian et al., *Prompt-in-Content Attacks: Exploiting Uploaded Inputs to Hijack LLM Behavior* (arXiv:2508.19287, 2025)  
  [https://arxiv.org/abs/2508.19287](https://arxiv.org/abs/2508.19287)

- Boucher et al., *Bad Characters: Imperceptible NLP Attacks* (IEEE S&P 2022)  
  [https://www.ieee-security.org/TC/SP2022/program-papers.html](https://www.ieee-security.org/TC/SP2022/program-papers.html)  
  [https://arxiv.org/abs/2106.09898](https://arxiv.org/abs/2106.09898)

- Boucher and Anderson, *Trojan Source: Invisible Vulnerabilities* (USENIX Security 2023)  
  [https://www.usenix.org/conference/usenixsecurity23/presentation/boucher](https://www.usenix.org/conference/usenixsecurity23/presentation/boucher)  
  [https://arxiv.org/abs/2111.00169](https://arxiv.org/abs/2111.00169)

- Chen et al., *StruQ: Defending Against Prompt Injection with Structured Queries* (USENIX Security 2025)  
  [https://www.usenix.org/conference/usenixsecurity25/presentation/chen-sizhe](https://www.usenix.org/conference/usenixsecurity25/presentation/chen-sizhe)  
  [https://arxiv.org/abs/2402.06363](https://arxiv.org/abs/2402.06363)

- Pape et al., *Prompt Obfuscation for Large Language Models* (USENIX Security 2025)  
  [https://www.usenix.org/conference/usenixsecurity25/presentation/pape](https://www.usenix.org/conference/usenixsecurity25/presentation/pape)

- Greshake et al., *Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection* (arXiv:2302.12173, 2023)  
  [https://arxiv.org/abs/2302.12173](https://arxiv.org/abs/2302.12173)

- Liu et al., *Formalizing and Benchmarking Prompt Injection Attacks and Defenses* (arXiv:2310.12815, 2023)  
  [https://arxiv.org/abs/2310.12815](https://arxiv.org/abs/2310.12815)

- Hines et al., *Defending Against Indirect Prompt Injection Attacks With Spotlighting* (arXiv:2403.14720, 2024)  
  [https://arxiv.org/abs/2403.14720](https://arxiv.org/abs/2403.14720)
