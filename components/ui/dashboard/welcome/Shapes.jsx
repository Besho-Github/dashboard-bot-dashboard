export const createCircle = (avatar, diameter = 256) => {
  if (!(avatar instanceof HTMLImageElement)) {
    throw new Error('The avatar must be an instance of HTMLImageElement');
  }

  const canvas = document.createElement('canvas');
  canvas.width = diameter;
  canvas.height = diameter;

  const ctx = canvas.getContext('2d');
  const radius = diameter / 2;

  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(avatar, 0, 0, diameter, diameter);

  return canvas.toDataURL();
};
