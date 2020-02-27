import { buildTree } from './';

describe('buildTree', () => {
  it('should build tree with default params', async () => {
    const array = [
      { id: 0, name: '1' },
      { id: 1, name: '1.1', parent: 0 },
      { id: 2, name: '1.1.1', parent: 1 },
      { id: 3, name: '1.2', parent: 0 },
      { id: 4, name: '2' },
      { id: 5, name: '2.1', parent: 4 },
      { id: 6, name: '3' }
    ];
    const result = await buildTree(array);
    expect(result).toEqual([
      {
        id: 0,
        name: '1',
        children: [
          { id: 1, name: '1.1', parent: 0, children: [{ id: 2, name: '1.1.1', parent: 1 }] },
          { id: 3, name: '1.2', parent: 0 },
        ]
      },
      { id: 4, name: '2', children: [{ id: 5, name: '2.1', parent: 4 }] },
      { id: 6, name: '3' }
    ]);
  });
});