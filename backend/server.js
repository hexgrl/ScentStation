import express from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";
import passport from "./lib/passport.js";
import perfumeRoutes from "./routes/perfumes.js";
import authRoutes from "./routes/auth.js";
import collectionRoutes from "./routes/collection.js";

dotenv.config();

const app = express()
app.set('trust proxy', 1)
const PORT = process.env.PORT || 3001;
const PgStore = connectPgSimple(session);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    store: new PgStore({
      conString: process.env.DATABASE_URL,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/perfumes", perfumeRoutes);
app.use("/auth", authRoutes);
app.use("/api/collection", collectionRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
