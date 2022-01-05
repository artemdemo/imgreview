export const drawImageScaled = (img, canvas, context) => {
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.min(hRatio, vRatio);
  const centerShiftX = (canvas.width - img.width * ratio) / 2;
  const centerShiftY = (canvas.height - img.height * ratio) / 2;
  context.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShiftX,
    centerShiftY,
    img.width * ratio,
    img.height * ratio,
  );
};

export const drawImageAsIs = (img, canvas, context) => {
  const shiftX = (canvas.width - img.width) / 2;
  const shiftY = (canvas.height - img.height) / 2;
  context.drawImage(img, shiftX, shiftY);
};
