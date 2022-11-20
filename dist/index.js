"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./routers/user");
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const achievement_1 = require("./routers/achievement");
const token_1 = require("./middleware/token");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
mongoose_1.default.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.1zzl3oc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then((db) => __awaiter(void 0, void 0, void 0, function* () { console.log('[database]: Connected to database!'); })).catch(e => console.log(e));
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port))
        return val;
    if (port >= 0)
        return port;
    return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set('port', port);
const server = http_1.default.createServer(app);
server.on("error", (error) => {
    if (error.syscall !== "listen")
        throw error;
});
app.get("/", (req, res, next) => {
    res.send('Welcome!!!');
});
app.use("/user", user_1.userRouters);
app.use("/achievement", token_1.userAuthenticated, achievement_1.achievementRouters);
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[server]: Server is running, current time: `, new Date());
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () { return console.log((yield axios_1.default.get('https://thnvn-knowledge-challenge.onrender.com')).data); }), 1000 * 60 * (5 - 0.1)); // 4.9p
}));
