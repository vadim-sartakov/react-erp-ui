function triggerDownload(bytes, type, fileName) {
  const blob = new Blob([bytes], { type });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

export default triggerDownload;