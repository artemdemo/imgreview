import Promise from 'bluebird';

/**
 * Check that font awesome has been loaded
 * @type {Promise<any>}
 * @link https://stackoverflow.com/a/24618517
 */
const waitForFontAwesome = new Promise((resolve, reject) => {
    let retries = 50;

    const checkReady = function() {
        retries -= 1;
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 20;
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(0,0,0,1.0)';
        context.fillRect(0, 0, 20, 20);
        context.font = '16pt FontAwesome';
        context.textAlign = 'center';
        context.fillStyle = 'rgba(255,255,255,1.0)';
        context.fillText('\uf0c8', 10, 18);
        const { data } = context.getImageData(2, 10, 1, 1);
        if (data[0] !== 255 && data[1] !== 255 && data[2] !== 255) {
            if (retries > 0) {
                setTimeout(checkReady, 300);
            } else {
                reject();
            }
        } else {
            resolve();
        }
    };

    checkReady();
});

export default waitForFontAwesome;
