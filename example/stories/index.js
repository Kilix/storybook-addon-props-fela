import React, { PropTypes } from 'react';
import { setAddon, storiesOf } from '@kadira/storybook';
import { createComponent } from 'react-fela';

import initFelaProvider from './initFela';
import PropsAddon from '../../lib/index';

const FelaProvider = initFelaProvider();

const test = ({ color }) => ({
  fontSize: 35,
  color,
});

const Test = createComponent(test, 'h1');
Test.defaultProps = { color: '#333' };
Test.propTypes = {
  align: PropTypes.string,
  color: PropTypes.string.isRequired,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
};

setAddon(PropsAddon);

storiesOf('test', module)
  .addDecorator(FelaProvider)
  .addWithProps(
    'Paris',
    () => <Test fontSize={45} fontFamily="Roboto" align="center" color="#CAF200">Hello</Test>,
    Test,
  )
  .addWithProps('Orleans', () => <Test color="#236544">Hello</Test>, Test);

storiesOf('test 2', module).addWithProps('Paris', () => <div color="#333">test</div>);
