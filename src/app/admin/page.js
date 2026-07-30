"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, X, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [blurb, setBlurb] = useState("");
  const [author, setAuthor] = useState("");
  
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  // Load posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const list = await res.json();
          setPosts(list);
        }
      } catch (e) {
        console.error("Failed to load inventory:", e);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !image.trim() || !prompt.trim() || !category.trim()) {
      setErr("Title, category, image URL and prompt are required.");
      return;
    }
    
    setErr("");
    setSaving(true);
    
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, image, prompt, blurb, author }),
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts((prev) => [newPost, ...prev]);
        showToast("Poster published successfully!");
        
        // Reset form
        setTitle("");
        setCategory("");
        setImage("");
        setPrompt("");
        setBlurb("");
        setAuthor("");
      } else {
        const data = await res.json();
        setErr(data.error || "Failed to publish poster.");
      }
    } catch (err) {
      console.error(err);
      setErr("Network error publishing poster.");
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        showToast("Poster deleted successfully.");
      } else {
        showToast("Failed to delete poster.");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error deleting poster.");
    }
  };

  const categories = Array.from(new Set(posts.map((p) => p.category)));

  if (loading) {
    return (
      <div className="pf-app">
        <Header activeView="admin" />
        <div className="pf-loading">
          <Loader2 className="pf-spin" size={22} /> Loading inventory log...
        </div>
      </div>
    );
  }

  return (
    <div className="pf-app">
      <Header activeView="admin" />

      <div className="pf-shell pf-shell-admin">
        <main className="pf-main">
          <a className="pf-back" href="/">
            <ArrowLeft size={15} /> Back to all prompts
          </a>
          <h1 className="pf-post-title">Add a new poster</h1>
          <p className="pf-post-meta-plain">This publishes straight to the live feed — no draft step.</p>
          <p className="pf-admin-warning">
            <X size={13} /> This page has no login yet — anyone with the link can publish or delete.
            Add authentication before launch.
          </p>

          <form className="pf-form" onSubmit={submit}>
            <div className="pf-form-row">
              <label>
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Neon Rain Noir"
                />
              </label>
              <label>
                Category
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Cinematic"
                />
              </label>
            </div>
            <label>
              Poster image URL
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://picsum.photos/seed/yourkey/900/650"
              />
            </label>
            <label>
              Short description (shown on the post)
              <textarea
                rows={2}
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                placeholder="One or two sentences about this poster."
              />
            </label>
            <label>
              Prompt text
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Full prompt used to generate this poster…"
              />
            </label>
            <label>
              Author (optional)
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Studio"
              />
            </label>
            {err && <p className="pf-form-err">{err}</p>}
            <button className="pf-btn pf-btn-primary" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="pf-spin" /> Publishing…
                </>
              ) : (
                <>
                  <Plus size={16} /> Publish post
                </>
              )}
            </button>
          </form>

          <h3 className="pf-inv-heading">All posts · {posts.length}</h3>
          <div className="pf-inventory">
            {posts.map((p) => (
              <div className="pf-inv-row" key={p.id}>
                <img src={p.image} alt={p.title} />
                <div className="pf-inv-meta">
                  <strong>{p.title}</strong>
                  <span>
                    {p.category} · {p.date}
                  </span>
                </div>
                <button
                  className="pf-inv-delete"
                  onClick={() => deletePost(p.id)}
                  title="Delete post"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {toast && <div className="pf-toast">{toast}</div>}
    </div>
  );
}
