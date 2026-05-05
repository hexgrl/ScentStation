import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./lib/passport.js";
import perfumeRoutes from "./routes/perfumes.js";
import authRoutes from "./routes/auth.js";
import collectionRoutes from "./routes/collection.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(passport.initialize());

app.use("/api/perfumes", perfumeRoutes);
app.use("/auth", authRoutes);
app.use("/api/collection", collectionRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));