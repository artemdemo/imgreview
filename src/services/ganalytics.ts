import { isDev } from "./env";

export enum EEventCategories {
    MenuClick = 'MenuClick',
    GlobalInteraction = 'GlobalInteraction',
}

export enum EEventActions {
    AddArrow = 'add Arrow',
    AddRect = 'add Rect',
    AddRectRough = 'add RectRough',
    AddText = 'add Text',
    AddSelectRect = 'add SelectRect',
    OpenImage = 'open image',
    DropImage = 'drop image',
    ApplyCrop = 'apply crop',
    SaveImage = 'save image',
    ChangeColor = 'change color',
    ChangeFontSize = 'change font size',
    ChangeStrokeWidth = 'change stroke width',
}

type TSEFields = {
    eventCategory: EEventCategories,
    eventAction: EEventActions,
    eventLabel?: string,
    eventValue?: number,
    nonInteraction?: boolean,
};

export const sendEvent = (fields: TSEFields) => {
    if (!isDev) {
        try {
            ga('send', {
                hitType: 'event',
                eventCategory: fields.eventCategory,
                eventAction: fields.eventAction,
                eventLabel: fields.eventLabel,
                eventValue: fields.eventValue,
            });
            console.log(fields);
        } catch (e) {
            console.warn(e);
        }
    }
};
