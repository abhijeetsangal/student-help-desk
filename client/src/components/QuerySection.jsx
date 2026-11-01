
import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function QuerySection() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    subject: "",
    description: "",
    category: "Academic",
  });

  const loadQueries = async () => {
    try {
      const token = localStorage.getItem("studentHelpDeskToken");

      const response = await fetch(`${API_URL}/queries/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load queries.");
      }

      setQueries(data.queries || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("studentHelpDeskToken");

      const response = await fetch(`${API_URL}/queries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Query submission failed.");
      }

      setSuccess("Your query has been submitted successfully!");

      setForm({
        subject: "",
        description: "",
        category: "Academic",
      });

      await loadQueries();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = {
    Pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400",
    "In Progress":
      "bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400",
    Resolved:
      "bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-400",
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:border-blue-500";

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-2">

      {/* Submit Query */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Submit a Query 📝
        </h2>

        <p className="mb-6 mt-2 text-sm text-[var(--text-secondary)]">
          Send your question or issue to college administration.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              maxLength={150}
              required
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              placeholder="Enter query subject"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className={inputClass}
            >
              {[
                "Academic",
                "Examination",
                "Fees",
                "Admission",
                "Hostel",
                "Technical",
                "Other",
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
              Description
            </label>
            <textarea
              value={form.description}
              maxLength={2000}
              required
              rows={5}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe your issue..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-400/10 dark:text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-green-100 p-3 text-sm text-green-700 dark:bg-green-400/10 dark:text-green-400">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Query"}
          </button>
        </form>
      </section>

      {/* My Queries */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          My Queries 📋
        </h2>

        <p className="mb-6 mt-2 text-sm text-[var(--text-secondary)]">
          Track your submitted queries.
        </p>

        {loading ? (
          <p className="text-[var(--text-secondary)]">
            Loading queries...
          </p>
        ) : queries.length === 0 ? (
          <p className="rounded-xl bg-[var(--bg-primary)] p-6 text-center text-[var(--text-secondary)]">
            You haven't submitted any queries yet.
          </p>
        ) : (
          <div className="max-h-[500px] space-y-4 overflow-y-auto">
            {queries.map((query) => (
              <div
                key={query._id}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {query.subject}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusColor[query.status] ||
                      "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {query.status}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {query.description}
                </p>

                <div className="mt-4 flex justify-between text-xs text-[var(--text-secondary)]">
                  <span>{query.category}</span>
                  <span>
                    {new Date(query.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default QuerySection;

