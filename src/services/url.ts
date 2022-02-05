import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const getQueryString = (query: any): string => {
  if (Object.keys(query).length > 0) {
    return `?${Object.keys(query).map((key) => `${key}=${query[key]}`)}`;
  }
  return '';
};

export const useDevQueries = () => {
  const { pathname, query } = useRouter();
  const [isDev, setIsDev] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    setIsDev(query.isDev === 'true');
    if (typeof window !== 'undefined') {
      setIsLocalhost(window.location.hostname === 'localhost');
    }
  }, [pathname, query]);

  return {
    isDev,
    isLocalhost,
  };
};
