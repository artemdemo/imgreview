import _isNumber from 'lodash/isNumber';
import _isBoolean from 'lodash/isBoolean';
import { isDev } from './env';

export enum EEventCategories {
    MenuClick = 'MenuClick',
    GlobalInteraction = 'GlobalInteraction',
}

export enum EEventActions {
    AddArrow = 'add Arrow',
    AddRect = 'add Rect',
    AddRectRough = 'add RectRough',
    AddEllipse = 'add Ellipse',
    AddEllipseRough = 'add EllipseRough',
    AddText = 'add Text',
    AddSelectRect = 'add SelectRect',
    CopyAll = 'copy all',
    OpenImage = 'open image',
    DropImage = 'drop image',
    ApplyCrop = 'apply crop',
    SaveImage = 'save image',
    ChangeColor = 'change color',
    ChangeFontSize = 'change font size',
    ChangeStrokeWidth = 'change stroke width',
}

type TEventProps = {
    eventAction: EEventActions,
    eventCategory: EEventCategories,
    eventLabel?: string,
    eventValue?: number,
    nonInteraction?: boolean,
};

export const sendEvent = (eventProps: TEventProps) => {
    if (!isDev) {
        try {
            const _props = {
                event_category: eventProps.eventCategory
            };
            if (eventProps.eventLabel) {
                _props['event_label'] = eventProps.eventLabel;
            }
            if (_isNumber(eventProps.eventValue)) {
                _props['value'] = eventProps.eventValue;
            }
            if (_isBoolean(eventProps.nonInteraction)) {
                _props['non_interaction'] = eventProps.nonInteraction;
            }
            // `ga` changed to `gtag`
            // https://developers.google.com/analytics/devguides/collection/gtagjs/events#send-events
            gtag(
                'event',
                eventProps.eventAction,
                _props,
            );
        } catch (e) {
            console.warn(e);
        }
    }
};
