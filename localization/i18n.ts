import enMessages from "./EN/common.json";
import arMessages from "./AR/common.json";

export const localeMessages = {
  en: enMessages,
  ar: arMessages,
};

export type SupportedLocale = keyof typeof localeMessages;

export const i18n = {
  locale: "en" as SupportedLocale,
  messages: localeMessages.en,
  setLocale(locale: SupportedLocale) {
    this.locale = locale;
    this.messages = localeMessages[locale];
  },
};

export function getMessages(locale: SupportedLocale = i18n.locale) {
  return localeMessages[locale] ?? localeMessages.en;
}
