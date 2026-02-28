const express = require("express");
const path    = require("path");
const { projects, order } = require("./data/projects");

const app  = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ───────────── Static ───────────── */
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/fonts",  express.static(path.join(__dirname, "fonts")));
app.use("/images", express.static(path.join(__dirname, "assets", "images")));

/* ───────────── Pages ───────────── */
app.get("/",        (_req, res) => res.render("index",     { page: "home" }));
app.get("/home",    (_req, res) => res.redirect("/"));
app.get("/about",   (_req, res) => res.render("about",     { page: "about" }));
app.get("/contact", (_req, res) => res.render("contactus", { page: "contact" }));

/* ✅ FIXED — gallery now receives projects */
app.get("/gallery", (_req, res) =>
  res.render("gallery", {
    page: "gallery",
    projects,
    order
  })
);

/* ───────────── Helpers ───────────── */
function getPrevNext(slug) {
  const idx = order.indexOf(slug);
  if (idx === -1) return { prev: null, next: null };

  const prevSlug = order[(idx - 1 + order.length) % order.length];
  const nextSlug = order[(idx + 1) % order.length];

  return {
    prev: { slug: prevSlug, title: projects[prevSlug]?.title || prevSlug },
    next: { slug: nextSlug, title: projects[nextSlug]?.title || nextSlug }
  };
}

/* ───────────── Portfolio ───────────── */
app.get("/portfolio/:slug", (req, res) => {
  const slug = req.params.slug;
  const project = projects[slug];

  if (!project) {
    return res.status(404).send(
      "<h1 style='font-family:serif;text-align:center;padding:80px'>404 — Project not found. <a href='/gallery'>← Gallery</a></h1>"
    );
  }

  const nav = getPrevNext(slug);

  if (project.template) {
    return res.render(project.template, { project, nav, page: "gallery" });
  }

  res.render("portfolio/project", { project, nav, page: "gallery" });
});

/* ───────────── 404 ───────────── */
app.use((_req, res) =>
  res.status(404).send(
    "<h1 style='font-family:serif;text-align:center;padding:80px'>404 — Not found. <a href='/'>← Home</a></h1>"
  )
);

app.listen(PORT, () => console.log(`✓  http://localhost:${PORT}`));