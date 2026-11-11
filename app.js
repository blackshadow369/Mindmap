// Reads TOPICS (data/index.js), draws bubbles, handles clicks and progress.
(function () {
  const STORAGE_KEY = "learning-map-progress";

  const bubblesEl = document.getElementById("bubbles");
  const listEl = document.getElementById("topic-list");
  const detailEl = document.getElementById("detail");
  const fillEl = document.getElementById("progress-fill");
  const textEl = document.getElementById("progress-text");
  const resetBtn = document.getElementById("reset-btn");

  let selectedId = null;

  // ---- progress (saved in this browser only) ----
  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      /* storage blocked: progress just won't persist */
    }
  }

  let progress = loadProgress();

  function isDone(id) {
    return !!progress[id];
  }

  function toggleDone(id) {
    progress[id] = !progress[id];
    saveProgress(progress);
    render();
  }

  // ---- rendering ----
  function render() {
    renderBubbles();
    renderList();
    renderProgress();
    renderDetail();
  }

  function renderBubbles() {
    bubblesEl.innerHTML = "";
    TOPICS.forEach((topic) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bubble";
      if (isDone(topic.id)) btn.classList.add("done");
      if (topic.id === selectedId) btn.classList.add("selected");
      btn.textContent = topic.title;
      btn.addEventListener("click", () => select(topic.id));
      bubblesEl.appendChild(btn);
    });
  }

  function renderList() {
    listEl.innerHTML = "";
    TOPICS.forEach((topic) => {
      const li = document.createElement("li");
      if (topic.id === selectedId) li.classList.add("active");
      const check = document.createElement("span");
      check.className = "check";
      check.textContent = isDone(topic.id) ? "✓" : "";
      li.append(check, topic.title);
      li.addEventListener("click", () => select(topic.id));
      listEl.appendChild(li);
    });
  }

  function renderProgress() {
    const done = TOPICS.filter((t) => isDone(t.id)).length;
    const total = TOPICS.length;
    const pct = total ? (done / total) * 100 : 0;
    fillEl.style.width = pct + "%";
    textEl.textContent = `${done} / ${total} done`;
  }

  function renderDetail() {
    const topic = TOPICS.find((t) => t.id === selectedId);
    if (!topic) {
      detailEl.innerHTML = '<p class="detail-empty">Click a bubble to see what to learn.</p>';
      return;
    }

    detailEl.innerHTML = "";

    const h2 = document.createElement("h2");
    h2.textContent = topic.title;

    const summary = document.createElement("p");
    summary.className = "summary";
    summary.textContent = topic.summary;

    const ul = document.createElement("ul");
    topic.points.forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      ul.appendChild(li);
    });

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "done-toggle";
    if (isDone(topic.id)) toggle.classList.add("is-done");
    toggle.textContent = isDone(topic.id) ? "✓ Completed (click to undo)" : "Mark as done";
    toggle.addEventListener("click", () => toggleDone(topic.id));

    detailEl.append(h2, summary, ul);

    if (topic.links && topic.links.length) {
      const linksUl = document.createElement("ul");
      topic.links.forEach((link) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = link.label;
        li.appendChild(a);
        linksUl.appendChild(li);
      });
      detailEl.appendChild(linksUl);
    }

    detailEl.appendChild(toggle);
  }

  function select(id) {
    selectedId = id;
    render();
  }

  resetBtn.addEventListener("click", () => {
    if (confirm("Reset all progress?")) {
      progress = {};
      saveProgress(progress);
      render();
    }
  });

  render();
})();
