"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// @ts-ignore
var corestore_1 = require("corestore");
var corestore = new corestore_1.default('./db');
var db = corestore.get({ name: "numbers", valueEncoding: 'json' });
exports.db = db;
