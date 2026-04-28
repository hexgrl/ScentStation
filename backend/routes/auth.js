import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=true`,
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL)
  },
);

router.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

export default router;
