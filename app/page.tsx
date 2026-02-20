import type { Metadata } from "next";
import { AppShell } from "../src/components/AppShell";
import { SITE_NAME, SITE_URL, SOCIALS } from "../src/config/site";

const PAGE_TITLE = "Invisible Text Detector and Remover";
const PAGE_DESCRIPTION =
  "Scan and clean hidden Unicode characters from AI-generated text. Zer0Write detects zero-width, tag smuggling, bidi controls, variation selectors, smart punctuation, and more.";

const DETECTION_ITEMS = [
  "Zero-width and invisible control characters",
  "Unicode tags and stealth tag payloads",
  "Bidi override and isolate markers",
  "Variation selectors and regional indicators",
  "Smart punctuation, unusual bullets, and spacing artifacts",
] as const;

const HOW_TO_STEPS = [
  "Paste text into the input panel.",
  "Review decoded detections and category stats.",
  "Copy or save the cleaned output.",
] as const;

const FAQ_ITEMS = [
  {
    question: "Does Zer0Write upload my text?",
    answer:
      "No. Processing runs in the browser so pasted content stays on-device during scanning and cleanup.",
  },
  {
    question: "What hidden characters can it detect?",
    answer:
      "It detects zero-width controls, Unicode tags, sneaky bit carriers, bidi controls, variation selectors, regional indicators, and punctuation artifacts.",
  },
  {
    question: "Can I replace em dash and multiply sign automatically?",
    answer:
      "Yes. The cleaner normalizes common punctuation artifacts and replaces unsupported markers with safer plain-text forms.",
  },
  {
    question: "Does cleaning invisible characters bypass AI detectors?",
    answer:
      "No. This tool focuses on text integrity and safety, not bypassing AI detection systems.",
  },
] as const;

const pageTitleWithBrand = `${PAGE_TITLE} | ${SITE_NAME}`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: pageTitleWithBrand,
    description: PAGE_DESCRIPTION,
    url: "/",
    type: "website",
  },
  twitter: {
    title: pageTitleWithBrand,
    description: PAGE_DESCRIPTION,
  },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  description: PAGE_DESCRIPTION,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Person",
    name: "Zer0Luck",
    url: SOCIALS.xUrl,
  },
  featureList: DETECTION_ITEMS,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to clean invisible Unicode text with Zer0Write",
  description: "Simple browser workflow for detecting and cleaning hidden characters.",
  step: HOW_TO_STEPS.map((text, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    text,
  })),
};

function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Page() {
  return (
    <>
      <AppShell />

      <section className="Zer0Write-seo" aria-labelledby="zw-seo-title">
        <div className="Zer0Write-seo-inner">
          <h2 id="zw-seo-title">Invisible Text Detector and Remover for Safer LLM Workflows</h2>
          <p>
            Zer0Write helps you detect and remove hidden Unicode payloads from AI-generated text
            before publishing, sharing, or indexing.
          </p>

          <div className="Zer0Write-seo-grid">
            <article className="Zer0Write-seo-card">
              <h3>Detection Coverage</h3>
              <ul>
                {DETECTION_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="Zer0Write-seo-card">
              <h3>How It Works</h3>
              <ol>
                {HOW_TO_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          </div>

          <article className="Zer0Write-seo-card" aria-labelledby="zw-seo-faq">
            <h3 id="zw-seo-faq">FAQ</h3>
            {FAQ_ITEMS.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </article>

          <p className="Zer0Write-seo-credit">
            Built by{" "}
            <a href={SOCIALS.xUrl} target="_blank" rel="noreferrer">
              Zer0Luck
            </a>
          </p>
        </div>
      </section>

      <JsonLd id="zw-webapp-jsonld" data={webAppJsonLd} />
      <JsonLd id="zw-faq-jsonld" data={faqJsonLd} />
      <JsonLd id="zw-howto-jsonld" data={howToJsonLd} />
    </>
  );
}
