(() => {
  // Only list repositories whose published main branch has been verified.
  const profile = "https://github.com/toto0401";
  const site = `${profile}/nina`;
  const projects = {
    learn: { name: "Learn · 学习助手", repositories: [["GitHub", "learn"], ["App + API", "learn-app"]] },
    lighthouse: { name: "潮汐灯塔", repositories: [["GitHub", "tidal-lighthouse"]] },
    rhythm: { name: "霓虹残响", repositories: [["GitHub", "neon-afterimage"]] },
    city: { name: "轨迹之城", repositories: [["GitHub", "neon-trace-city"]] },
    history: { name: "古人朋友圈", repositories: [["GitHub", "ancient-friends"]] },
    persona: { name: "评论区人格测试", repositories: [["GitHub", "comment-persona"]] },
    vocab: { name: "逐页", repositories: [["GitHub", "zhuye"]] },
  };
  const titles = {
    "Learn · 学习助手": "learn", "Learn · Learning Assistant": "learn",
    "潮汐灯塔": "lighthouse", "Tidal Lighthouse": "lighthouse",
    "霓虹残响": "rhythm", "Neon Afterimage": "rhythm",
    "轨迹之城": "city", "City of Traces": "city",
    "古人朋友圈": "history", "Ancient Friends": "history",
    "Ancient Friends Feed": "history",
    "评论区人格测试": "persona", "Comment Personality Test": "persona",
    "Comment Section Personality": "persona",
    "逐页": "vocab", "Page by Page": "vocab",
  };

  function link(label, href, description) {
    const anchor = document.createElement("a");
    anchor.className = "github-source-link";
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = `${label} ↗`;
    anchor.setAttribute("aria-label", description);
    return anchor;
  }

  function addLink(container, key, label, href, description) {
    if (!container || container.querySelector(`[data-github="${key}"]`)) return;
    const anchor = link(label, href, description);
    anchor.dataset.github = key;
    container.append(anchor);
  }

  function addProjectLinks(container, id) {
    const project = projects[id];
    if (!project || container.querySelector(".github-project-links")) return;
    const group = document.createElement("div");
    group.className = "github-project-links";
    for (const [label, repository] of project.repositories) {
      group.append(link(label, `${profile}/${repository}`, `${project.name} · ${label} source code`));
    }
    container.append(group);
  }

  function update() {
    addLink(document.querySelector(".header-actions"), "profile", "GitHub", profile, "Nina · GitHub");
    addLink(document.querySelector(".footer-identity"), "source", "GitHub", site, "Nina portfolio · GitHub source code");
    addLink(document.querySelector(".dossier-actions"), "profile", "GitHub", profile, "Nina · GitHub");
    document.querySelectorAll(".panel-bottom").forEach((footer) => {
      addLink(footer, "source", "GitHub", site, "Nina portfolio · GitHub source code");
    });
    document.querySelectorAll(".project-card").forEach((card) => {
      addProjectLinks(card, card.querySelector("[data-project]")?.dataset.project);
    });
    const detail = document.querySelector(".detail-copy");
    if (detail) {
      const heading = document.querySelector("#panel-title")?.textContent.trim();
      addProjectLinks(detail, titles[heading]);
    }
  }

  update();
  const panel = document.querySelector("#panel-body");
  if (panel) new MutationObserver(update).observe(panel, { childList: true });
})();
