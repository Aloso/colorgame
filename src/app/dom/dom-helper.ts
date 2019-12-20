/**
 * Returns the element with the specified ID and the specified class, or throws an exception
 *
 * ## Example
 *
 * ```ts
 * const app = byId("app", HtmlDivElement);
 * ```
 */
export function byId<T extends HTMLElement>(id: string, clazz: (new() => T)): T {
  const el = document.getElementById(id)
  if (!(el instanceof clazz)) throw new Error(`Expected instance of ${clazz.name}, got ${el}`)
  return el
}

export type HtmlContent =
  | string
  | HTMLElement
  | DocumentFragment
  | null
  | Array<string | HTMLElement | DocumentFragment>

export interface IHtmlAttrs {
  [key: string]: string | number
}

export function el(type: string, content: HtmlContent, attrs?: IHtmlAttrs): HTMLElement {
  const elem = document.createElement(type)
  if (typeof content === 'string') {
    elem.innerHTML = content
  } else if (content instanceof Array) {
    elem.append(...content)
  } else if (content != null) {
    elem.append(content)
  }

  if (attrs) {
    for (const key in attrs) if (attrs.hasOwnProperty(key)) {
      elem.setAttribute(key, attrs[key] as string)
    }
  }
  return elem
}

export function frag(...contents: HtmlContent[]): DocumentFragment {
  const elem = document.createDocumentFragment()

  for (const content of contents) {
    if (typeof content === 'string') {
      elem.append(document.createTextNode(content))
    } else if (content instanceof Array) {
      elem.append(...content)
    } else if (content != null) {
      elem.append(content)
    }
  }
  return elem
}

export function button(content: HtmlContent, attrs: IHtmlAttrs, action: (e: MouseEvent) => void): HTMLButtonElement {
  const elem = el('button', content, attrs) as HTMLButtonElement
  elem.addEventListener('click', action)
  return elem
}

export function bigButton(content: HtmlContent, action: (e: MouseEvent) => void): HTMLButtonElement {
  const elem = el('button', content, { class: 'big' }) as HTMLButtonElement
  elem.addEventListener('click', action)
  return elem
}

export function div(content: HtmlContent, attrs?: IHtmlAttrs): HTMLDivElement {
  return el('div', content, attrs) as HTMLDivElement
}

export function span(content: HtmlContent, attrs?: IHtmlAttrs): HTMLSpanElement {
  return el('span', content, attrs) as HTMLSpanElement
}

export function h1(content: HtmlContent, attrs?: IHtmlAttrs): HTMLHeadingElement {
  return el('h1', content, attrs) as HTMLHeadingElement
}

export function p(content: HtmlContent, attrs?: IHtmlAttrs): HTMLParagraphElement {
  return el('p', content, attrs) as HTMLParagraphElement
}
