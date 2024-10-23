const ELEMENT_CLASS = '.rls-field-list__element';
const POSITION_INITIAL = 0;

type Content = Nulleable<HTMLDivElement>;
type Input = Nulleable<HTMLInputElement>;
type UlList = Nulleable<HTMLUListElement>;

interface InputOptions {
  content: Content;
  event: KeyboardEvent;
  list: UlList;
}

interface ElementOptions {
  content: Content;
  event: KeyboardEvent;
  input: Input;
  list: UlList;
  position: number;
}

export function locationListCanBottom(content: Content, list: UlList): boolean {
  if (content && list) {
    const { top, height } = content.getBoundingClientRect();
    const { clientHeight } = list;

    return top + height + clientHeight < window.innerHeight;
  }

  return true;
}

export function locationListCanTop(content: Content, list: UlList): boolean {
  return !locationListCanBottom(content, list);
}

function navigationInputDown(options: InputOptions): Undefined<number> {
  const { content, list } = options;

  if (locationListCanTop(content, list)) {
    return undefined;
  }

  const elements = list?.querySelectorAll(ELEMENT_CLASS);

  if (elements?.length) {
    (elements.item(0) as HTMLLIElement).focus();

    setTimeout(() => {
      list?.scroll({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  return POSITION_INITIAL;
}

function navigationInputUp(options: InputOptions): Undefined<number> {
  const { content, list } = options;

  if (locationListCanBottom(content, list)) {
    return undefined;
  }

  const elements = list?.querySelectorAll(ELEMENT_CLASS);

  if (!elements?.length) {
    return POSITION_INITIAL;
  }

  const position = elements.length - 1;
  const element = elements.item(position) as HTMLLIElement;

  element.focus();

  setTimeout(() => {
    list?.scroll({
      top: element.offsetTop + element.offsetLeft,
      behavior: 'smooth'
    });
  }, 100);

  return position;
}

function navigationElementDown(options: ElementOptions): number {
  const { content, input, list, position } = options;

  const nextPosition = position + 1;

  const elements = list?.querySelectorAll(ELEMENT_CLASS);

  if (elements && nextPosition < elements.length) {
    (elements.item(nextPosition) as HTMLLIElement).focus();

    return nextPosition;
  }

  if (locationListCanTop(content, list)) {
    input?.focus();
  }

  return position;
}

function navigationElementUp(options: ElementOptions): number {
  const { content, input, list, position } = options;

  const elements = list?.querySelectorAll(ELEMENT_CLASS);

  if (elements && position > 0) {
    const previousPosition = position - 1;

    (elements.item(previousPosition) as HTMLLIElement).focus();

    return previousPosition;
  }

  if (locationListCanBottom(content, list)) {
    input?.focus();
  }

  return POSITION_INITIAL;
}

export function navigationListFromInput(
  options: InputOptions
): Undefined<number> {
  switch (options.event.code) {
    case 'ArrowDown':
      return navigationInputDown(options);
    case 'ArrowUp':
      return navigationInputUp(options);
    default:
      return undefined;
  }
}

export function navigationListFromElement(options: ElementOptions): number {
  switch (options.event.code) {
    case 'ArrowDown':
      return navigationElementDown(options);
    case 'ArrowUp':
      return navigationElementUp(options);
    default:
      return POSITION_INITIAL;
  }
}
