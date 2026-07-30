"use client";

import React, { useState, useEffect } from "react";
import { Search, User } from "lucide-react";

export default function Sidebar({ categories = [], activeCategory = "All", initialQuery = "" }) {
  const [local, setLocal] = useState(initialQuery || "");

  useEffect(() => {
    setLocal(initialQuery || "");
  }, [initialQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.href = `/?q=${encodeURIComponent(local.trim())}`;
    }
  };

  return (
    <aside className="pf-sidebar">
      <div className="pf-widget">
        <h4>Search</h4>
        <form className="pf-search" onSubmit={handleSearchSubmit}>
          <input
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Search posters…"
          />
          <button type="submit"><Search size={16} /></button>
        </form>
      </div>

      <div className="pf-widget">
        <h4>Categories</h4>
        <ul className="pf-cat-list">
          <li>
            <a
              className={"pf-cat-btn" + (activeCategory === "All" ? " is-active" : "")}
              href="/"
            >
              All prompts
            </a>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <a
                className={"pf-cat-btn" + (activeCategory === c ? " is-active" : "")}
                href={`/?cat=${encodeURIComponent(c)}`}
              >
                {c}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="pf-widget pf-about">
        <div className="pf-avatar"><User size={22} /></div>
        <h4>About POSTR.</h4>
        <p>
          A small library of ready-to-copy prompts for posters and aesthetic images.
          Unlock a prompt, watch a short ad, copy it into your favourite generator.
        </p>
      </div>
    </aside>
  );
}
