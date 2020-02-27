import { relativeArrayToTree, treeToLeveledArray } from './';

describe('tree', () => {
  describe('relativeArrayToTree', () => {
    it('should convert relative array to tree with default params', async () => {
      const array = [
        { id: 0, name: '1' },
        { id: 1, name: '1.1', parent: 0 },
        { id: 2, name: '1.1.1', parent: 1 },
        { id: 3, name: '1.2', parent: 0 },
        { id: 4, name: '2' },
        { id: 5, name: '2.1', parent: 4 },
        { id: 6, name: '3' }
      ];
      const result = await relativeArrayToTree(array);
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

  describe('treeToLeveledArray', () => {
    it('should convert tree to leveled array', async () => {
      const tree = [
        {
          string: '1',
          children: [
            { string: '1.1', children: [{ string: '1.1.1' }] },
            { string: '1.2' }
          ]
        },
        {
          string: '2',
          children: [
            { string: '2.1' },
            { string: '2.2' }
          ]
        }
      ];
      const result = await treeToLeveledArray(tree);
      expect(result).toEqual([
        { string: '1' },
        { string: '1.1', _level: 1 },
        { string: '1.1.1', _level: 2 },
        { string: '1.2', _level: 1 },
        { string: '2' },
        { string: '2.1', _level: 1 },
        { string: '2.2', _level: 1 }
      ]);
    });
  });

});