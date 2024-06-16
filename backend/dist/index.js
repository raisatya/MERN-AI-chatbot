"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connection_js_1 = require("./db/connection.js");
//connections and listeneres
const PORT = process.env.PORT || 5000;
(0, connection_js_1.connectToDatabase)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`[server]: running on port: ${PORT} | http://localhost:${PORT}/`);
    });
})
    .catch((err) => console.log(err));
