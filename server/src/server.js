import express from 'express'
import pantryRouter from "./routes/pantry.js";
import cors from "cors";

const app = express()
const PORT = process.env.PORT || 3000
const environment = process.env.NODE_ENV

app.use(cors());
app.use("/api/pantry", pantryRouter);
app.use(express.json())

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
