import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=true`,
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

router.get("/me", (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ user: null });
  try {
    const user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    res.json({ user });
  } catch {
    res.status(401).json({ user: null });
  }
});

router.post("/logout", (req, res) => {
  res.json({ success: true });
});

export default router;