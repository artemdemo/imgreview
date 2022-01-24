type DocElement = HTMLElement | null;

export const getElementById = (id: string): DocElement => {
  try {
    return document.getElementById(id);
  } catch (error) { }
  return null;
};

export const getBody = (): DocElement => {
  try {
    return document.body;
  } catch (error) { }
  return null;
};

export const querySelector = (query: string): DocElement => {
  try {
    return document.getElementById(query);
  } catch (error) { }
  return null;
};

export const addEventListener = (key: string, cb: (event?: any) => void) => {
  try {
    return document.addEventListener(key, cb);
  } catch (error) { }
  return null;
};

export const removeEventListener = (key: string, cb: (event?: any) => void) => {
  try {
    return document.removeEventListener(key, cb);
  } catch (error) { }
  return null;
};

export const createElement = (tagName: string) => {
  try {
    return document.createElement(tagName);
  } catch (error) { }
  return null;
};