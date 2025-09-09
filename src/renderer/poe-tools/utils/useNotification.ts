export const sendNotification = async (
  title = "PoE Live Search",
  message = ""
) => {
  try {
    new Notification(title, {
      body: message,
      //   icon: "src/renderer/assets/poe-icon.png",
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
