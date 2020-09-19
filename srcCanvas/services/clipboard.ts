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

/**
 *
 * @param dataUrl
 * @source https://stackoverflow.com/a/45582858
 */
export const copyDataUrlAsImage = (dataUrl) => {
    const selectText = (element: HTMLElement) => {
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(element);
            selection?.removeAllRanges();
            selection?.addRange(range);
        } else {
            throw new Error('Can\'t select text')
        }
    }

    const imgEl = document.createElement('img');
    imgEl.src = dataUrl;

    const containerEl = document.createElement('div');
    containerEl.contentEditable = 'true';
    containerEl.appendChild(imgEl);
    document.body.appendChild(containerEl);

    selectText(containerEl);
    document.execCommand('Copy');
    document.body.removeChild(containerEl);
};
