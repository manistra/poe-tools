/**
 * Copies the provided text to the clipboard
 * @param text The text to copy to clipboard
 * @returns A promise that resolves when the text is copied
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};
