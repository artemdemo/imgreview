type DocElement = HTMLElement | null;

export const getElementById = (id: string): DocElement => {
  try {
    return document.getElementById(id);
  } catch (error) {}
  return null;
};

export const getBody = (): HTMLBodyElement | null => {
  try {
    return document.body as HTMLBodyElement;
  } catch (error) {}
  return null;
};

export const querySelector = <T extends HTMLElement>(
  query: string,
): T | null => {
  try {
    return document.querySelector(query);
  } catch (error) {}
  return null;
};

export const addEventListener = (key: string, cb: (event?: any) => void) => {
  try {
    return document.addEventListener(key, cb);
  } catch (error) {}
  return null;
};

export const removeEventListener = (key: string, cb: (event?: any) => void) => {
  try {
    return document.removeEventListener(key, cb);
  } catch (error) {}
  return null;
};

export const createElement = (tagName: string) => {
  try {
    return document.createElement(tagName);
  } catch (error) {}
  return null;
};
