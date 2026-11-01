
import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AdminDashboard({ user, onLogout }) {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("studentHelpDeskToken");

  const fetchQueries = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/admin/queries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch queries.");
      }

      setQueries(data.queries || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/admin/queries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed.");
      }

      setQueries((prev) =>
        prev.map((query) =>
          query._id === id ? data.query : query
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const pending = queries.filter(
    (q) => q.status === "Pending"
  ).length;

  const inProgress = queries.filter(
    (q) => q.status === "In Progress"
  ).length;

  const resolved = queries.filter(
    (q) => q.status === "Resolved"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold">CampusAssist Admin</h1>
            <p className="text-xs text-slate-400">
              Administration Dashboard
            </p>
          </div>

          <button
            onClick={onLogout}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <h2 className="text-3xl font-bold">
          Welcome, {user.name}
        </h2>

        <p className="mt-2 text-slate-400">
          Manage and respond to student queries.
        </p>

        {/* Statistics */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {[
            { title: "Total Queries", value: queries.length },
            { title: "Pending", value: pending },
            { title: "In Progress", value: inProgress },
            { title: "Resolved", value: resolved },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-sm text-slate-400">{item.title}</p>
              <h3 className="mt-3 text-3xl font-bold">
                {item.value}
              </h3>
            </div>
          ))}

        </div>

        {/* Queries */}
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold">Student Queries</h3>

            <button
              onClick={fetchQueries}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading queries...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : queries.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              No student queries found.
            </div>
          ) : (
            <div className="space-y-4">
              {queries.map((query) => (
                <div
                  key={query._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex flex-wrap justify-between gap-4">

                    <div>
                      <h4 className="text-lg font-semibold">
                        {query.subject}
                      </h4>

                      <p className="mt-2 text-sm text-slate-400">
                        {query.student?.name || "Unknown Student"} ·{" "}
                        {query.student?.email || "No email"}
                      </p>
                    </div>

                    <span className="text-sm text-blue-400">
                      {query.category}
                    </span>
                  </div>

                  <p className="my-5 text-sm leading-6 text-slate-300">
                    {query.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">

                    <span className="text-xs text-slate-500">
                      {new Date(query.createdAt).toLocaleString()}
                    </span>

                    <select
                      value={query.status}
                      onChange={(e) =>
                        updateStatus(query._id, e.target.value)
                      }
                      className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;
