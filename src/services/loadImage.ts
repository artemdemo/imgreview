const loadImage = (file) =>
  new Promise((resolve) => {
    const FR = new FileReader();
    FR.onload = (e) => {
      const image = new Image();
      image.addEventListener('load', () => {
        const name = file.name.split('.').slice(0, -1).join('.');
        resolve({
          image,
          name,
        });
      });
      // @ts-ignore
      image.src = e.target.result;
    };
    FR.readAsDataURL(file);
  });

export default loadImage;
