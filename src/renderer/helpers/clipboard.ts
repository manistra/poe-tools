/**
 * Copies the provided text to the clipboard
 * @param text The text to copy to clipboard
 * @returns A promise that resolves when the text is copied
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    // Try the modern Clipboard API first
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");
  } catch (err) {
    console.log("Clipboard API failed, trying fallback method");

    try {
      // Fallback for when Clipboard API fails (common in games or certain contexts)
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      // Execute the copy command
      const successful = document.execCommand("copy");

      // Clean up
      document.body.removeChild(textArea);

      if (successful) {
        console.log("Text copied to clipboard using fallback");
      } else {
        throw new Error("Fallback clipboard copy failed");
      }
    } catch (fallbackErr) {
      console.error("All clipboard methods failed: ", fallbackErr);
    }
  }
};
