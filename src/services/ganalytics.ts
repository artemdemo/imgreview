import _ from 'lodash';

export enum EEventCategories {
  MenuClick = 'MenuClick',
  GlobalInteraction = 'GlobalInteraction',
  Content = 'Content',
  Error = 'Error',
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
  ChangeStrokeColor = 'change stroke color',
  ChangeFontSize = 'change font size',
  ChangeStrokeWidth = 'change stroke width',
  Sketchify = 'sketchify',
  BringFront = 'bring to front',
  SendBack = 'send to back',
  MainPage = 'main page',
  AboutPage = 'about page',
  FeaturesPage = 'features page',
  GithubPage = 'github page',

  // Global interaction
  DropImage = 'drop image',
  ShownMobileWarning = 'ShownMobileWarning',
}

type TEventProps = {
  eventCategory: EEventCategories;
  eventAction: EEventActions | string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
  doNotRepeat?: boolean;
};

let prevEventSignature: string = '';
const getEventSignature = (eventProps: TEventProps) =>
  `${eventProps.eventAction}_${eventProps.eventCategory}`;

export const sendEvent = _.debounce((eventProps: TEventProps) => {
  if (
    eventProps.doNotRepeat &&
    prevEventSignature === getEventSignature(eventProps)
  ) {
    return;
  }

  const options: { [key: string]: any } = {
    event_category: eventProps.eventCategory,
  };
  if (eventProps.eventLabel) {
    options['event_label'] = eventProps.eventLabel;
  }
  if (_.isNumber(eventProps.eventValue)) {
    options['value'] = eventProps.eventValue;
  }
  if (_.isBoolean(eventProps.nonInteraction)) {
    options['non_interaction'] = eventProps.nonInteraction;
  }
  const gTagArguments = ['event', `"${eventProps.eventAction}"`, options];
  if (window.isLocalhost === false) {
    try {
      // `ga` changed to `gtag`
      // https://developers.google.com/analytics/devguides/collection/gtagjs/events#send-events
      window.gtag(...gTagArguments);
    } catch (e) {
      console.warn(e);
    }
  } else {
    console.log(...gTagArguments);
  }
  prevEventSignature = getEventSignature(eventProps);
}, 100);
