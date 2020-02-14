import ReactDOM from 'react-dom';

var print = function print(element) {
  var iframe = document.createElement('iframe');
  iframe.style.width = 0;
  iframe.style.height = 0;
  iframe.style.position = 'absolute';
  document.body.appendChild(iframe); // Including headers with styles

  document.head.children.forEach(function (child) {
    if (child.tagName === 'STYLE' || child.tagName === 'LINK') {
      iframe.contentWindow.document.head.appendChild(child.cloneNode(true));
    }
  });
  var div = iframe.contentWindow.document.createElement('div');
  iframe.contentWindow.document.body.appendChild(div);
  ReactDOM.render(element, div);
  iframe.contentWindow.print();
  iframe.contentWindow.addEventListener('afterprint', function () {
    return iframe.remove();
  });
};

export default print;