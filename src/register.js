import React, { Component } from 'react';
import addons from '@kadira/storybook-addons';

import compose from 'lodash/fp/compose';
import omit from 'lodash/fp/omit';
import isNil from 'lodash/fp/isNil';

export const renderList = props =>
  Object.keys(props).reduce(
    (arr, prop) => {
      arr.push(
        <div key={Math.random()} style={styles.row}>
          <span style={styles.item}>{prop}</span>
          <span style={styles.item}>
            {!isNil(props[prop].prop) ? props[prop].prop.toString() : '-'}
          </span>
          <span style={styles.item}>
            {!isNil(props[prop].required) ? String.fromCharCode(10004) : '-'}
          </span>
          <span style={styles.item}>
            {!isNil(props[prop].defaultProps) ? props[prop].defaultProps.toString() : '-'}
          </span>
        </div>,
      );
      return arr;
    },
    [],
  );

export class Props extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
    this.onAddProps = this.onAddProps.bind(this);
  }

  componentDidMount() {
    const { channel, api } = this.props;
    channel.on('kadira/props/add_props', this.onAddProps);
    this.stopListeningOnStory = api.onStory(() => this.onAddProps({}));
  }

  // This is some cleanup tasks when the Notes panel is unmounting.
  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }
    const { channel } = this.props;
    channel.removeListener('kadira/props/add_props', this.onAddNotes);
  }

  onAddProps(props) {
    this.setState(props);
  }

  render() {
    return (
      <div style={styles.props}>
        <div style={styles.header}>
          <span style={styles.head}>Prop</span>
          <span style={styles.head}>Value</span>
          <span style={styles.head}>IsRequired</span>
          <span style={styles.head}>Default</span>
        </div>
        <div style={styles.body}>
          {renderList(this.state)}
        </div>
      </div>
    );
  }
}

Props.propTypes = {
  channel: React.PropTypes.object,
  api: React.PropTypes.object,
};

// Register the addon with a unique name.
addons.register('kadira/props', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('kadira/props/panel', {
    title: 'Props',
    render: () => <Props channel={addons.getChannel()} api={api} />,
  });
});

const styles = {
  props: {
    flex: 1,
    fontFamily: 'Roboto, sans-serif',
    color: '#333',
  },
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottom: '1px solid #AFAFAF',
    fontSize: '18px',
  },
  head: {
    flex: 1,
    padding: '12px 5px',
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    fontSize: '14px',
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottom: '1px solid rgba(175, 175, 175, .3)',
  },
  item: {
    flex: 1,
    padding: '12px 5px',
  },
};
