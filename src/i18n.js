import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../locales/en.json";
import nl from "../locales/nl.json";
import fr from "../locales/fr.json";

// Ensure the resources are correctly mapped from the JSON files
const resources = {
  en: { translation: en },
  nl: { translation: nl },
  fr: { translation: fr },
};

i18n
  .use(LanguageDetector) // Use the language detector
  .use(initReactI18next)
  .init({
    resources: resources, // Ensure resources are passed correctly
    fallbackLng: "en", // Fallback to English if language isn't found
    interpolation: { escapeValue: false },
  });

export default i18n;
