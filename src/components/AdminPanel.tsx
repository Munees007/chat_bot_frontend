import React, { useEffect, useState } from "react";
import {
  fetchChatbotData,
  addChatbotEntry,
  updateChatbotEntry,
  deleteChatbotEntry,
  addBulkChatbotEntries,
} from "../services/api";

const languages = [
  { code: "en", name: "English" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "ml", name: "Malayalam" },
  { code: "hi", name: "Hindi" },
];

const AdminPanel: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestions, setNewQuestions] = useState<{ [key: string]: string }>({});
  const [newAnswers, setNewAnswers] = useState<{ [key: string]: string }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [useJsonUpload, setUseJsonUpload] = useState<boolean>(true); // Toggle JSON vs single entry

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const data = await fetchChatbotData();
    console.log("Fetched data:", data);
    setQuestions(data);
  };

  const handleAddOrUpdate = async () => {
    if (Object.values(newQuestions).some(q => !q.trim()) || Object.values(newAnswers).some(a => !a.trim())) {
      alert("All question and answer fields are required.");
      return;
    }

    try {
      if (editingId) {
        await updateChatbotEntry(editingId, newQuestions, newAnswers);
        setEditingId(null);
      } else {
        await addChatbotEntry(newQuestions, newAnswers);
      }

      setNewQuestions({});
      setNewAnswers({});
      loadQuestions();
      alert("Question added/updated successfully!");
    } catch (error) {
      console.error("Error updating chatbot entry:", error);
      alert("Failed to update chatbot data.");
    }
  };

  const handleEdit = (question: any, id: string) => {
    setEditingId(id);
    setNewQuestions(question.questions);
    setNewAnswers(question.answer);
  };

  const handleDelete = async (id: string) => {
    await deleteChatbotEntry(id);
    loadQuestions();
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".json")) {
      alert("Please upload a valid JSON file.");
      return;
    }

    setFile(selectedFile);
  };

  // Handle JSON file upload
  const handleJsonUpload = async () => {
    if (!file) {
      alert("No file selected.");
      return;
    }

    try {
      const data: string = await file.text();
      console.log("Raw file content:", data);

      const jsonData = JSON.parse(data);
      console.log("Parsed JSON:", jsonData);

      await addBulkChatbotEntries(jsonData);
      loadQuestions();
      alert("Bulk questions added successfully!");
      setFile(null); // Reset file after upload
    } catch (error) {
      console.error("Error parsing JSON file:", error);
      alert("Invalid JSON file format.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold text-center mb-4">Admin Panel - Manage Chatbot</h2>

      {/* Toggle between JSON upload and single entry */}
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-l ${useJsonUpload ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setUseJsonUpload(true)}
        >
          Upload JSON
        </button>
        <button
          className={`px-4 py-2 rounded-r ${!useJsonUpload ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setUseJsonUpload(false)}
        >
          Single Entry
        </button>
      </div>

      {/* JSON File Upload */}
      {useJsonUpload && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Upload JSON File</h3>
          <input type="file" accept=".json" onChange={handleFileChange} className="w-full p-2 border rounded" />
          <button
            className="w-full bg-green-500 text-white py-2 mt-2 rounded"
            onClick={handleJsonUpload}
            disabled={!file}
          >
            Submit JSON File
          </button>
        </div>
      )}

      {/* Single Entry Form */}
      {!useJsonUpload && (
        <>
          {languages.map((lang) => (
            <div key={lang.code} className="mb-4">
              <h3 className="font-bold">{lang.name}</h3>
              <input
                type="text"
                className="w-full p-2 border rounded mb-2"
                placeholder={`Enter question in ${lang.name}...`}
                value={newQuestions[lang.code] || ""}
                onChange={(e) => setNewQuestions({ ...newQuestions, [lang.code]: e.target.value })}
              />
              <input
                type="text"
                className="w-full p-2 border rounded mb-2"
                placeholder={`Enter answer in ${lang.name}...`}
                value={newAnswers[lang.code] || ""}
                onChange={(e) => setNewAnswers({ ...newAnswers, [lang.code]: e.target.value })}
              />
            </div>
          ))}

          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={handleAddOrUpdate}
          >
            {editingId ? "Update" : "Add"} Question
          </button>
        </>
      )}

      {/* Existing Questions List */}
      <div className="mt-6">
        <h3 className="font-bold mb-2">Existing Questions</h3>
        {questions.length === 0 ? (
          <p className="text-gray-500">No questions available.</p>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="p-3 border rounded my-2 bg-gray-100">
              {languages.map((lang) => (
                <div key={lang.code}>
                  <p><strong>{lang.name} Q:</strong> {q.questions[lang.code] || "N/A"}</p>
                  <p><strong>{lang.name} A:</strong> {q.answer[lang.code] || "N/A"}</p>
                </div>
              ))}
              <div className="flex justify-end mt-2">
                <button className="text-blue-500 mr-2" onClick={() => handleEdit(q, q.id)}>Edit</button>
                <button className="text-red-500" onClick={() => handleDelete(q.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
