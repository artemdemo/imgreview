import { useEffect, MutableRefObject } from 'react';

// Link: https://stackoverflow.com/a/42234988
export const useClickOutside = (
  ref: MutableRefObject<HTMLElement | null>,
  cb: (event?: any) => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event?: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        cb(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, cb]);
};
