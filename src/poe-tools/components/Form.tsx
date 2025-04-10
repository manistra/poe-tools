import React from "react";

interface FormProps {
  sessionId: string;
  searchUrl: string;
  isConnected: boolean;
  error: string | null;
  messages: Array<{
    time: string;
    items: Array<{
      length: number;
    }>;
  }>;
  setSessionId: (value: string) => void;
  setSearchUrl: (value: string) => void;
  connect: () => void;
  disconnect: () => void;
}

const Form: React.FC<FormProps> = ({
  sessionId,
  searchUrl,
  isConnected,
  error,
  messages,
  setSessionId,
  setSearchUrl,
  connect,
  disconnect,
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-md p-2">
      <div className="flex flex-col gap-2">
        <label className="text-xs">Session ID:</label>
        <input
          type="text"
          className="bg-slate-700 p-2 rounded-md"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Your PoE Session ID"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs">Trade URL:</label>
        <input
          className="bg-slate-700 p-2 rounded-md"
          type="text"
          value={searchUrl}
          onChange={(e) => setSearchUrl(e.target.value)}
          placeholder="https://www.pathofexile.com/trade/search/League/SearchID"
        />
      </div>
    </div>
  );
};

export default Form;
