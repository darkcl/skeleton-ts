import { LocalizedMessage } from './interface';
import { injectable } from 'inversify';

@injectable()
export class Localization {
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
}
