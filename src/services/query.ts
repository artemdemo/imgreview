export const getQueryString = (query: any): string => {
  if (Object.keys(query).length > 0) {
    return `?${Object.keys(query).map((key) => `${key}=${query[key]}`)}`;
  }
  return '';
};
