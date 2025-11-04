import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";


// app.use("/", (req, res) => {
//   res.send("Welcome, To the journey to be a great mern engineer");
// });

connectDB()

app.listen(process.env.PORT, () => {
  console.log(`Server running on port:${process.env.PORT}`);
});
