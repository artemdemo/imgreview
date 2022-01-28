import React from 'react';
import Image, { ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'loader' | 'unoptimized'>;

export const ContentImage: React.FC<Props> = (props) => (
  <Image loader={({ src }) => src} unoptimized {...props} />
);
