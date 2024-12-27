/**
 * Utils for JSX
 * @module
 */

const tagsMap: string[] = [];
tagsMap[34] = '&quot;';
tagsMap[38] = '&amp;';
tagsMap[39] = '&#39';
tagsMap[60] = '&lt;';

// This function is not inlinable
const escapeTag = (tag: string): string => tagsMap[tag.charCodeAt(0)];

/**
 * Escape HTML strings
 * @param str - The string to escape
 * @returns The output string
 */
// eslint-disable-next-line
export const escapeHTML: (str: string) => string = globalThis.Bun?.escapeHTML ?? (
  (str) => str.replace(/[&<'"]/g, escapeTag)
);

type Value = string | number | boolean | null | undefined;
export type MultipleValues = Value | Value[];

/**
 * Render GHTML templates
 * @returns The rendered string
 */
export const html = ({ raw }: TemplateStringsArray, ...args: MultipleValues[]): string => {
  let result = '';
  let val: MultipleValues;
  let prevString: string;
  let noEscape: boolean;

  const l = args.length;
  for (let i = 0; i < l; ++i) {
    val = args[i];
    prevString = raw[i];

    noEscape = prevString.charCodeAt(prevString.length - 1) === 33;
    result += noEscape ? prevString.substring(0, prevString.length - 1) : prevString;

    result += val == null
      ? ''
      : typeof val === 'string'
        ? noEscape ? val : escapeHTML(val)
        : Array.isArray(val)
          ? noEscape ? val.join('') : escapeHTML(val.join(''))
          : val;
  }

  return result + raw[l];
};
