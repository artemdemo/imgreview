import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import OpenImageDialog from '../OpenImageDialog/OpenImageDialog';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';

type TProps = {
  disabled: boolean;
};

type TState = {
  open: boolean;
};

class MIOpenImage extends React.PureComponent<TProps, TState> {
  static readonly defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  onClick = () => {
    this.setState(
      {
        open: true,
      },
      () => {
        requestAnimationFrame(() => {
          this.setState({
            open: false,
          });
        });
      }
    );

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.OpenImage,
    });
  };

  render() {
    const { disabled } = this.props;
    return (
      <>
        <TopMenuItem
          onClick={this.onClick}
          disabled={disabled}
          title={t('menu.openImage')}
          stopPropagation={false}
        >
          <FontAwesomeIcon icon={faFileImage} />
        </TopMenuItem>
        <OpenImageDialog open={this.state.open} />
      </>
    );
  }
}

export default MIOpenImage;
