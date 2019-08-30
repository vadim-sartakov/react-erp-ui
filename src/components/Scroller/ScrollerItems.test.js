import React from 'react';
import { mount } from 'enzyme';
import ScrollerItems from './ScrollerItems';

describe('StaticScrollerItems', () => {

  it('renders flat value', () => {
    const value = [
      { value: 0 },
      { value: 1 }
    ];
    const meta = {
      paddings: {
        start: 10,
        end: 20
      },
      page: 0,
      children: [
        { size: 10 },
        { size: 20 }
      ]
    };
    const children = jest.fn();
    mount((
      <ScrollerItems
          value={value}
          meta={meta}>
        {children}
      </ScrollerItems>
    ));
    expect(children).toHaveBeenCalledTimes(2);
    expect(children.mock.calls[0][0]).toEqual({ value: 0 });
    expect(children.mock.calls[1][0]).toEqual({ value: 1 });

    expect(children.mock.calls[0][1]).toEqual({ size: 10 });
    expect(children.mock.calls[1][1]).toEqual({ size: 20 });

    expect(children.mock.calls[0][2]).toEqual(0);
    expect(children.mock.calls[1][2]).toEqual(0);
  });

  it('does not render nested value when not expanded', () => {
    const value = [
      { value: 0 },
      {
        value: 1,
        children: [
          { value: 2 },
          { value: 3 }
        ]
      }
    ];
    const meta = {
      paddings: {
        start: 10,
        end: 20
      },
      page: 0,
      children: [
        { size: 10 },
        { size: 20 }
      ]
    };
    const children = jest.fn();
    mount((
      <ScrollerItems
          value={value}
          meta={meta}>
        {children}
      </ScrollerItems>
    ));
    expect(children).toHaveBeenCalledTimes(2);
    expect(children.mock.calls[0][0]).toEqual({ value: 0 });
    expect(children.mock.calls[1][0]).toHaveProperty('value', 1);
    expect(children.mock.calls[1][0]).toHaveProperty('children');

    expect(children.mock.calls[0][1]).toEqual({ size: 10 });
    expect(children.mock.calls[1][1]).toEqual({ size: 20 });

    expect(children.mock.calls[0][2]).toEqual(0);
    expect(children.mock.calls[1][2]).toEqual(0);
  });

  it('renders nested value when expanded', () => {
    const value = [
      { value: 0 },
      {
        value: 1,
        children: [
          { value: 2 },
          { value: 3 }
        ]
      }
    ];
    const meta = {
      paddings: {
        start: 10,
        end: 20
      },
      page: 0,
      children: [
        { size: 10 },
        {
          size: 20,
          expanded: true,
          paddings: { start: 20, end: 30 },
          children: [
            { size: 50 },
            { size: 60 },
          ]
        }
      ]
    };
    const children = jest.fn();
    mount((
      <ScrollerItems
          value={value}
          meta={meta}>
        {children}
      </ScrollerItems>
    ));
    expect(children).toHaveBeenCalledTimes(4);
    expect(children.mock.calls[0][0]).toEqual({ value: 0 });
    expect(children.mock.calls[1][0]).toHaveProperty('value', 1);
    expect(children.mock.calls[1][0]).toHaveProperty('children');
    expect(children.mock.calls[3][0]).toEqual({ value: 3 });

    expect(children.mock.calls[0][1]).toEqual({ size: 10 });
    expect(children.mock.calls[1][1]).toHaveProperty('size', 20);
    expect(children.mock.calls[1][1]).toHaveProperty('paddings', { start: 20, end: 30 });
    expect(children.mock.calls[3][1]).toHaveProperty('size', 60);
    expect(children.mock.calls[3][1]).not.toHaveProperty('paddings');

    expect(children.mock.calls[0][2]).toEqual(0);
    expect(children.mock.calls[1][2]).toEqual(0);
    expect(children.mock.calls[2][2]).toEqual(1);
    expect(children.mock.calls[3][2]).toEqual(1);
  });

});