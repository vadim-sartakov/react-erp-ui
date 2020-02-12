function triggerDownload(bytes, type, fileName) {
  var blob = new Blob([bytes], {
    type: type
  });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

export default triggerDownload;