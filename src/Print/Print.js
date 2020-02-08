import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Print = ({
  print,
  onPrintChange,
  children,
  ...props
}) => {
  const [, setState] = useState();
  const windowRef = useRef();
  const setContentRef = node => {
    if (windowRef.current) return;
    windowRef.current = node && node.contentWindow ? node.contentWindow : null;
    setState({});
  };

  useEffect(() => {
    return () => windowRef.current = undefined;
  }, []);

  useEffect(() => {
    if (print) {
      const iframeWindow = windowRef.current;
      iframeWindow.print();
      //onPrintChange(false)
    }
  }, [print, onPrintChange]);

  return print ? (
    <iframe
        ref={setContentRef}
        title="printing-content"
        {...props}
        style={{ width: 0, height: 0, position: 'absolute' }}>
      {windowRef.current && ReactDOM.createPortal(children, windowRef.current.document.body)}
    </iframe>
  ) : null;
};

export default Print;