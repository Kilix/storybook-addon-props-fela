import React from 'react';
import compose from 'lodash/fp/compose';
import omit from 'lodash/fp/omit';

export const getName = El =>
  typeof El.type === 'function'
    ? El.type.name
    : typeof El.type === 'object' ? El.type.displayName : El.type;

// React element -> Boolean
export const isProvider = El => getName(El) === 'Provider';

// React element -> Object
export const exploreChildren = target =>
  El =>
    (!isProvider(El) && target === '') || getName(El).toUpperCase() === target.toUpperCase()
      ? El
      : exploreChildren(target)(El.props.children);

export const parseProps = El =>
  Object.keys(El.type.propTypes || El.props).reduce(
    (arr, x) =>
      Object.assign({}, arr, {
        [x]: {
          value: El.type.propTypes ? El.type.propTypes[x] : El.props[x],
          default: El.type.defaultProps && El.type.defaultProps[x],
        },
      }),
    {},
  );

export const listProps = props =>
  Object.keys(props).reduce(
    (arr, prop) => {
      arr.push(
        <div key={Math.random()} style={styles.row}>
          <span style={styles.item}>{prop}</span>
          <span style={styles.item}>{props[prop].value}</span>
          <span style={styles.item}>
            {props[prop].default ? props[prop].default : null}
          </span>
        </div>,
      );
      return arr;
    },
    [],
  );

// Story -> JSX
export const PropsProvider = (target = '') =>
  story => (
    <div>
      {story()}
      <div style={styles.props}>
        <div style={styles.header}>
          <span style={styles.head}>Prop</span>
          <span style={styles.head}>Value</span>
          <span style={styles.head}>Default</span>
        </div>
        <div style={styles.body}>
          {compose(listProps, omit(['children']), parseProps, exploreChildren(target))(story())}
        </div>
      </div>
    </div>
  );

export default PropsProvider;

const styles = {
  props: {
    fontFamily: 'Roboto, sans-serif',
    color: '#333',
    maxWidth: 500,
    borderTop: '1px solid #AFAFAF',
  },
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
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
    alignItems: 'stretch',
    borderBottom: '1px solid rgba(175, 175, 175, .3)',
  },
  item: {
    flex: 1,
    padding: '12px 5px',
  },
};
