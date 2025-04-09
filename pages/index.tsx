
import { useState } from "react";
import { Plane } from "lucide-react";
import { motion } from "framer-motion";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border p-2 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function Button({ children, variant = "primary", className = "" }: { children: React.ReactNode; variant?: string; className?: string }) {
  const base =
    variant === "secondary"
      ? "bg-sky-700 hover:bg-sky-600 text-white"
      : "bg-white text-sky-900";
  return (
    <button className={`rounded-xl px-4 py-2 font-semibold ${base} ${className}`}>
      {children}
    </button>
  );
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const modules = [
    {
      title: "Checklists",
      desc: "From engine start to shutdown.",
      page: "/checklists",
    },
    {
      title: "Maneuvers",
      desc: "Pattern work, stalls, aerobatics.",
      page: "/maneuvers",
    },
    {
      title: "EPs",
      desc: "Emergency procedures and memory items.",
      page: "/eps",
    },
    {
      title: "Comms",
      desc: "Radio calls and standard phraseology.",
      page: "/comms",
    },
    {
      title: "Weather",
      desc: "Mission planning weather references.",
      page: "/weather",
    },
    {
      title: "Flight Planning",
      desc: "Cross-country prep, fuel planning, NOTAMs.",
      page: "/flight-planning",
    },
  ];

  const filteredModules = modules.filter(
    (module) =>
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <nav className="w-full bg-sky-950 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="The Ready Room Logo"
            className="h-10 w-auto transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="/request-help"
            className="text-sm text-sky-300 hover:text-white underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.5 12.75l9-5.25-18-6v21l6-6 12 6-9-9.75z"
              />
            </svg>
            Submit a GK Request
          </a>
        </div>
      </nav>

      <div className="min-h-screen relative bg-gradient-to-br from-sky-800 to-sky-950 text-white px-4 py-8 md:px-10 md:py-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-repeat opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('/clouds.svg')" }}
        ></div>

        <header className="mb-10 text-center">
          <motion.div
            className="text-3xl md:text-4xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>Welcome to The Ready Room</h1>
          </motion.div>
          <motion.div
            className="text-base md:text-lg text-sky-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p>Your UNOFFICIAL go-to resource for mastering aviation</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredModules.map((module, idx) => (
            <Card
              key={idx}
              className="bg-sky-900/80 border-sky-700 hover:shadow-lg transition"
            >
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-1 flex items-center">
                  <Plane className="w-5 h-5 mr-2 text-sky-300" />
                  {module.title}
                </h2>
                <p className="text-sky-200 text-sm md:text-base mb-2">
                  {module.desc}
                </p>
                <a href={module.page}>
                  <Button variant="secondary" className="text-sm md:text-base">
                    Learn More
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-12 text-center text-sm text-sky-300 px-4">
          <p>
            Disclaimer: This site is not endorsed or vetted by the United States
            Air Force. The content includes techniques that can be used as a
            tool to enhance formal military aviation training.
          </p>
        </footer>
      </div>
    </>
  );
}
