# React ERP UI
UI library for building ERP applications.

## Scroller
Data scrolling and buffering component, helps to deal with large data sets rendering, displaying only visible part of data. Similar to [react-virtualized](https://github.com/bvaughn/react-virtualized) or [react-window](https://github.com/bvaughn/react-window) but with a bit different API. It combines List and Grid components, meanwile providing such features as:

- Async load
- Load on demand (when scroller threshold is reached)
- Fixed cells

### Example
```javascript
const loadPage = async (page, itemsPerPage) => {
  return fetch(`/endpoint?page=${page}&size=${itemsPerPage}`);
};

const renderCell = ({ rowIndex, row, value }) => {
  return (
    <ScrollerCell key={rowIndex} row={row} index={rowIndex}>
      {value}
    </ScrollerCell>
  )
};

const ListComponent = () => {
  return (
    <Scroller
        defaultRowHeight={40}
        totalRows={1000}
        rowsPerPage={30}
        loadPage={loadPage}
        lazy
        renderCell={renderCell} />
  )
};
```

## Spreadsheet
Excel-like tabular spreadsheet component. Serves as a base component for building custom spreadsheet. Supports the following features:
- Merged cells
- Rows/columns resizing
- Rows/columns grouping
- Excel export

# Documentation
Documentation available [here](https://vadim-sartakov.github.io/react-erp-ui/docs/).

# Storybook
Interactive examples can be found [here](https://vadim-sartakov.github.io/react-erp-ui/storybook/).