export const isDev = (() => {
  try {
    return process.env.NODE_ENV !== 'production';
  } catch (e) {}

  return false;
})();
