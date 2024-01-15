import express, { urlencoded } from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import tripsRouter from "./routes/trips.js";
import reviewsRouter from "./routes/reviews.js";
import cartRouter from "./routes/cart.js";
import usersRouter from "./routes/users.js";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "PUT", "POST", "DELETE"],
    })
);
app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use("/api/trips", tripsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
