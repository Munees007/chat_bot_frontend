import axios from "axios";

const API_URL = "https://chat-bot-backend-sooty.vercel.app/chatbot"; // Adjust if hosted

// Get chatbot response
export const getChatbotResponse = async (userInput: string, lang: string) => {
  const response = await axios.get(`${API_URL}`, {
    params: { user_input: userInput, lang },
  });
  return response.data;
};

// Fetch all chatbot data
export const fetchChatbotData = async () => {
  const response = await axios.get(`${API_URL}/data`);
  return response.data;
};

// Add a new chatbot entry
export const addChatbotEntry = async (question: object, answer: object) => {
  const response = await axios.post(`${API_URL}/add`, { question, answer });
  return response.data;
};

// Update chatbot entry
export const updateChatbotEntry = async (
  entryId: string,
  question: object,
  answer: object
) => {
  const response = await axios.put(`${API_URL}/update/${entryId}`, {
    question,
    answer,
  });
  return response.data;
};

// Delete chatbot entry
export const deleteChatbotEntry = async (entryId: string) => {
  const response = await axios.delete(`${API_URL}/delete/${entryId}`);
  return response.data;
};

// Bulk add chatbot entries from JSON
export const addBulkChatbotEntries = async (jsonData:any) => {
    const response = await axios.post(`${API_URL}/add-questions`, jsonData);
    return response.data;
  };
  