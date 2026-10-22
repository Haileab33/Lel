import { useState, useEffect } from "react";
import { content } from "@/lib/content";
import { supabase } from "@/lib/supabase";
import { Check, Plus, Sparkles, Compass, Heart, Trash2 } from "lucide-react";

interface BucketItem {
  id: string;
  category: "travel" | "dates" | "silly" | "milestones" | string;
  title: string;
  desc: string;
  isCustom?: boolean;
}

export function BucketList() {
  const defaultItems: BucketItem[] = content.bucketList.items;
  const categories = content.bucketList.categories;

  const [activeTab, setActiveTab] = useState("all");
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [customItems, setCustomItems] = useState<BucketItem[]>([]);

  // New item form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState(categories.find((c) => c.id !== "all")?.id || "challenges");

  // Cloud sync helper
  const syncToCloud = async (completed: string[], custom: BucketItem[]) => {
    try {
      await supabase.from("bucket_list_state").upsert({
        id: "shared",
        completed_ids: completed,
        custom_items: custom,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Supabase bucket list sync error:", err);
    }
  };

  // Load persistence & real-time sync across all devices
  useEffect(() => {
    // 1. Initial optimistic load from localStorage
    try {
      const savedCompleted = localStorage.getItem("future-bucket-list-completed-v1");
      if (savedCompleted) {
        setCompletedIds(JSON.parse(savedCompleted));
      }
      const savedCustom = localStorage.getItem("future-bucket-list-custom-v1");
      if (savedCustom) {
        setCustomItems(JSON.parse(savedCustom));
      }
    } catch {
      // Fallback
    }

    // 2. Fetch shared state from Supabase
    const fetchCloud = async () => {
      try {
        const { data, error } = await supabase
          .from("bucket_list_state")
          .select("completed_ids, custom_items")
          .eq("id", "shared")
          .maybeSingle();

        if (data && !error) {
          const cloudCompleted = Array.isArray(data.completed_ids) ? data.completed_ids : [];
          const cloudCustom = Array.isArray(data.custom_items) ? (data.custom_items as BucketItem[]) : [];

          if (cloudCompleted.length > 0 || cloudCustom.length > 0) {
            setCompletedIds(cloudCompleted);
            setCustomItems(cloudCustom);
            localStorage.setItem("future-bucket-list-completed-v1", JSON.stringify(cloudCompleted));
            localStorage.setItem("future-bucket-list-custom-v1", JSON.stringify(cloudCustom));
          } else {
            // If cloud is empty but this device has local progress, push local to cloud
            const localCompleted = JSON.parse(localStorage.getItem("future-bucket-list-completed-v1") || "[]");
            const localCustom = JSON.parse(localStorage.getItem("future-bucket-list-custom-v1") || "[]");
            if (localCompleted.length > 0 || localCustom.length > 0) {
              await syncToCloud(localCompleted, localCustom);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch cloud bucket list:", err);
      }
    };
    fetchCloud();

    // 3. Listen to Realtime updates across devices
    const channel = supabase
      .channel("bucket_list_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bucket_list_state", filter: "id=eq.shared" },
        (payload) => {
          const row = payload.new as { completed_ids?: string[]; custom_items?: BucketItem[] };
          if (row) {
            if (Array.isArray(row.completed_ids)) {
              setCompletedIds(row.completed_ids);
              localStorage.setItem("future-bucket-list-completed-v1", JSON.stringify(row.completed_ids));
            }
            if (Array.isArray(row.custom_items)) {
              setCustomItems(row.custom_items);
              localStorage.setItem("future-bucket-list-custom-v1", JSON.stringify(row.custom_items));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleItem = (id: string) => {
    let nextCompleted: string[];
    if (completedIds.includes(id)) {
      nextCompleted = completedIds.filter((itemId) => itemId !== id);
    } else {
      nextCompleted = [...completedIds, id];
    }
    setCompletedIds(nextCompleted);
    localStorage.setItem("future-bucket-list-completed-v1", JSON.stringify(nextCompleted));
    syncToCloud(nextCompleted, customItems);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BucketItem = {
      id: `custom-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      desc: newDesc.trim() || "An adventure dreamed up together.",
      isCustom: true,
    };

    const nextCustom = [newItem, ...customItems];
    setCustomItems(nextCustom);
    localStorage.setItem("future-bucket-list-custom-v1", JSON.stringify(nextCustom));
    syncToCloud(completedIds, nextCustom);

    setNewTitle("");
    setNewDesc("");
    setShowAddForm(false);
  };

  const removeCustomItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextCustom = customItems.filter((item) => item.id !== id);
    const nextCompleted = completedIds.filter((itemId) => itemId !== id);
    setCustomItems(nextCustom);
    setCompletedIds(nextCompleted);
    localStorage.setItem("future-bucket-list-custom-v1", JSON.stringify(nextCustom));
    localStorage.setItem("future-bucket-list-completed-v1", JSON.stringify(nextCompleted));
    syncToCloud(nextCompleted, nextCustom);
  };

  const allItems: BucketItem[] = [...customItems, ...defaultItems];

  const filteredItems =
    activeTab === "all" ? allItems : allItems.filter((item) => item.category === activeTab);

  const completedCount = allItems.filter((item) => completedIds.includes(item.id)).length;
  const progressPercent = allItems.length > 0 ? Math.round((completedCount / allItems.length) * 100) : 0;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "travel":
        return "✈️";
      case "dates":
        return "🍜";
      case "silly":
        return "🧸";
      case "milestones":
        return "💍";
      default:
        return "✨";
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Progress Bar & Header Stats */}
      <div className="glass mx-auto max-w-2xl rounded-3xl p-5 shadow-soft border-primary/20 sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary sm:text-xs">
              Adventure Progress
            </span>
            <h4 className="font-display text-xl font-bold text-foreground sm:text-2xl">
              {completedCount} of {allItems.length} Completed ({progressPercent}%)
            </h4>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 self-start rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white active:scale-95 sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Our Dream</span>
          </button>
        </div>

        {/* Progress Fill Bar */}
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-border/60">
          <div
            className="h-full bg-gradient-to-r from-primary via-rose-400 to-amber-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground sm:text-xs">
          {progressPercent === 0
            ? "Every big adventure begins with a single step together ✨"
            : progressPercent === 100
            ? "We did it all! Time to write our next chapter ♾️❤️"
            : "Checking them off one by one, hand in hand 💖"}
        </p>
      </div>

      {/* Add Dream Adventure Form Modal / Expandable */}
      {showAddForm && (
        <form
          onSubmit={handleAddItem}
          className="glass mx-auto max-w-xl rounded-3xl p-6 shadow-soft border-2 border-primary/30 space-y-4 animate-fade-rise sm:p-7"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h4 className="font-display text-lg font-bold sm:text-xl">Add A Future Adventure 🗺️</h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">What do you want us to do?</label>
            <input
              type="text"
              required
              placeholder="e.g. Midnight stargazing on the roof..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-border bg-background/80 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-background/80 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              >
                {categories
                  .filter((c) => c.id !== "all")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Little details (optional)</label>
              <input
                type="text"
                placeholder="Where, when, or why it's special"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-background/80 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-soft transition active:scale-98 hover:opacity-95"
          >
            Pin To Our Bucket List ✨
          </button>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {categories.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition active:scale-95 sm:text-sm ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "glass text-foreground/80 hover:text-primary hover:border-primary/40"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Adventures Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {filteredItems.map((item) => {
          const isDone = completedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`group relative cursor-pointer rounded-3xl p-5 transition-all duration-300 border select-none sm:p-6 ${
                isDone
                  ? "glass-muted border-emerald-300/80 bg-emerald-50/40 shadow-xs opacity-90"
                  : "glass border-border/80 shadow-soft hover:-translate-y-1 hover:border-primary/40"
              }`}
            >
              {/* Card Header: Icon & Category & Checkbox */}
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-background/80 border border-border/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground shadow-xs">
                  <span>{getCategoryIcon(item.category)}</span>
                  <span className="capitalize">{item.category}</span>
                </span>

                <div className="flex items-center gap-2">
                  {item.isCustom && (
                    <button
                      onClick={(e) => removeCustomItem(item.id, e)}
                      title="Remove custom goal"
                      className="p-1 text-muted-foreground/40 hover:text-destructive transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {/* Interactive Checkbox */}
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      isDone
                        ? "bg-emerald-500 border-emerald-500 text-white scale-105 shadow-xs"
                        : "border-border group-hover:border-primary bg-background/60"
                    }`}
                  >
                    {isDone && <Check className="h-4 w-4 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-3.5">
                <h4
                  className={`font-display text-lg font-bold transition-all sm:text-xl ${
                    isDone ? "line-through text-muted-foreground decoration-primary/60" : "text-foreground"
                  }`}
                >
                  {item.title}
                </h4>
                <p
                  className={`mt-1.5 text-xs leading-relaxed transition-all sm:text-sm ${
                    isDone ? "text-muted-foreground/80 line-through" : "text-muted-foreground"
                  }`}
                >
                  {item.desc}
                </p>
              </div>

              {/* Bottom completed pill */}
              <div className="mt-4 flex items-center justify-between text-[10px] sm:text-xs">
                {isDone ? (
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span>✨ Adventure Accomplished!</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground/70 group-hover:text-primary transition flex items-center gap-1">
                    <span>Tap to mark done</span>
                  </span>
                )}
                <span className="font-script text-base text-primary/70">Next Chapter</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
