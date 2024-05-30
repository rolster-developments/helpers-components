const classElement = '.rls-list-field__element';
const POSITION_INITIAL = 0;

type ContentElement = Nulleable<HTMLDivElement>;
type InputElement = Nulleable<HTMLInputElement>;
type ListElement = Nulleable<HTMLUListElement>;

interface NavigationInputProps {
  event: KeyboardEvent;
  listElement: ListElement;
}

interface NavigationElementProps {
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

function navigationInputDown(listElement: ListElement): number {
  const elements = listElement?.querySelectorAll<HTMLLIElement>(classElement);

  if (elements?.length) {
    elements.item(0).focus();

    setTimeout(() => {
      listElement?.scroll({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  return 0;
}

function navigationInputUp(listElement: ListElement): number {
  const elements = listElement?.querySelectorAll<HTMLLIElement>(classElement);

  if (!elements?.length) {
    return 0;
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

function navigationElementDown(props: NavigationElementProps): number {
  const { contentElement, inputElement, listElement, position } = props;

  const elements = listElement?.querySelectorAll<HTMLLIElement>(classElement);

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

function navigationElementUp(props: NavigationElementProps): number {
  const { contentElement, inputElement, listElement, position } = props;

  if (position > 0) {
    const elements = listElement?.querySelectorAll<HTMLLIElement>(classElement);

    const newPosition = position - 1;

    elements?.item(newPosition)?.focus();

    return newPosition;
  }

  if (locationListIsBottom(contentElement, listElement)) {
    inputElement?.focus();
  }

  return POSITION_INITIAL;
}

export function listNavigationInput(props: NavigationInputProps): number {
  const { event, listElement } = props;

  switch (event.code) {
    case 'ArrowDown':
      return navigationInputDown(listElement);
    case 'ArrowUp':
      return navigationInputUp(listElement);
    default:
      return POSITION_INITIAL;
  }
}

export function listNavigationElement(props: NavigationElementProps): number {
  const { event } = props;

  switch (event.code) {
    case 'ArrowDown':
      return navigationElementDown(props);
    case 'ArrowUp':
      return navigationElementUp(props);
    default:
      return POSITION_INITIAL;
  }
}
