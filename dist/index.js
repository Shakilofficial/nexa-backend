"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config({
    path: './.env',
});
const port = process.env.PORT || 8000;
(0, db_1.default)()
    .then(() => {
    app_1.app.listen(process.env.PORT || 8000, () => {
        console.log(`🌐 Server is running at Port: ${port}`);
    });
})
    .catch((err) => {
    console.log('MongoDB connection failed !!!', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map