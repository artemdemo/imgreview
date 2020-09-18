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
