const NEWS_URL = "https://truckdrivernews.com/wp-json/wp/v2/posts?per_page=12&_embed";

let newsCache = {
  posts: [],
  lastUpdated: null,
};

const ONE_HOUR = 60 * 60 * 1000;

const fetchNews = async () => {
  const response = await fetch(NEWS_URL);
  const posts = await response.json();

  newsCache.posts = posts;
  newsCache.lastUpdated = new Date();

  return posts;
};

const listNews = async (req, res, next) => {
  try {
    const now = Date.now();

    if (
      !newsCache.lastUpdated ||
      now - new Date(newsCache.lastUpdated).getTime() > ONE_HOUR
    ) {
      await fetchNews();
    }

    res.render("news/list", {
      posts: newsCache.posts,
      lastUpdated: newsCache.lastUpdated,
    });
  } catch (e) {
    next(e);
  }
};

const refreshNews = async (req, res, next) => {
  try {
    await fetchNews();
    req.flash("info", "News updated.");
    res.redirect("/news");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listNews,
  refreshNews,
};