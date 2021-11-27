// https://stackoverflow.com/a/37138144
function dataURIToBlob(dataUrl: string) {
  const arr = dataUrl.split(',');
  if (arr[0]) {
    const match = arr[0].match(/:(.*?);/);
    if (match) {
      const type = match[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type });
    }
  }
  return null;
}

// https://stackoverflow.com/a/37138144
export const downloadURI = (uri: string, name: string) => {
  const blob = dataURIToBlob(uri);
  if (!blob) {
    throw new Error('blob data is null')
  }
  const link = document.createElement('a');
  const objUrl = URL.createObjectURL(blob);

  link.download = name.replace(/(\.[^.]+)$/gi, '') + '.png';
  link.href = objUrl;
  link.click();
};

/**
 * Generate image.
 * @param width
 * @param height
 * @param bgColor
 */
export const generateImage = (width: number, height: number, bgColor: string) => {
  const svgEl = document.createElement('svg');
  svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgEl.setAttribute('width', String(width));
  svgEl.setAttribute('height', String(height));
  svgEl.setAttribute('style', `background-color:${bgColor}`);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgEl.outerHTML], {type:'image/svg+xml'});
    const url = URL.createObjectURL(svgBlob);
    img.onload = function() {
      URL.revokeObjectURL(url);
      resolve(this);
    };
    img.onerror = reject
    img.src = url;
  });
};
