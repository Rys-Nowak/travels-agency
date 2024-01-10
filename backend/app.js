import express, { urlencoded } from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import tripsRouter from "./routes/trips.js";
import reviewsRouter from "./routes/reviews.js";
// import { decodeIdToken } from "./middlewares/tokenAuth.js";

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
// app.use(decodeIdToken);

app.use("/api/users", usersRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/reviews", reviewsRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
