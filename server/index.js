const express = require("express");
const cors = require("cors");
const path = require("path");
const os = require("os");
const { connectDB } = require("./db");
const { PORT } = require("./config");

const app = express();

app.use(cors());          // allow the React app (port 5173) to call this server (port 8000)
app.use(express.json());  // read JSON data sent from the frontend

// Movies and posters saved on this computer
app.use("/videos", express.static(path.join(__dirname, "videos")));
app.use("/posters", express.static(path.join(__dirname, "posters")));

app.get("/", (req, res) => res.send("OTT Platform API is running"));

// Routes ( each file handles one part of the app )
app.use("/api/auth", require("./routes/auth"));           // register, login
app.use("/api/content", require("./routes/content"));     // movies & series for users
app.use("/api/watchlist", require("./routes/watchlist")); // watch later list
app.use("/api/support", require("./routes/support"));     // contact us, report a problem
app.use("/api/admin", require("./routes/admin"));         // admin only

// First connect to MongoDB, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running On Port Number ${PORT}`);

      // Show the address other computers on the same Wi-Fi can use
      for (const list of Object.values(os.networkInterfaces())) {
        for (const net of list || []) {
          if (net.family === "IPv4" && !net.internal) {
            console.log(`Other computers on the same Wi-Fi can open: http://${net.address}:5173`);
          }
        }
      }
    });
  })
  .catch((error) => {
    console.log("Connection failed. Is MongoDB running?", error.message);
    process.exit(1);
  });
