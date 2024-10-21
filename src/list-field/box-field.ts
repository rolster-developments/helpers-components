const CLASS_ELEMENT = '.rls-list-field__element';
const POSITION_INITIAL = 0;

type ContentElement = Nulleable<HTMLDivElement>;
type InputElement = Nulleable<HTMLInputElement>;
type ListElement = Nulleable<HTMLUListElement>;

interface InputOptions {
  contentElement: ContentElement;
  event: KeyboardEvent;
  listElement: ListElement;
}

interface ElementOptions {
  contentElement: ContentElement;
  event: KeyboardEvent;
  inputElement: InputElement;
  listElement: ListElement;
  position: number;
}

export function locationListIsBottom(
  contentElement: ContentElement,
  listElement: ListElement
): boolean {
  if (contentElement && listElement) {
    const { top, height } = contentElement.getBoundingClientRect();
    const { clientHeight } = listElement;

    return top + height + clientHeight < window.innerHeight;
  }

  return true;
}

function navigationInputDown(options: InputOptions): Undefined<number> {
  const { contentElement, listElement } = options;

  if (!locationListIsBottom(contentElement, listElement)) {
    return undefined;
  }

  const elements = listElement?.querySelectorAll<HTMLLIElement>(CLASS_ELEMENT);

  if (elements?.length) {
    elements.item(0).focus();

    setTimeout(() => {
      listElement?.scroll({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  return POSITION_INITIAL;
}

function navigationInputUp(options: InputOptions): Undefined<number> {
  const { contentElement, listElement } = options;

  if (locationListIsBottom(contentElement, listElement)) {
    return undefined;
  }

  const elements = listElement?.querySelectorAll<HTMLLIElement>(CLASS_ELEMENT);

  if (!elements?.length) {
    return POSITION_INITIAL;
  }

  const position = elements.length - 1;
  const element = elements.item(position);

  element?.focus();

  setTimeout(() => {
    listElement?.scroll({
      top: element?.offsetTop + element?.offsetLeft,
      behavior: 'smooth'
    });
  }, 100);

  return position;
}

function navigationElementDown(options: ElementOptions): number {
  const { contentElement, inputElement, listElement, position } = options;

  const elements = listElement?.querySelectorAll<HTMLLIElement>(CLASS_ELEMENT);

  const newPosition = position + 1;

  if (newPosition < (elements?.length || 0)) {
    elements?.item(newPosition)?.focus();

    return newPosition;
  }

  if (!locationListIsBottom(contentElement, listElement)) {
    inputElement?.focus();
  }

  return position;
}

function navigationElementUp(options: ElementOptions): number {
  const { contentElement, inputElement, listElement, position } = options;

  if (position > 0) {
    const elements =
      listElement?.querySelectorAll<HTMLLIElement>(CLASS_ELEMENT);

    const newPosition = position - 1;

    elements?.item(newPosition)?.focus();

    return newPosition;
  }

  if (locationListIsBottom(contentElement, listElement)) {
    inputElement?.focus();
  }

  return POSITION_INITIAL;
}

export function listNavigationInput(options: InputOptions): Undefined<number> {
  switch (options.event.code) {
    case 'ArrowDown':
      return navigationInputDown(options);
    case 'ArrowUp':
      return navigationInputUp(options);
    default:
      return undefined;
  }
}

export function listNavigationElement(options: ElementOptions): number {
  switch (options.event.code) {
    case 'ArrowDown':
      return navigationElementDown(options);
    case 'ArrowUp':
      return navigationElementUp(options);
    default:
      return POSITION_INITIAL;
  }
}
