// src/App.tsx
import React, { useState } from "react";
import Chatbot from "./components/Chatbot";
import AdminPanel from "./components/AdminPanel";

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="flex flex-col items-center h-full bg-gray-200 p-4">
      <button
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded"
        onClick={() => setIsAdmin(!isAdmin)}
      >
        {isAdmin ? "Go to Chatbot" : "Go to Admin Panel"}
      </button>

      {isAdmin ? <AdminPanel /> : <Chatbot />}
    </div>
  );
};

export default App;
