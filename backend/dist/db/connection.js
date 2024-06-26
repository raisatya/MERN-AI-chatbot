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
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromDatabase = exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(process.env.PORT);
        try {
            if (!process.env.MONGO_URI) {
                throw new Error("MONGO_URI must be defined");
            }
            yield (0, mongoose_1.connect)(process.env.MONGO_URI);
        }
        catch (error) {
            console.log(error);
            throw new Error("Could not Connect To MongoDB");
        }
    });
}
exports.connectToDatabase = connectToDatabase;
function disconnectFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_1.disconnect)();
        }
        catch (error) {
            console.log(error);
            throw new Error("Could not Disconnect From MongoDB");
        }
    });
}
exports.disconnectFromDatabase = disconnectFromDatabase;
