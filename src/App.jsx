import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const PRIORITIES = ["Low", "Medium", "High"];
const FILTERS = ["all", "active", "completed"];

const defaultTodos = [
  { id: 1, text: "Plan the week ahead", completed: false, priority: "High" },
  { id: 2, text: "Finish the landing page mockup", completed: true, priority: "Medium" },
  { id: 3, text: "Book a design review", completed: false, priority: "Low" },
];

function App() {
  const [todos, setTodos] = useState(() => {
    if (typeof window === "undefined") return defaultTodos;

    try {
      const storedTodos = window.localStorage.getItem("todo-list-v1");
      return storedTodos ? JSON.parse(storedTodos) : defaultTodos;
    } catch {
      return defaultTodos;
    }
  });

  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("todo-list-v1", JSON.stringify(todos));
    }
  }, [todos]);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  const filteredTodos = useMemo(() => {
    if (filter === "active") return todos.filter((todo) => !todo.completed);
    if (filter === "completed") return todos.filter((todo) => todo.completed);
    return todos;
  }, [filter, todos]);

  const addTodo = (event) => {
    event.preventDefault();

    const text = inputValue.trim();
    if (!text) return;

    const nextTodo = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(),
      text,
      priority,
      completed: false,
    };

    setTodos((currentTodos) => [nextTodo, ...currentTodos]);
    setInputValue("");
    setPriority("Medium");
  };

  const toggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),_transparent_25%),#020817] text-slate-50">
      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-[0_25px_80px_rgba(15,23,42,0.9)] backdrop-blur-xl"
        >
          <header className="flex flex-col gap-4 border-b border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-violet-200">
                Focus flow
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                My Todo List
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-200">
                <span className="block text-2xl font-bold text-white">{activeCount}</span>
                Active
              </div>
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
                <span className="block text-2xl font-bold text-white">{completedCount}</span>
                Done
              </div>
            </div>
          </header>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-5">
              <form
                onSubmit={addTodo}
                className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 shadow-inner shadow-slate-950/40"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Add a new task..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-500 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
                  >
                    Add task
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {PRIORITIES.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        priority === level
                          ? "border-violet-400 bg-violet-500/15 text-violet-100"
                          : "border-white/10 bg-slate-900/80 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </form>

              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold text-white">Task board</h2>
                  <div className="inline-flex rounded-full border border-white/10 bg-slate-900/80 p-1">
                    {FILTERS.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setFilter(tab)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                          filter === tab
                            ? "bg-white text-slate-900"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredTodos.length ? (
                      filteredTodos.map((todo) => (
                        <motion.div
                          key={todo.id}
                          layout
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -12, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                          className={`flex items-center gap-3 rounded-2xl border p-3 ${
                            todo.completed
                              ? "border-emerald-500/30 bg-emerald-500/10"
                              : "border-white/10 bg-slate-900/70"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleTodo(todo.id)}
                            aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
                            className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                              todo.completed
                                ? "border-emerald-400 bg-emerald-400 text-slate-950"
                                : "border-slate-500 bg-transparent text-transparent hover:border-violet-400 hover:text-violet-300"
                            }`}
                          >
                            ✓
                          </button>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`truncate text-base font-medium ${
                                todo.completed ? "text-slate-400 line-through" : "text-white"
                              }`}
                            >
                              {todo.text}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                              <span
                                className={`rounded-full px-2 py-1 ${
                                  todo.priority === "High"
                                    ? "bg-rose-500/15 text-rose-200"
                                    : todo.priority === "Medium"
                                      ? "bg-amber-500/15 text-amber-200"
                                      : "bg-emerald-500/15 text-emerald-200"
                                }`}
                              >
                                {todo.priority}
                              </span>
                              {todo.completed && (
                                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">
                                  done
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteTodo(todo.id)}
                            className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:border-rose-400/60 hover:text-rose-200"
                          >
                            Delete
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-6 text-center text-slate-400"
                      >
                        No tasks in this view yet.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 via-slate-900/80 to-sky-500/10 p-4">
                <p className="text-sm text-slate-300">Today’s momentum</p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-4xl font-bold text-white">{progress}%</span>
                  <span className="mb-1 text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                    complete
                  </span>
                </div>
                <div className="mt-4 h-2.5 rounded-full bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-400"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <h3 className="text-lg font-semibold text-white">Quick stats</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2">
                    <span>Total tasks</span>
                    <span className="font-semibold text-white">{todos.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2">
                    <span>Completed</span>
                    <span className="font-semibold text-emerald-300">{completedCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2">
                    <span>Remaining</span>
                    <span className="font-semibold text-violet-200">{activeCount}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={clearCompleted}
                className="w-full rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 font-medium text-rose-100 transition hover:border-rose-300/60 hover:bg-rose-500/15"
              >
                Clear completed
              </button>
            </aside>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
