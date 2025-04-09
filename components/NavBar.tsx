const NavBar = () => {
  return (
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
  );
};

export default NavBar;
