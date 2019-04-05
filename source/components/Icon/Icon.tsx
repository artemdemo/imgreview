import React from 'react';
import { TIconProps } from './IconBase';

/**
 * Notice: This file has `.tsx` extension.
 * I need it only to support JSX code in mock file.
 * Typescript doesn't allow to write jsx code in `.ts` files, only in `.tsx`
 */
import lazify from '../../containers/lazify';

const LazyIcon = lazify(() => import(/* webpackChunkName: "<IconBase />" */ './IconBase'));

const IconPlaceholder = (props: TIconProps) => {
    return (
        <LazyIcon
            {...props}
        >
            {props.title}
        </LazyIcon>
    );
};

export default IconPlaceholder;
