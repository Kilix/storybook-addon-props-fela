import React from 'react';
import addons from '@kadira/storybook-addons';
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

export default {
  addWithProps(kind, story, raw = {}) {
    const channel = addons.getChannel();
    const customStory = () => {
      const props = compose(filterProps, pickProps(raw))(story());
      channel.emit('kadira/props/add_props', props);
      return story();
    };
    return this.add(kind, customStory);
  },
};
