import React from "react";
import { toast, ToastBar, Toaster } from "react-hot-toast";

const baseStyle: React.CSSProperties = {
  display: "inline-flex",
  minHeight: "2.75rem",
  maxWidth: "500px",
  alignItems: "center",
  justifyContent: "center",
  gap: "2rem",
  borderRadius: "0.5rem",
  paddingLeft: "0.75rem",
  paddingRight: "0.75rem",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  margin: 0,
};

const successStyle: React.CSSProperties = {
  backgroundColor: "#E8FFF0",
  color: "#2E5F3E",
};
const errorStyle: React.CSSProperties = {
  backgroundColor: "#FFE9F1",
  color: "#7C1739",
};

const Toast: React.FC = () => (
  <Toaster
    position="top-right"
    containerStyle={{ top: 90 }}
    toastOptions={{
      style: baseStyle,
      success: {
        style: { ...baseStyle, ...successStyle },
      },
      error: {
        style: { ...baseStyle, ...errorStyle },
      },
    }}
  >
    {(t) => (
      <ToastBar toast={t}>
        {({ message }) => (
          <>
            {message}
            {t.type !== "loading" && (
              <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                CLOSE
              </button>
            )}
          </>
        )}
      </ToastBar>
    )}
  </Toaster>
);

export default Toast;
