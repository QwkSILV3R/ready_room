
import { useState } from "react";

interface RequestItem {
  topic: string;
  votes: number;
}

export default function RequestHelpPage() {
  const [form, setForm] = useState({ name: "", email: "", contactEmail: "", request: "" });
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duplicate = requests.some(req => req.topic.trim().toLowerCase() === form.request.trim().toLowerCase());
    if (duplicate) {
      alert("That topic has already been requested.");
      return;
    }
    setSubmitted(true);

    // Send data to Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbzf7BMYPRmksgitStksJ_ZmXJVcp0iX3g7075X_DndlWa6pfaGLh5Ynf9zjW1YbsFgsDA/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.text())
      .then((data) => console.log("Submitted to Google Sheets:", data))
      .catch((err) => console.error("Error submitting to Sheets:", err));
    const newRequest = { topic: form.request, votes: 0 };
    setRequests([...requests, newRequest]);
    setForm({ name: "", email: "", contactEmail: "", request: "" });
  };

  const handleUpvote = (index: number) => {
    const updatedRequests = [...requests];
    updatedRequests[index].votes++;
    setRequests(updatedRequests);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-800 to-sky-950 text-white px-4 py-10 md:px-8">
      <div className="max-w-2xl mx-auto bg-sky-900/80 border border-sky-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Submit a GK Request</h1>
        {submitted ? (
          <p className="text-green-300 mb-4">Thanks! Your request has been submitted.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-sky-300" htmlFor="name">Name (optional)</label>
              <input id="name" name="name" type="text"
                onChange={handleChange}
                value={form.name}
                className="w-full px-4 py-2 rounded-lg bg-sky-800 text-white border border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-sky-300" htmlFor="contactEmail">Email (optional)</label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                onChange={handleChange}
                value={form.contactEmail || ""}
                className="w-full px-4 py-2 rounded-lg bg-sky-800 text-white border border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-sky-300" htmlFor="email">Base and Flight Room (optional)</label>
              <input
                id="email"
                name="email"
                type="text"
                onChange={handleChange}
                value={form.email || ""}
                className="w-full px-4 py-2 rounded-lg bg-sky-800 text-white border border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-sky-300" htmlFor="request">What topic would you like help with?</label>
              <textarea
                id="request"
                name="request"
                required
                rows={4}
                onChange={handleChange}
                value={form.request}
                className="w-full px-4 py-2 rounded-lg bg-sky-800 text-white border border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-sky-700 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Submit
            </button>
          </form>
        )}
      </div>

      {requests.length > 0 && (
        <div className="max-w-2xl mx-auto mt-10 bg-sky-900/70 border border-sky-700 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Requested Topics</h2>
          <ul className="space-y-4">
            {requests.map((req, idx) => (
              <li key={idx} className="flex justify-between items-center bg-sky-800 p-4 rounded-lg border border-sky-700">
                <span>{req.topic}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpvote(idx)}
                    className="bg-sky-600 hover:bg-sky-500 px-3 py-1 rounded-full text-sm"
                  >
                    👍 {req.votes}
                  </button>
                  <button className="bg-sky-700 hover:bg-sky-600 px-3 py-1 rounded-full text-sm">
                    🚩 Status
                  </button>
                  <button className="bg-sky-700 hover:bg-sky-600 px-3 py-1 rounded-full text-sm">
                    📌 Pin
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
