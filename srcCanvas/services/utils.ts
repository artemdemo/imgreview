const fallbackCopyTextToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        return document.execCommand('cut');
    } catch (ex) {
        console.warn('Copy to clipboard failed.', ex);
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
};

/**
 * Copy text to the clipboard
 * @param text
 * @source https://stackoverflow.com/a/30810322
 */
export const copyToClipboard = (text) => {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
    } else {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Async: Copying to clipboard was successful!
            }, (err) => {
                console.error('Async: Could not copy text: ', err);
            });
    }
}

function SelectText(element) {
    var doc = document;
    // @ts-ignore
    if (doc.body.createTextRange) {
        // @ts-ignore
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        // @ts-ignore
        selection.removeAllRanges();
        // @ts-ignore
        selection.addRange(range);
    }
}

/**
 *
 * @param dataUrl
 * @source https://stackoverflow.com/a/45582858
 */
export const copyDataUrlAsImage = (dataUrl) => {
    var img = document.createElement('img');
    img.src = dataUrl;

    var div = document.createElement('div');
    div.contentEditable = 'true';
    div.appendChild(img);
    document.body.appendChild(div);

// do copy
    SelectText(div);
    document.execCommand('Copy');
    document.body.removeChild(div);
};
