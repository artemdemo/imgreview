import en from '../translations/en.json';

export const t = (key: string) => {
  if (en.hasOwnProperty(key)) {
    // @ts-ignore
    return en[key];
  }
  return key;
};
