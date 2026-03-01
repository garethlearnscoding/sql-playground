import "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-sql.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js";

import "./example.js";
import { initDB } from "./db.js";
import { renderTable, attachRunQuery, attachResetDB } from "./ui.js";
import { examples } from "../data/data.js";

window.examples = examples;

// Setup functions
async function setupDocsDB() {
  await initDB();
  const tableEl = document.getElementById("tableDocs")
  if (tableEl) renderTable(tableEl);
}

async function setupSandboxDB() {
  await initDB();
  const tableEl = document.getElementById("tableSandbox");
  if (tableEl) renderTable(tableEl);
}

// Expose to Alpine / global
window.setupDocsDB = setupDocsDB;
window.setupSandboxDB = setupSandboxDB;

window.addEventListener("DOMContentLoaded", async () => {
  // Initial page setup (Docs page by default)
  const page = document.body.getAttribute("x-data")?.includes("docs") ? "docs" : "sandbox";
  

  if (page === "docs") {
    await setupDocsDB();
  } else {
    await setupSandboxDB();
  }

  // Docs page buttons
  const runDocsBtn = document.getElementById("runDocsBtn");
  const resetDocsBtn = document.getElementById("resetDocsBtn");

  if (runDocsBtn) {
    attachRunQuery(
      runDocsBtn,
      document.getElementById("outputDocs"),
      document.getElementById("tableDocs"),
      examples // URL topic will be used automatically
    );
  }

  // Get the topic from URL ?topic=<name>
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic"); // will be null if not present
  
  // Attach reset button with the topic
  if (resetDocsBtn) {
    attachResetDB(resetDocsBtn, document.getElementById("outputDocs"), topic);
  }

  // Sandbox page buttons
  const runSandboxBtn = document.getElementById("runSandboxBtn");
  const resetSandboxBtn = document.getElementById("resetSandboxBtn");
  const queryEl = document.getElementById("query");

  if (runSandboxBtn) {
    attachRunQuery(
      runSandboxBtn,
      document.getElementById("outputSandbox"),
      document.getElementById("tableSandbox"),
      examples,
      queryEl // pass explicit query element for sandbox
    );
  }

  if (resetSandboxBtn) {
    attachResetDB(resetSandboxBtn,document.getElementById("outputSandbox")); // will clean sandbox DB
  }
});
