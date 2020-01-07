import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

function loadLocaleData(fallbackLocale) {
  let userLocaleDetected = false;
  let userLocale = navigator.language || navigator.userLanguage;
  if (typeof variable !== 'undefined') {
    [userLocale] = userLocale.split('-');
  }
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      if (locale === userLocale) {
        userLocaleDetected = true;
      }
      messages[locale] = locales(key);
    }
  });
  if (userLocaleDetected === false) {
    userLocale = fallbackLocale;
  }
  return {
    userLocale,
    messages,
  };
}

const localeData = loadLocaleData('en');

const numberFormats = {
  en: {
    cryptoCurrency: {
      style: 'decimal',
      currency: 'USD',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    },
  },
  es: {
    cryptoCurrency: {
      style: 'decimal',
      currency: 'USD',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    },
  },
};

const dateTimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  es: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    },
  },
};


export default new VueI18n({
  numberFormats,
  dateTimeFormats,
  locale: localeData.userLocale,
  fallbackLocale: 'en',
  messages: localeData.messages,
});
