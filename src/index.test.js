import React from 'react';
import renderer from 'react-test-renderer';
import { isProvider, exploreChildren, parseProps, listProps } from './index';

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

test('isProvider', () => {
  const provider = { type: { name: 'Provider' } };
  const noProvider = { type: { name: 'Hello' } };

  expect(isProvider(provider)).toBe(true);
  expect(isProvider(noProvider)).toBe(false);
});

test('exploreChildren', () => {
  expect(exploreChildren(root())).toEqual(noRoot());
  expect(exploreChildren(deepRoot())).toEqual(noRoot());
  expect(exploreChildren(noRoot())).toEqual(noRoot());
});

test('parseProps', () => {
  const result = parseProps(noRoot());
  const resultWithDefault = parseProps(withDefault());

  const expected = {
    color: { value: '#000', default: undefined },
    children: { value: 'Hello', default: undefined },
  };
  const expectedWithDefault = {
    color: { value: '#000', default: '#333' },
    children: { value: 'Hello', default: undefined },
  };

  expect(resultWithDefault).toEqual(expectedWithDefault);
  expect(result).toEqual(expected);
});

test('listProps', () => {
  const props = { children: 'Hello', color: '#000' };
  const els = listProps(props);
  els.map(el => {
    const component = renderer.create(el);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
