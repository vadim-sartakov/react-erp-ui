import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Print = ({
  print,
  onPrintChange,
  children,
  ...props
}) => {
  const [, setState] = useState();
  const contentRef = useRef();
  const setContentRef = node => {
    if (contentRef.current) return;
    contentRef.current = node && node.contentWindow ? node.contentWindow.document.body : null;
    setState({});
  };

  useEffect(() => {
    return () => contentRef.current = undefined;
  }, []);

  useEffect(() => {
    if (print) {
      /*const iframeWindow = iframeRef.current.contentWindow;
      iframeWindow.document.open();
      iframeWindow.document.write(content.innerHTML);
      iframeWindow.document.close();
      iframeWindow.focus();
      iframeWindow.print();*/
    }
  }, [print, onPrintChange]);

  return print ? (
    <iframe ref={setContentRef} title="printing-content" {...props}>
      {contentRef.current && ReactDOM.createPortal(children, contentRef.current)}
    </iframe>
  ) : null;
};

export default Print;