import express from "express";
import cors from "cors";
import axios from "axios"; // <-- added for keep-alive
import { connectDB } from "./../database/index.js";
import { config } from "./../config/index.js";
import routes from "./routes.js";

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Root health check (optional but useful)
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

async function start() {
  try {
    await connectDB();
    const port = config?.app?.port ?? 3000;
    app.listen(port, () => {
      console.log(`Service on port ${port}`);
    });

    // -------------------------------
    // KEEP RENDER INSTANCE ALIVE
    // -------------------------------
    const KEEP_ALIVE_URL = "https://cellclinichyderabadbacken.onrender.com/";

    setInterval(async () => {
      try {
        await axios.get(KEEP_ALIVE_URL);
        console.log("Render keep-alive ping successful");
      } catch (err) {
        console.log("Keep-alive ping failed:", err.message);
      }
    }, 2 * 60 * 1000); // 2 minutes
    // -------------------------------
  } catch (err) {
    console.log(`failed to start:`, err);
    process.exit(1);
  }
}

start();
export default app;
