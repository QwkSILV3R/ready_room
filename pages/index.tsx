import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-br from-sky-800 to-sky-950 text-white px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to The Ready Room</h1>
          <p className="text-sky-300 mb-6">
            Your unofficial go-to resource for mastering aviation in the T-6 Texan II.
          </p>
        </div>
      </main>
    </>
  );
}
