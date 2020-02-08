import { moveSelection } from './useKeyboard';

describe('useKeyboard', () => {
  const selectedCells = [
    {
      start: { row: 10, column: 10 },
      end: { row: 10, column: 10 }
    }
  ];
  it('should move east', () => {
    const result = moveSelection({ selectedCells, columnOffset: 1 });
    expect(result).toEqual([{ start: { row: 10, column: 11 }, end: { row: 10, column: 11 } }]);
  });
  it('should move west', () => {
    const result = moveSelection({ selectedCells, columnOffset: -1 });
    expect(result).toEqual([{ start: { row: 10, column: 9 }, end: { row: 10, column: 9 } }]);
  });
  it('should move south', () => {
    const result = moveSelection({ selectedCells, rowOffset: 1 });
    expect(result).toEqual([{ start: { row: 11, column: 10 }, end: { row: 11, column: 10 } }]);
  });
  it('should move north', () => {
    const result = moveSelection({ selectedCells, rowOffset: -1 });
    expect(result).toEqual([{ start: { row: 9, column: 10 }, end: { row: 9, column: 10 } }]);
  });

  it('should append east', () => {
    const result = moveSelection({ selectedCells, append: true, columnOffset: 1 });
    expect(result).toEqual([{ start: { row: 10, column: 10 }, end: { row: 10, column: 11 } }]);
  });
  it('should append west', () => {
    const result = moveSelection({ selectedCells, append: true, columnOffset: -1 });
    expect(result).toEqual([{ start: { row: 10, column: 10 }, end: { row: 10, column: 9 } }]);
  });
  it('should append south', () => {
    const result = moveSelection({ selectedCells, append: true, rowOffset: 1 });
    expect(result).toEqual([{ start: { row: 10, column: 10 }, end: { row: 11, column: 10 } }]);
  });
  it('should append north', () => {
    const result = moveSelection({ selectedCells, append: true, rowOffset: -1 });
    expect(result).toEqual([{ start: { row: 10, column: 10 }, end: { row: 9, column: 10 } }]);
  });

  it('should move east to merged cell', () => {
    const mergedCells = [{ start: { row: 10, column: 11 }, end: { row: 15, column: 15 } }];
    const result = moveSelection({ selectedCells, mergedCells, columnOffset: 1 });
    expect(result).toEqual([{ start: { row: 15, column: 11 }, end: { row: 10, column: 15 } }]);
  });
  it('should move west to merged cell', () => {
    const mergedCells = [{ start: { row: 5, column: 5 }, end: { row: 15, column: 9 } }];
    const result = moveSelection({ mergedCells, selectedCells, columnOffset: -1 });
    expect(result).toEqual([{ start: { row: 15, column: 9 }, end: { row: 5, column: 5 } }]);
  });
  it('should move south to merged cell', () => {
    const mergedCells = [{ start: { row: 11, column: 5 }, end: { row: 15, column: 15 } }];
    const result = moveSelection({ mergedCells, selectedCells, rowOffset: 1 });
    expect(result).toEqual([{ start: { row: 11, column: 15 }, end: { row: 15, column: 5 } }]);
  });
  it('should move north to merged cell', () => {
    const mergedCells = [{ start: { row: 5, column: 5 }, end: { row: 9, column: 15 } }];
    const result = moveSelection({ mergedCells, selectedCells, rowOffset: -1 });
    expect(result).toEqual([{ start: { row: 9, column: 15 }, end: { row: 5, column: 5 } }]);
  });

  it('should move north to merged cell then east', () => {
    const mergedCells = [{ start: { row: 5, column: 5 }, end: { row: 9, column: 15 } }];
    const firstResult = moveSelection({ mergedCells, selectedCells, rowOffset: -1 });
    const result = moveSelection({ mergedCells, selectedCells: firstResult, columnOffset: 1 });
    expect(result).toEqual([{ start: { row: 5, column: 16 }, end: { row: 5, column: 16 } }]);
  });
  it('should move north to merged cell then west', () => {
    const mergedCells = [{ start: { row: 5, column: 5 }, end: { row: 9, column: 15 } }];
    const firstResult = moveSelection({ mergedCells, selectedCells, rowOffset: -1 });
    const result = moveSelection({ mergedCells, selectedCells: firstResult, columnOffset: -1 });
    expect(result).toEqual([{ start: { row: 5, column: 4 }, end: { row: 5, column: 4 } }]);
  });
});