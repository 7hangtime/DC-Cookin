import express from 'express'
import pantryRouter from "./routes/pantry.js";
import recipesRouter from './routes/recipes.js';
import cors from "cors";
import fs from "node:fs";

const recipes = JSON.parse(
    fs.readFileSync(new URL("./data/recipes.json", import.meta.url), "utf-8")
);

const app = express()
const PORT = process.env.PORT || 3001
const environment = process.env.NODE_ENV

app.use(cors());
app.use(express.json())

app.use("/api/pantry", pantryRouter);
app.use("/api/recipes", recipesRouter(recipes));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
