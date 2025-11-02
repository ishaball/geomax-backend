import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Review from "./models/Review.js";
import User from "./models/User.js";
import Query from "./models/Contact.js";



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Server is running!");
});


// 🧍 Save Clerk user
app.post("/api/users", async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = new User({ clerkId, email, name });
      await user.save();
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📊 Get total user count
app.get("/api/users/count", async (req, res) => {
  const count = await User.countDocuments();
  res.json({ totalUsers: count });
});

// 💬 Add review
app.post("/api/reviews", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📄 Get all reviews
app.get("/api/reviews", async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});
// 📩 Save contact query
// 📩 Save contact message
app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Query(req.body);
    await contact.save();
    res.status(201).json({ message: "Contact message saved successfully!" });
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(400).json({ message: err.message });
  }
});

// 📬 Get all queries (optional - for admin view)
app.get("/api/query", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));