import express from "express";
import checkConnection from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import noteRouter from "./modules/notes/note.controller.js";

const app = express();
const port = 3000;

const bootstrap = () => {
    app.use(express.json());
    app.get("/", (req, res) => {
        res.status(200).json({ message: `welcome to my app.....` });
    });

    checkConnection();

    app.use('/users', userRouter)
    app.use('/notes', noteRouter)

    app.use((req, res) => {
        res.status(404).json({ message: `invalid url ${req.originalUrl}` });
    });

    app.use((err, req, res, next) => {
        console.log(err.stack)
        res.status(err.cause || 500).json({ message: err.message, stack: err.stack })
    })

    app.listen(port, () => {
        console.log(`connect on port ${port}`);
    });
};

export default bootstrap;
