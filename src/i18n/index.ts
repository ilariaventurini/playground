import { I18n, TranslateOptions } from 'i18n-js'
import en from './en.json'
import { RecursiveKeyOf } from '@dashboard/utils/types'

export const LANGUAGES = { en } as const
export type I18nKey = RecursiveKeyOf<typeof en>

const i18n = new I18n(LANGUAGES)

i18n.defaultLocale = 'en'
i18n.locale = 'en'

/**
 * Translates text.
 *
 * @param key The i18n key.
 */
export function translate(key: I18nKey, options?: TranslateOptions) {
  return i18n.t(key, options)
}
