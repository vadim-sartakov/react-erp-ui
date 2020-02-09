import ReactDOM from 'react-dom';

const asyncRender = (element, container) => new Promise(resolve => {
  setTimeout(() => {
    ReactDOM.render(element, container);
    resolve();
  });
});

const print = async (...elements) => {
  const iframe = document.createElement('iframe');
  iframe.style.width = 0;
  iframe.style.height = 0;
  iframe.style.position = 'absolute';
  document.body.appendChild(iframe);

  // Including headers with styles
  document.head.children.forEach(child => {
    if (child.tagName === 'STYLE' || child.tagName === 'LINK') {
      iframe.contentWindow.document.head.appendChild(child.cloneNode(true));
    }
  });

  iframe.contentWindow.document.body.style.overflow = 'hidden';

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const div = iframe.contentWindow.document.createElement('div');
    iframe.contentWindow.document.body.appendChild(div);
    await asyncRender(element, div);
  }

  iframe.contentWindow.print();
  iframe.contentWindow.addEventListener('afterprint', () => iframe.remove());
};

export default print;