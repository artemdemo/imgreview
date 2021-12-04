import React from 'react';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { t } from '../../services/i18n';
import * as gaService from '../../services/ganalytics';

type TProps = {
  disabled: boolean;
};

class MICopyAll extends React.PureComponent<TProps> {
  static readonly defaultProps = {
    disabled: false,
  };

  onClick = () => {
    // Blur event will take some time to affect shapes,
    // therefore I'm waiting for the next available timeFrame.
    requestAnimationFrame(() => {
      canvasApi.copyAllToClipboard();
    });

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.CopyAll,
    });
  };

  render() {
    const { disabled } = this.props;
    return (
      <TopMenuItem
        onClick={this.onClick}
        disabled={disabled}
        stopPropagation={false}
      >
        {t('menu.copyAll')}
      </TopMenuItem>
    );
  }
}

export default MICopyAll;
