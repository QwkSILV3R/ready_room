import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

interface RequestItem {
  topic: string;
  votes: number;
  status?: string;
}

export default function RequestHelpPage() {
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contactEmail: "", request: "" });
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbzf7BMYPRmksgitStksJ_ZmXJVcp0iX3g7075X_DndlWa6pfaGLh5Ynf9zjW1YbsFgsDA/exec");
        const data = await res.json();
        const formatted: RequestItem[] = data.map((entry: any) => ({
          topic: entry.topic,
          votes: Number(entry.votes) || 0,
          status: entry.status || ""
        }));
        setRequests(formatted.sort((a, b) => b.votes - a.votes));
      } catch (err) {
        console.error("Error fetching from Sheets:", err);
      }
    }
    fetchRequests();
  }, []);

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

    fetch("https://script.google.com/macros/s/AKfycbzf7BMYPRmksgitStksJ_ZmXJVcp0iX3g7075X_DndlWa6pfaGLh5Ynf9zjW1YbsFgsDA/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json" },
      body: JSON.stringify({ topic: updatedRequests[index].topic, votes: updatedRequests[index].votes })
    })
    .then((res) => res.text())
    .then((data) => console.log("Votes updated:", data))
    .catch((err) => console.error("Error updating votes:", err));
  };

  return (
    <>
      <NavBar />
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
                  <div>
                    <p className="font-medium">{req.topic}</p>
                    {req.status && (
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1
                          ${req.status === 'Planned' ? 'bg-yellow-500 text-black' : ''}
                          ${req.status === 'In Progress' ? 'bg-blue-500 text-white' : ''}
                          ${req.status === 'Complete' ? 'bg-green-500 text-white' : ''}`}
                      >
                        {req.status}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpvote(idx)}
                      className="bg-sky-600 hover:bg-sky-500 px-3 py-1 rounded-full text-sm"
                    >
                      👍 {req.votes}
                    </button>
                    {isAdmin && (
                      <select
                        onChange={(e) => {
                          const updated = [...requests];
                          updated[idx].status = e.target.value;
                          setRequests(updated);
                          fetch("https://script.google.com/macros/s/AKfycbzf7BMYPRmksgitStksJ_ZmXJVcp0iX3g7075X_DndlWa6pfaGLh5Ynf9zjW1YbsFgsDA/exec", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ topic: req.topic, status: e.target.value })
                          });
                        }}
                        value={req.status || ""}
                        className="bg-sky-700 hover:bg-sky-600 px-3 py-1 rounded-full text-sm text-white"
                      >
                        <option value="">Set Status</option>
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                      </select>
                    )}
                    <button className="bg-sky-700 hover:bg-sky-600 px-3 py-1 rounded-full text-sm">
                      📌 Pin
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="absolute top-4 right-4 text-xs text-sky-300">
  <button
    onClick={() => setShowAdminInput(!showAdminInput)}
    className="underline hover:text-white"
  >
    Admin Login
  </button>
  {showAdminInput && (
    <div className="mt-2">
      <label htmlFor="admin-password" className="sr-only">Admin Password</label>
      <input
        id="admin-password"
        type="password"
        placeholder="Enter password"
        onChange={(e) => setIsAdmin(e.target.value === 'IPAdmin')}
        className="px-2 py-1 rounded bg-sky-800 border border-sky-600 text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
      />
    </div>
  )}
</div>
      </div>
    </>
  );
}
