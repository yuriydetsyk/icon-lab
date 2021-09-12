/**
 * Capitalizes first letters of words in string.
 * @param str String to be modified
 * @param lower Whether all other letters should be lowercased
 * @usage
 *   capitalize('fix this string');     // -> 'Fix This String'
 *   capitalize('javaSCrIPT');          // -> 'JavaSCrIPT'
 *   capitalize('javaSCrIPT', true);    // -> 'Javascript'
 */
export const capitalize = (str: string, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());

export const convertToDashes = (str: string) => {
  return `${str.slice(0, 1).toLowerCase()}${str.slice(1).replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())}`;
};
