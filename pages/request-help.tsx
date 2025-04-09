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
    console.log("⏳ Starting fetch from Google Sheets...");
  
    async function fetchRequests() {
      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbzf7BMYPRmksgitStksJ_ZmXJVcp0iX3g7075X_DndlWa6pfaGLh5Ynf9zjW1YbsFgsDA/exec");
  
        if (!res.ok) {
          console.error("❌ Response not OK:", res.status, res.statusText);
          return;
        }
  
        const data = await res.json();
        console.log("✅ Fetched data:", data);
  
        const formatted = data.map((entry: any) => ({
          topic: entry.topic,
          votes: Number(entry.votes) || 0,
          status: entry.status || ""
        }));
        console.log("🧩 Formatted entries:", formatted);
  
        setRequests(formatted.sort((a: RequestItem, b: RequestItem) => b.votes - a.votes));
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    }
  
    fetchRequests();
  }, []);
  

  return <div>Page loaded. Check console logs.</div>;
}
