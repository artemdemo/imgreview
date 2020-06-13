export const copyToClipboard = (text) => {
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
}
