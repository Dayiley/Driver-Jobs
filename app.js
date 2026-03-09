require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const { csrf } = require("host-csrf");


const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const auth = require("./middleware/auth");
const adminOnly = require("./middleware/adminOnly");
const jobsRouter = require("./routes/jobRoutes");

const flash = require("connect-flash");

const passport = require("passport");
const passportInit = require("./passport/passportInit");

const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const connectDB = require("./db/connect");

// EJS + form parsing
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//extra security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  })
);
app.use(xss());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200, // ajusta si quieres
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// cookies 
app.use(cookieParser(process.env.SESSION_SECRET));


// Mongo session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

store.on("error", (error) => {
  console.log("Session store error:", error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

// 1) Session
app.use(session(sessionParms));

// 2) Passport
passportInit();
app.use(passport.initialize());
app.use(passport.session());

// 3) Flash
app.use(flash());

const csrfProtection = require("./middleware/csrfProtection");

app.use((req, res, next) => {
  const isJobUploadPost =
    req.method === "POST" &&
    (req.path === "/jobs" || /^\/jobs\/[^/]+\/update$/.test(req.path));

  if (isJobUploadPost) {
    return next();
  }

  return csrfProtection(req, res, next);
});


// 4) storeLocals
app.use(require("./middleware/storeLocals"));
app.use(express.static("public"));


//user debugger
app.get("/debug-user", (req, res) => {
  res.json({
    hasUser: !!req.user,
    user: req.user || null,
    session: req.session,
  });
});


// 5) Routes
app.get("/", (req, res) => {
  if (!req.user) {
    return res.redirect("/sessions/logon");
  }

  return res.redirect("/jobs");
});

app.use("/sessions", require("./routes/sessionRoutes.js"));
app.use("/profiles", auth, require("./routes/profileRoutes"));
app.use("/jobs", auth, jobsRouter);
app.use("/news", auth, require("./routes/newsRoutes"));

// 404 + error
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
