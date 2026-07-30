"use client";

import React, { useState, useEffect } from "react";
import { Info, User, HelpCircle, Server, Check } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AboutPage() {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const list = await res.json();
          setAllPosts(list);
        }
      } catch (error) {
        console.error("Failed to load posts for sidebar:", error);
      }
    };
    fetchPosts();
  }, []);

  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  return (
    <div className="pf-app">
      <Header activeView="about" />

      <div className="pf-shell">
        <main className="pf-main">
          <article className="pf-post">
            <h1 className="pf-post-title">About POSTR.</h1>
            <p className="pf-post-meta-plain">Learn about our mission, technology stack, and prompt curation.</p>

            <div className="pf-post-img" style={{ background: "linear-gradient(135deg, var(--tag-bg) 0%, var(--bg) 100%)", padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "64px", fontWeight: "700", fontFamily: "var(--display)", color: "var(--primary-dark)" }}>
                POSTR.
              </div>
              <p style={{ margin: "10px 0 0", color: "var(--text)", fontSize: "14.5px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
                AI Poster Prompt Library
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "24px" }}>
              <section>
                <h3 style={{ fontFamily: "var(--display)", fontSize: "22px", color: "var(--ink)", margin: "0 0 10px" }}>
                  What is POSTR?
                </h3>
                <p className="pf-post-blurb">
                  POSTR is a curated library of ready-to-copy prompts tailored specifically for high-impact posters, prints, and editorial graphics. We do the heavy lifting of dialing in lighting, negative space, camera angles, color grading, and styles, saving you hours of trial and error in AI image generators.
                </p>
              </section>

              <section>
                <h3 style={{ fontFamily: "var(--display)", fontSize: "22px", color: "var(--ink)", margin: "0 0 10px" }}>
                  How It Works
                </h3>
                <p className="pf-post-blurb">
                  Browse the home feed, find a style that aligns with your creative brief, and click it. To unlock the full details of the prompt:
                </p>
                <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "15px", lineHeight: "1.6", color: "var(--text)" }}>
                  <li><strong>Sponsor Ad Integration</strong>: Watch a brief Google Ad Manager rewarded ad slot to claim your prompt.</li>
                  <li><strong>Unfilled Fallback</strong>: If ad inventories are low or blocked, the library automatically reveals the prompt on the same page, ensuring an uninterrupted workflow.</li>
                  <li><strong>Personal Claims</strong>: Once claimed, your unlocked prompts are saved locally to your browser's persistent storage, so you don't have to watch the sponsor ad again.</li>
                </ul>
              </section>

              <section>
                <h3 style={{ fontFamily: "var(--display)", fontSize: "22px", color: "var(--ink)", margin: "0 0 10px" }}>
                  Our Tech Stack
                </h3>
                <p className="pf-post-blurb">
                  Built as a fast, dynamic Next.js Web App:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "10px" }}>
                  <div style={{ background: "var(--card)", border: "1px solid var(--line)", padding: "16px", borderRadius: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--ink)", marginBottom: "6px" }}>
                      <Server size={18} style={{ color: "var(--primary)" }} /> MongoDB Backend
                    </div>
                    <p style={{ margin: "0", fontSize: "13px", color: "var(--muted)", lineHeight: "1.5" }}>
                      All posters are fetched dynamically from a live database, making prompt updates instantaneous.
                    </p>
                  </div>
                  <div style={{ background: "var(--card)", border: "1px solid var(--line)", padding: "16px", borderRadius: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--ink)", marginBottom: "6px" }}>
                      <HelpCircle size={18} style={{ color: "var(--accent)" }} /> Premium Vanilla CSS
                    </div>
                    <p style={{ margin: "0", fontSize: "13px", color: "var(--muted)", lineHeight: "1.5" }}>
                      Designed from the ground up without heavy templates, featuring responsive grids and custom typography variables.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </main>

        <Sidebar categories={categories} />
      </div>
    </div>
  );
}
