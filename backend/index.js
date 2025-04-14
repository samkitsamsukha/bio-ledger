import express from 'express';
import cors from 'cors';
import labRoutes from "./routes/labRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import connectDB from './utils/db.js';

const app = express();
app.use(express.json());

app.use(
	cors({
		origin: "*",
	})
);

// connectDB();

app.use("/api/lab", labRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})