// clipboard 粘贴板
export const copyToken = async (textToCopy: any, callback?: () => void) => {
  // const textToCopy = `Bearer ${getToken(TOKEN)}`;

  if (navigator.clipboard && navigator.permissions) {
    await navigator.clipboard.writeText(textToCopy);
  } else {
    const textArea = document.createElement('textArea') as HTMLTextAreaElement;
    textArea.value = textToCopy;
    textArea.style.width = '0';
    textArea.style.position = 'fixed';
    textArea.style.left = '-999px';
    textArea.style.top = '10px';
    textArea.setAttribute('readonly', 'readonly');
    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    // message.success('Text copied to clipboar');
  }
  callback && callback();
};
