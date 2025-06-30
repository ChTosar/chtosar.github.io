class I18n {
  lang;
  availableLanguages = [
    'en-US',
    'es-ES',
    'gl-ES',
    'ca-ES',
    'pt-PT',
    'fr-FR',
    'de-DE',
    'it-IT',
    'zh-CN',
    'ja-JP',
    'ar',
    'ru-RU',
    'vi-VN',
    'uk-UA'
  ];
  translations;
  langFetch;

  constructor() {
    this.getDefaultLang();
    this.langFetch = this.loadLang();
  }

  getDefaultLang() {
    const userPrefLang = localStorage.getItem('preferredLanguage');
    const userLang = userPrefLang
      ? userPrefLang
      : navigator.language || 'en-US';

    this.lang = this.availableLanguages.includes(userLang) ? userLang : null;

    if (!this.lang) {
      const baseLang = userLang.split('-')[0];
      const partialMatch = this.availableLanguages.find((langCode) =>
        langCode.startsWith(baseLang)
      );
      this.lang = partialMatch || 'en-US';
    }

    return this.lang;
  }

  async loadLang(lang = this.lang) {
    try {
      const response = await fetch(`./lang/${lang}.json`);
      this.translations = await response.json();
      this.lang = lang;
      document
        .querySelector('html')
        .setAttribute('lang', this.lang.split('-')[0]);
      return this.translations;
    } catch (error) {
      console.error(`Error loading language file for ${lang}:`, error);
      const response = await fetch('./lang/en-US.json');
      this.translations = await response.json();
      return this.translations;
    }
  }

  get(lbl) {
    return this.translations[lbl];
  }

  async langLoaded() {
    await this.langFetch;
    return this.translations;
  }
}

const i18n = new I18n();

export default i18n;
