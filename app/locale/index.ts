import { LocalizedMessage } from './interface';
import { LocalizableRequest } from '../common/localizable.request.interface';

export class Localization {
  private static instance: Localization;

  static shared(defaultLocale: string = 'en') {
    if (!Localization.instance) {
      Localization.instance = new Localization(defaultLocale);
    }
    return Localization.instance;
  }

  constructor(private defaultLocale: string = 'en') {}

  // Languages for which messages are defined under this dir are acceptable
  public acceptableLanguages: string[] = ['en'];

  // require messages for each language and cache
  private map = this.acceptableLanguages.reduce(
    (acc, language) => {
      acc[language] = require(`./${language}`).messages;
      return acc;
    },
    {} as { [language: string]: LocalizedMessage }
  );

  /**
   * Returns a messages object for the specified language
   */
  of(language: string | string[]): LocalizedMessage {
    if (Array.isArray(language)) {
      let suitable = language.filter(lang => this.map[lang] !== undefined);
      return this.map[suitable.length != 0 ? suitable[0] : this.defaultLocale];
    } else {
      if (this.map[language] !== undefined) {
        return this.map[language];
      } else {
        return this.map[this.defaultLocale];
      }
    }
  }

  defaultStore(): LocalizedMessage {
    return this.map[this.defaultLocale];
  }

  static messageStoreFromRequest(req: Express.Request): LocalizedMessage {
    if ((req as LocalizableRequest).messageStore !== undefined) {
      return (req as LocalizableRequest).messageStore;
    } else {
      return Localization.shared().of(process.env.DEFAULT_LOCALE || 'en');
    }
  }
}
