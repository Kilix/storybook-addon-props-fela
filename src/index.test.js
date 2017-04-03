import React, { PropTypes } from 'react';
import renderer from 'react-test-renderer';
import { pickProps, parseProps, renderList } from './index';

const Provider = ({ children }) => <div>{children}</div>;
const Test = ({ color, children }) => <div style={{ color }}>{children}</div>;
const TestWithDefault = ({ color, children }) => <div style={{ color }}>{children}</div>;
TestWithDefault.defaultProps = { color: '#333' };

const root = () => (
  <Provider>
    <Test color="#000">Hello</Test>
  </Provider>
);
const deepRoot = () => (
  <Provider>
    <Provider>
      <Test color="#000">Hello</Test>
    </Provider>
  </Provider>
);
const noRoot = () => <Test color="#000">Hello</Test>;
const withDefault = () => <TestWithDefault color="#000">Hello</TestWithDefault>;

test('pickProps', () => {
  const result = pickProps(TestWithDefault)(withDefault());
  const expected = {
    color: { prop: '#000', required: null, defaultProps: '#333' },
    children: { prop: 'Hello', required: null, defaultProps: undefined },
  };
  expect(result).toEqual(expected);
});

test('parseProps', () => {
  const result = parseProps({}, { cover: '#333' }, { cover: { required: true } });
  const result2 = parseProps({ cover: '#123' }, { cover: '#333' });
  expect(result).toEqual({ cover: { prop: undefined, required: true, defaultProps: '#333' } });
  expect(result2).toEqual({ cover: { prop: '#123', required: null, defaultProps: '#333' } });
});

test('renderList', () => {
  const base = {
    color: { prop: '#000', required: null, defaultProps: '#333' },
    children: { prop: 'Hello', required: null, defaultProps: undefined },
  };
  const result = renderList(base);
  const component = renderer.create(<div>{result}</div>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
