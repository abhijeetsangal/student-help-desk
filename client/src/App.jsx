import QuerySection from "./components/QuerySection";
import Chatbot from "./components/Chatbot";
import { useEffect, useState } from "react";
import AdminDashboard from "./components/AdminDashboard";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
  () => localStorage.getItem("campusTheme") === "dark"
);

useEffect(() => {
  document.documentElement.classList.toggle("dark", darkMode);
  localStorage.setItem("campusTheme", darkMode ? "dark" : "light");
}, [darkMode]);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
  });

  // Verify saved login when application opens
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("studentHelpDeskToken");

      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Session expired");

        const data = await response.json();
        setUser(data.user);
        localStorage.setItem(
          "studentHelpDeskUser",
          JSON.stringify(data.user)
        );
      } catch {
        localStorage.removeItem("studentHelpDeskToken");
        localStorage.removeItem("studentHelpDeskUser");
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";

      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? { email: form.email, password: form.password }
            : form
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("studentHelpDeskToken", data.token);
      localStorage.setItem(
        "studentHelpDeskUser",
        JSON.stringify(data.user)
      );

      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("studentHelpDeskToken");
    localStorage.removeItem("studentHelpDeskUser");
    setUser(null);
    setIsLogin(true);
    setError("");
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Checking your session...
      </div>
    );
  }

  // STUDENT DASHBOARD
  // ADMIN DASHBOARD
if (user && user.role === "admin") {
  return (
<AdminDashboard
  user={user}
  onLogout={logout}
  darkMode={darkMode}
  setDarkMode={setDarkMode}
/>
  );
}

// STUDENT DASHBOARD
if (user) {
const features = [
  {
    icon: "🤖",
    title: "AI Assistant",
    description: "Get instant answers to your college-related questions.",
    action: "Chat now",
    target: "#ai-assistant",
  },
  {
    icon: "📝",
    title: "Submit a Query",
    description: "Raise an issue or ask the college administration for help.",
    action: "Submit query",
    target: "#query-section",
  },
  {
    icon: "📋",
    title: "My Queries",
    description: "Track your submitted queries and check their status.",
    action: "View queries",
    target: "#query-section",
  },
];

    return (
     <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"> 

           <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-2 text-xl">
                🎓
              </div>
              <div>
                <h1 className="text-lg font-bold">CampusAssist</h1>
                <p className="text-xs text-slate-400">
                  Student Help Desk
                </p>
              </div>
            </div>

<div className="flex items-center gap-3">
  <button
    onClick={() => setDarkMode((prev) => !prev)}
    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
  >
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>

  <button
    onClick={logout}
   className="rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
  >
    Logout
  </button>
</div>

          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-12">

         <section className="mb-12 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 shadow-sm md:p-12">
            <p className="mb-3 text-sm font-medium text-blue-700 dark:text-blue-300">
              STUDENT DASHBOARD
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Welcome back, {user.name}! 👋
            </h2>

            <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-300">
              Your campus support is just a click away.
              Ask questions, get assistance and stay informed.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-blue-100 px-4 py-2 text-blue-800 dark:bg-slate-700 dark:text-slate-200">
                {user.course || "Student"}
              </span>
              <span className="rounded-full bg-blue-100 px-4 py-2 text-blue-800 dark:bg-slate-700 dark:text-slate-200">
                {user.email}
              </span>
            </div>
          </section>

 {/* Student Services */}
<section className="mb-12">
  <h2 className="text-2xl font-bold">Your Student Services</h2>
  <p className="mt-2 text-[var(--text-secondary)]">
    Choose a service to get started.
  </p>

  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {features.map((feature) => (
      <a
        key={feature.title}
        href={feature.target}
       className="group rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-500"
      >
        <div className="mb-5 text-4xl">{feature.icon}</div>

        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {feature.title}
        </h3>

        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
          {feature.description}
        </p>

        <div className="mt-5 border-t border-slate-800 pt-4">
          <span className="text-sm font-semibold text-blue-400 group-hover:text-blue-300">
            {feature.action} →
          </span>
        </div>
      </a>
    ))}
  </div>
</section>

{/* AI Assistant */}
<section
  id="ai-assistant"
  className="mb-12 scroll-mt-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6"
>
  <div className="mb-6">
    <h2 className="text-2xl font-bold">
      AI Student Assistant 🤖
    </h2>
    <p className="mt-2 text-slate-400">
      Have a question? Chat with CampusAssist.
    </p>
  </div>

  <Chatbot />
</section>

{/* Query Management */}
<section id="query-section" className="scroll-mt-8">
  <QuerySection />
</section>


        </main>

        <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          CampusAssist © 2026 | Student Help Desk
        </footer>
      </div>
    );
  }

  // LOGIN AND REGISTRATION
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 md:grid-cols-2">

        <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-700 to-indigo-950 p-12 md:flex">
          <h1 className="text-xl font-bold">🎓 CampusAssist</h1>

          <div>
            <p className="mb-4 text-sm tracking-widest text-blue-200">
              YOUR CAMPUS COMPANION
            </p>
            <h2 className="text-5xl font-bold leading-tight">
              Everything you need, all in one place.
            </h2>
            <p className="mt-6 leading-7 text-blue-100">
              Get answers to college questions and access student
              support with AI-powered assistance.
            </p>
          </div>

          <p className="text-sm text-blue-200">
            Smart support. Better student experience.
          </p>
        </div>

        <div className="p-8 sm:p-12">
          <p className="mb-3 text-sm font-semibold text-blue-400">
            STUDENT HELP DESK
          </p>

          <h2 className="text-3xl font-bold">
            {isLogin ? "Welcome back!" : "Create an account"}
          </h2>

          <p className="mb-8 mt-2 text-sm text-slate-400">
            {isLogin
              ? "Sign in to access your student portal."
              : "Register to get started."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {!isLogin && (
              <>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  minLength={2}
                  maxLength={60}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                />

                <input
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="Course (e.g. BCA)"
                  maxLength={60}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                />
              </>
            )}

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password (minimum 8 characters)"
              minLength={8}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
            />

            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="ml-2 font-semibold text-blue-400"
            >
              {isLogin ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
