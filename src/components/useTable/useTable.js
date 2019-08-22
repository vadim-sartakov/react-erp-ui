import { useState, useCallback, useEffect } from 'react';

const useTable = ({
  fixRows,
  fixColumns,
  width,
  columnsRootRef,
  rowsRootRef,

  defaultColumnWidth,
  defaultRowHeight,
  rowsPerPage,
  columnsPerPage,
  onVisiblePagesChange
}) => {

  const [expandedItems, setExpandedItems] = useState({
    rows: {},
    columns: {}
  });
  const [selection, setSelection] = useState({
    rows: {},
    columns: {}
  });

  // Dimensions
  const [dimensions, setDimensions] = useState({
    columns: {
      size: [],
      offset: []
    },
    rows: {
      size: [],
      offset: []
    }
  });

  const [interaction, setInteraction] = useState(null);

  const properties = useCallback(mode => {
    if (mode === 'columns') {
      return {
        size: 'offsetWidth',
        startPadding: 'paddingLeft',
        endPadding: 'paddingRight',
        coordinate: 'clientX',
        ref: columnsRootRef
      }
    } else if (mode === 'rows') {
      return {
        size: 'offsetHeight',
        startPadding: 'paddingTop',
        endPadding: 'paddingBottom',
        coordinate: 'clientY',
        ref: rowsRootRef
      }
    } else {
      throw new Error('Invalid mode ' + mode);
    }
  }, [columnsRootRef, rowsRootRef]);

  const getNodePaddings = (mode, node) => {
    const computedStyle = getComputedStyle(node);
    const { startPadding, endPadding } = properties(mode);
    return parseFloat(computedStyle[startPadding] || '0') + parseFloat(computedStyle[endPadding] || '0');
  };

  /**
   * 
   * @param {*} event 
   * @param {*} mode should be 'columns' or 'rows' value
   * @param {*} index 
   */
  const handleResizeStart = (event, mode, index) => {
    event.persist();
    const curNode = event.target.parentElement;
    const nextNode = curNode.nextElementSibling;
    const { size, coordinate } = properties(mode);
    const curPadding = getNodePaddings(mode, curNode);
    const nextPadding = getNodePaddings(mode, nextNode);
    const curStartSize = curNode[size] - curPadding;
    const nextStartSize = nextNode[size] - nextPadding;
    setInteraction({
      mode,
      mousePressed: true,
      index,
      curNode,
      startCoordinate: event[coordinate],
      curStartSize,
      curPadding,
      nextStartSize,
      nextPadding
    });
  };

  const calculateOffset = useCallback((mode, sizes) => {
    const offset = [];
    const { ref, size } = properties(mode);
    if (!ref || !ref.current) return [];
    const allSiblingNodes = ref.current.children;
    for (let i = 0; i < (mode === 'columns' ? fixColumns : fixRows); i++) {
      if (i === 0) {
        offset.push(0);
        continue;
      }
      // Taking either html node size or calculated due to resizing size
      const prevNodeSize = ( sizes && sizes[i - 1] ) || allSiblingNodes[i - 1][size];
      const prevOffset = offset[i - 1];
      offset.push(prevOffset + prevNodeSize);
    }
    return offset;
  }, [fixRows, fixColumns, properties]);

  useEffect(function updateOffset() {
    const columnsOffset = calculateOffset('columns');
    const rowsOffset = calculateOffset('rows');
    setDimensions(state => ({
      ...state,
      columns: {
        ...state.columns,
        offset: columnsOffset
      },
      rows: {
        ...state.rows,
        offset: rowsOffset
      }
    }));
  }, [calculateOffset, width]);

  const handleMouseMove = useCallback(event => {
    if (interaction) {
      const { coordinate } = properties(interaction.mode);
      const diff = event[coordinate] - interaction.startCoordinate;
      setDimensions(state => {
        // Calculating result width
        const size = [...state[interaction.mode].size];
        size[interaction.index] = interaction.curStartSize + diff;
        size[interaction.index + 1] = interaction.nextStartSize - diff;

        const sizeWithPaddings = [];
        sizeWithPaddings[interaction.index] = size[interaction.index] + interaction.curPadding;
        sizeWithPaddings[interaction.index + 1] = size[interaction.index + 1] + interaction.nextPadding;

        const offset = calculateOffset(interaction.mode, sizeWithPaddings);
        return {
          ...state,
          [interaction.mode]: {
            size,
            offset
          }
        }
      });
    }
  }, [interaction, calculateOffset, properties]);

  const handleMouseUp = useCallback(() => {
    if (interaction) setInteraction(null);
  }, [interaction]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Visible pages
  // Source object example
  const visiblePages = {
    rows: {
      index: null, // Means root pages
      pages: [1, 2],
      children: [
        {
          index: 5,
          pages: [1, 2]
        },
        {
          index: 10,
          pages: [1, 2],
          children: [
            {
              index: 5,
              pages: [0]
            }
          ]
        }
      ]
    },
    columns: {
      index: null,
      pages: [0],
      children: [
        {
          index: 4,
          pages: [1, 2]
        }
      ]
    }
  };

  const getVisiblePages = useCallback((scroll, expandedItems, itemsPerPage, sizeArray, defaultSize) => {
    
    const getCurrentPage = () => {
      if (!sizeArray.length) {
        const pageHeight = defaultSize * itemsPerPage;
        return Math.floor( ( scroll + pageHeight / 2 ) / pageHeight);
      } else {
        const { page } = sizeArray.reduce((prev, size, index) => {  
          if (prev.scroll >= scroll) return prev;
          const isNextPage = index > 0 && index % itemsPerPage === 0;
          return {
            scroll: prev.scroll + size || defaultSize,
            page: isNextPage ? prev.page + 1 : prev.page,
            itemOnPage: isNextPage ? prev.itemOnPage - itemsPerPage : prev.itemOnPage + 1
          };
        }, { scroll: 0, page: 0, itemOnPage: 0 });

        return page;
      };
    };

    return expandedItems.map(expandedItem => {

      const currentPage = getCurrentPage();
      const visiblePages = currentPage === 0 ? [currentPage] : [currentPage - 1, currentPage];

      // Determinig if expanded item is visible on any of pages
      //const 

      const expandedItemTop = 0;
      const children = expandedItem.children && getVisiblePages(currentPage - expandedItemTop, expandedItem.children);
      return { visiblePages, children };
    });

  }, []);

  const handleScroll = event => {
    const visibleRowsPages = getVisiblePages(event.scrollTop, expandedItems.rows, rowsPerPage, dimensions.rows, defaultRowHeight);
    const visibleColumnsPages = getVisiblePages(event.scrollLeft, expandedItems.columns, columnsPerPage, dimensions.columns, defaultColumnWidth);
    onVisiblePagesChange({
      rows: visibleRowsPages,
      columns: visibleColumnsPages
    });
  };

  return {
    dimensions,
    onResize: handleResizeStart,
    handleScroll
  };

};

export default useTable;