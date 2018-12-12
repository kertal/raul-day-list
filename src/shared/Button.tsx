import * as React from 'react';
import css from './Button.module.css';

enum AsyncState {
  'INITIAL',
  'LOADING',
  'SUCCESS',
  'ERROR',
}

interface IProps {
    async?: boolean;
    confirmMsg?: string;
    disabled?: boolean
    onClick: any;
    small?: boolean;
    type: string;
    children: any;
}

interface IState {
  errorMessage: string;
  asyncState: AsyncState;
}

export class Button extends React.Component<IProps, IState> {
  public static defaultProps = {
    async: false,
    confirmMsg: '',
    small: false,
    type: '',
  };

  public state = {
    asyncState: AsyncState.INITIAL,
    errorMessage: '',
  };

  private ismounted: boolean = false;

  public componentDidMount() {
    this.ismounted = true;
  }

  public componentWillUnmount() {
    this.ismounted = false;
  }

  public render() {
    const {type, small, disabled} = this.props;

    const style = {
      backgroundColor: this.getColor(type),
      color: this.getTextColor(type),
      opacity: this.getOpacity(type),
      padding: small ? '1px 4px' : undefined,
    };

    const loading = this.state.asyncState !== AsyncState.INITIAL;

    return (
      <button
        style={style}
        disabled={loading || disabled}
        onClick={this.handleClick}
        className={css.button}
      >
        {this.getIcon(type, loading)}
        {this.renderContent()}
      </button>
    );
  }

  private getIcon(type: string, loading: boolean = false) {
    if (loading) {
      return <span className={css.spinner} />;
    }

    switch (type) {
      case 'start':
        return <span> ▶ </span>;
      case 'save':
        return <span> ✔ </span>;
      case 'cancel':
        return <span> ✖ </span>;
      case 'delete':
        return <span> ✖ </span>;
      case 'edit':
        return <span> ✎ </span>;
      case 'remove':
        return <span> ✖ </span>;
      default:
        return null;
    }
  }

  private getColor(type: string) {
    switch (type) {
      case 'start':
        return '#5cb85c';
      case 'save':
        return '#5cb85c';
      case 'edit':
        return '#eff3f6';
      case 'delete':
        return '#FF0000';
      case 'remove':
        return '#eff3f6';
      default:
        return '#FFF';
    }
  }

  private getTextColor(type: string) {
    switch (type) {
      case 'start':
        return '#FFF';
      case 'save':
        return '#FFF';
      case 'edit':
        return '#000';
      case 'remove':
        return '#000';
      case 'delete':
        return '#FFF';
      default:
        return '#999';
    }
  }

  private getOpacity(type: string): number {
    switch (type) {
      case 'save':
        return 1;
      default:
        return 0.7;
    }
  }

  private handleClick = () => {
    const { confirmMsg, onClick, async } = this.props;
    if (!onClick || (confirmMsg && !window.confirm(confirmMsg))) {
      return;
    } else if (!async) {
      return onClick();
    }
    const state = { asyncState: AsyncState.LOADING };

    this.setState(state, this.handleClickAsyncCallback);
  }

  private handleClickAsyncCallback = async () => {

    try {
      await this.props.onClick();
      if (this.ismounted) {
        this.setState({ asyncState: AsyncState.SUCCESS });
      }
    } catch (e) {
      this.setState({ asyncState: AsyncState.ERROR, errorMessage: e.message });
    }

    if (this.ismounted) {
      this.setState({ asyncState: AsyncState.INITIAL });
    }
  }

  private renderContent() {
    switch (this.state.asyncState) {
      case AsyncState.SUCCESS:
        return 'Done!';
      case AsyncState.ERROR:
        return `Error ${this.state.errorMessage}`;
      default:
        return this.props.children;
    }
  }
}

export default Button;
