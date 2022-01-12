import _ from 'lodash';
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
  ApplyCrop = 'apply crop',
  SaveImage = 'save image',
  ChangeColor = 'change color',
  ChangeFontSize = 'change font size',
  ChangeStrokeWidth = 'change stroke width',
  Sketchify = 'sketchify',
  AboutPage = 'about page',
  GithubPage = 'github page',

  // Global interaction
  DropImage = 'drop image',
  ShownMobileWarning = 'ShownMobileWarning',
}

type TEventProps = {
  eventAction: EEventActions;
  eventCategory: EEventCategories;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
};

export const sendEvent = _.debounce((eventProps: TEventProps) => {
  const _props: { [key: string]: any } = {
    event_category: eventProps.eventCategory,
  };
  if (eventProps.eventLabel) {
    _props['event_label'] = eventProps.eventLabel;
  }
  if (_.isNumber(eventProps.eventValue)) {
    _props['value'] = eventProps.eventValue;
  }
  if (_.isBoolean(eventProps.nonInteraction)) {
    _props['non_interaction'] = eventProps.nonInteraction;
  }
  const gTagArguments = ['event', eventProps.eventAction, _props];
  if (!isDev) {
    try {
      // `ga` changed to `gtag`
      // https://developers.google.com/analytics/devguides/collection/gtagjs/events#send-events
      gtag(...gTagArguments);
    } catch (e) {
      console.warn(e);
    }
  } else {
    console.log(...gTagArguments);
  }
}, 100);
