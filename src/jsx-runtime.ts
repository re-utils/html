/**
 * The JSX runtime module
 * @module
 */

import type { JSX } from './jsx';

export type Children = JSX.Children;
export type PropsWithChildren<T = {}> = { children?: Children } & T;

/**
 * Build JSX attributes to string
 * @param attributes - The attributes to build
 * @returns The output string
 */
export const parseAttributes = (attributes: Record<string, any>): string => {
  let result = '';
  let value: any;

  for (const key in attributes) {
    if (key === 'class') {
      value = attributes[key];

      result += " class='";
      result += typeof value === 'string' && value.includes("'")
        ? value.replace(/'/g, '"')
        : value;
      result += "'";
    } else if (key !== 'children') {
      value = attributes[key];

      // eslint-disable-next-line
      switch (typeof value) {
        case 'string':
          result += ' ';
          result += key;
          result += "='";
          result += value.includes("'") ? value.replace(/'/g, '"') : value;
          result += "'";
          continue;

        case 'boolean':
          if (value) {
            result += ' ';
            result += key;
          }
          continue;

        case 'object':
          if (value instanceof Date) {
            result += ' ';
            result += key;
            result += "='";
            result += value.toISOString();
            result += "'";
          } else {
            // eslint-disable-next-line
            value = (value as Object).toString();
            result += ' ';
            result += key;
            result += "='";
            result += (value as string).includes("'") ? (value as string).replace(/'/g, '"') : value;
            result += "'";
          }
          continue;

        default:
          result += ' ';
          result += key;
          result += "='";
          result += value;
          result += "'";
          continue;
      }
    }
  }

  return result;
};

/**
 * A JSX Fragment is used to return multiple elements from a component.
 * @param attributes - The target attributes
 *
 * @example
 *
 * ```tsx
 * // renders <div>1</div> and <div>2</div> without needing a wrapper element
 * const html = <><div>1</div><div>2</div></>
 * ```
 */
// eslint-disable-next-line
export const Fragment = (attributes: PropsWithChildren<any>): string => Array.isArray(attributes.children) ? attributes.children.map((val: any) => val ?? '').join('') : attributes.children ?? '';

/**
 * Generates a html string from the given contents.
 *
 * @param name - The name of the element to create or a function that creates the element.
 * @param attributes - A record of literal values to use as attributes. A property named `children` will be used as the children of the element.
 * @returns The generated html string.
 */
export const jsx = (name: string | ((...args: any[]) => any), attributes: PropsWithChildren<any>): JSX.Element => typeof name === 'string'
  ? name === 'meta'
    || name === 'link'
    || name === 'img'
    || name === 'br'
    || name === 'input'
    || name === 'hr'
    || name === 'area'
    || name === 'base'
    || name === 'col'
    || name === 'command'
    || name === 'embed'
    || name === 'keygen'
    || name === 'param'
    || name === 'source'
    || name === 'track'
    || name === 'wbr'
    // eslint-disable-next-line
    ? '<' + name + parseAttributes(attributes) + '>'
    // eslint-disable-next-line
    : attributes.children == null
      // eslint-disable-next-line
      ? '<' + name + parseAttributes(attributes) + '></' + name + '>'
      // eslint-disable-next-line
      : '<' + name + parseAttributes(attributes) + '>' + Fragment(attributes) + '</' + name + '>'
  : name(attributes);

/**
 * Generates a html string from the given contents.
 *
 * @param name - The name of the element to create or a function that creates the element.
 * @param attributes - A record of literal values to use as attributes. A property named `children` will be used as the children of the element.
 * @returns The generated html string.
 */
export const jsxs = (name: string | ((...args: any[]) => any), attributes: PropsWithChildren<any>): JSX.Element => typeof name === 'string'
  // eslint-disable-next-line
  ? '<' + name + parseAttributes(attributes) + '>' + attributes.children.map((val: any) => val ?? '').join('') + '</' + name + '>'
  : name(attributes);
