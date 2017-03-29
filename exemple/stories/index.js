import React, { PropTypes } from 'react';
import { storiesOf } from '@kadira/storybook';
import { createComponent } from 'react-fela';

import initFelaProvider from './initFela';
import PropsProvider from '../../lib/index';

const FelaProvider = initFelaProvider();

const test = ({ color }) => ({
  fontSize: 35,
  color,
});

const Test = createComponent(test, 'h1');
Test.defaultProps = { color: '#333' };
Test.propsTypes = {
  color: PropTypes.string,
};

storiesOf('test', module)
  .addDecorator(FelaProvider)
  .addDecorator(PropsProvider)
  .add('Paris', () => (
    <Test fontSize={45} fontFamily="Roboto" align="center" color="#CAF200">Hello</Test>
  ))
  .add('Orleans', () => <Test color="#236544">Hello</Test>);

storiesOf('test 2', module)
  .addDecorator(PropsProvider)
  .add('Paris', () => <div color="#333">test</div>);
