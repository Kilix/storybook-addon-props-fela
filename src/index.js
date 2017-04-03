import React from 'react';
import compose from 'lodash/fp/compose';
import omit from 'lodash/fp/omit';
import isNil from 'lodash/fp/isNil';

const filterProps = omit(['children']);
export const parseProps = (props, defaultProps, propTypes) =>
  Object.keys(!isNil(propTypes) ? propTypes : props).reduce(
    (arr, x) =>
      Object.assign({}, arr, {
        [x]: {
          prop: props[x],
          required: !isNil(propTypes) ? propTypes[x].required : null,
          defaultProps: !isNil(defaultProps) ? defaultProps[x] : null,
        },
      }),
    {},
  );
export const pickProps = raw =>
  story => {
    const defaultProps = !isNil(raw.defaultProps) ? raw.defaultProps : null;
    const propTypes = !isNil(story.type.__docgenInfo)
      ? story.type.__docgenInfo.props
      : !isNil(raw.propTypes) ? raw.propTypes : null;
    return parseProps(story.props, defaultProps, propTypes);
  };

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
            {String.fromCharCode(!isNil(props[prop].required) ? 10004 : 10007)}
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
export default {
  addWithProps(kind, story, raw = {}) {
    const customStory = () => (
      <div>
        {story()}
        <div style={styles.props}>
          <div style={styles.header}>
            <span style={styles.head}>Prop</span>
            <span style={styles.head}>Value</span>
            <span style={styles.head}>IsRequired</span>
            <span style={styles.head}>Default</span>
          </div>
          <div style={styles.body}>
            {compose(renderList, filterProps, pickProps(raw))(story())}
          </div>
        </div>
      </div>
    );
    return this.add(kind, customStory);
  },
};

const styles = {
  props: {
    fontFamily: 'Roboto, sans-serif',
    color: '#333',
    borderTop: '1px solid #AFAFAF',
    marginTop: 35,
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
