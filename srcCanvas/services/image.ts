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
    throw new Error('blob data is null');
  }
  const link = document.createElement('a');
  const objUrl = URL.createObjectURL(blob);

  link.download = name.replace(/(\.[^.]+)$/gi, '') + '.png';
  link.href = objUrl;
  link.click();
};

// removes transparent edges
// https://stackoverflow.com/a/45873660
export const trimCanvas = (ctx: CanvasRenderingContext2D) => {
  let x, y, w, h, top, left, right, bottom, data, idx1, idx2, found, imgData;
  w = ctx.canvas.width;
  h = ctx.canvas.height;
  if (!w && !h) {
    return false;
  }
  imgData = ctx.getImageData(0, 0, w, h);
  data = new Uint32Array(imgData.data.buffer);
  idx1 = 0;
  idx2 = w * h - 1;
  found = false;
  // search from top and bottom to find first rows containing a non-transparent pixel.
  for (y = 0; y < h && !found; y += 1) {
    for (x = 0; x < w; x += 1) {
      if (data[idx1++] && !top) {
        top = y + 1;
        if (bottom) {
          // top and bottom found then stop the search
          found = true;
          break;
        }
      }
      if (data[idx2--] && !bottom) {
        bottom = h - y - 1;
        if (top) {
          // top and bottom found then stop the search
          found = true;
          break;
        }
      }
    }
    if (y > h - y && !top && !bottom) {
      return false;
    } // image is completely blank so do nothing
  }
  // @ts-ignore
  top -= 1; // correct top
  found = false;
  // search from left and right to find first column containing a non transparent pixel.
  for (x = 0; x < w && !found; x += 1) {
    // @ts-ignore
    idx1 = top * w + x;
    // @ts-ignore
    idx2 = top * w + (w - x - 1);
    // @ts-ignore
    for (y = top; y <= bottom; y += 1) {
      if (data[idx1] && !left) {
        left = x + 1;
        if (right) {
          // if left and right found then stop the search
          found = true;
          break;
        }
      }
      if (data[idx2] && !right) {
        right = w - x - 1;
        if (left) {
          // if left and right found then stop the search
          found = true;
          break;
        }
      }
      idx1 += w;
      idx2 += w;
    }
  }
  // @ts-ignore
  left -= 1; // correct left
  // @ts-ignore
  if (w === right - left + 1 && h === bottom - top + 1) {
    return true;
  } // no need to crop if no change in size
  // @ts-ignore
  w = right - left + 1;
  // @ts-ignore
  h = bottom - top + 1;
  ctx.canvas.width = w;
  ctx.canvas.height = h;
  // @ts-ignore
  ctx.putImageData(imgData, -left, -top);
  return true;
};

/**
 * Generate image.
 * @param width
 * @param height
 * @param bgColor
 */
export const generateImage = (
  width: number,
  height: number,
  bgColor: string,
) => {
  const svgEl = document.createElement('svg');
  svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgEl.setAttribute('width', String(width));
  svgEl.setAttribute('height', String(height));
  svgEl.setAttribute('style', `background-color:${bgColor}`);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgEl.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = function () {
      URL.revokeObjectURL(url);
      resolve(this);
    };
    img.onerror = reject;
    img.src = url;
  });
};
