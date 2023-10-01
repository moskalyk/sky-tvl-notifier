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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var index_1 = require("../index");
var _1 = require(".");
dotenv.config();
// import { db } from './db'
var mongoose_1 = require("mongoose");
var Stat_1 = require("./models/Stat");
var simple_statistics_1 = require("simple-statistics");
var username = 'mm';
var password = process.env.PASSWORD;
var hosts = 'lon5-c14-0.mongo.objectrocket.com:43793,lon5-c14-1.mongo.objectrocket.com:43793,lon5-c14-2.mongo.objectrocket.com:43793';
var database = 'erc721';
var options = '?replicaSet=faf5ae88bece406282f758108bb2641e';
var connectionString = 'mongodb://' + username + ':' + password + '@' + hosts + '/' + database + options;
// Connect to the remote MongoDB database
console.log(connectionString);
mongoose_1.default.connect(connectionString)
    .then(function () {
    console.log('Connected to MongoDB');
})
    .catch(function (err) {
    console.error('Error connecting to MongoDB:', err);
});
// create sky object
var sky = new index_1.default({
    twilio_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
    mode: 'prisms',
    from: process.env.TWILIO_FROM
});
sky.start([], 60000 * 60);
// const fullStream = db.createReadStream();
function categorizeValue(input) {
    switch (input) {
        case "str":
        case "agi":
        case "wis":
        case "hrt":
        case "int":
            return 0;
        case "agi_str":
        case "wis_str":
        case "hrt_str":
        case "int_str":
        case "agi_wis":
        case "agi_hrt":
        case "agi_int":
        case "hrt_wis":
        case "int_wis":
        case "int_hrt":
            return 1;
        case "light":
        case "mind":
        case "metal":
        case "water":
        case "air":
        case "earth":
        case "dark":
            return 2;
        default:
            return -1; // Return -1 for unknown inputs
    }
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); })();
var isValidPhoneNumber = function (phoneNumber) {
    var phoneRegex = /^(\+1)?\d{3}\d{3}\d{4}$/;
    return phoneRegex.test(phoneNumber);
};
var PORT = process.env.PORT || 4000;
var app = (0, express_1.default)();
var corsOptions = {
    origin: ['http://216.128.179.88:3000', 'http://localhost:3000'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
var ethauthproofandnumber = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Middleware executed');
                _a = isValidPhoneNumber(req.body.number);
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, _1.auth)(req.body.wallet, req.body.ethAuthProofString)];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                if (_a) {
                    next(); // Call next to pass control to the next middleware
                }
                else {
                    res.send(400);
                }
                return [2 /*return*/];
        }
    });
}); };
app.post('/signUp', ethauthproofandnumber, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tx, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, _1.signUp)(req.body.number, req.body.email)];
            case 1:
                tx = _a.sent();
                res.send({ tx: tx, status: 200 });
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                res.send({ msg: e_1, status: 500 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/live', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var all, calculatePercentageChange, calculatePValue, result;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, Stat_1.Stat.find({ time_type: '1hr' }, null, { sort: { createdAt: -1 }, limit: 2 })];
            case 1:
                all = _c.sent();
                if (all.length < 2) {
                    res.status(400).send("Not enough data to calculate average change.");
                    return [2 /*return*/];
                }
                calculatePercentageChange = function (currentValue, previousValue) {
                    if (previousValue !== 0) {
                        return ((currentValue - previousValue) / previousValue) * 100;
                    }
                    else {
                        return 0;
                    }
                };
                calculatePValue = function (values, prism) { return __awaiter(void 0, void 0, void 0, function () {
                    var all, tvlValues, moonPeriodValues, p;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Stat_1.Stat.find({}, null, { sort: { createdAt: -1 }, limit: 1000 })];
                            case 1:
                                all = _a.sent();
                                tvlValues = all.map(function (entry) { return entry.tvl[prism]; });
                                moonPeriodValues = all.map(function (entry) { return entry.moon_period; });
                                console.log(tvlValues);
                                console.log(moonPeriodValues);
                                p = simple_statistics_1.default.sampleCorrelation(tvlValues, moonPeriodValues);
                                console.log("sample:", p);
                                return [2 /*return*/, p];
                        }
                    });
                }); };
                _a = {
                    tvl: {
                        str: calculatePercentageChange(all[0].tvl.str, all[1].tvl.str),
                        agi: calculatePercentageChange(all[0].tvl.agi, all[1].tvl.agi),
                        wis: calculatePercentageChange(all[0].tvl.wis, all[1].tvl.wis),
                        hrt: calculatePercentageChange(all[0].tvl.hrt, all[1].tvl.hrt),
                        int: calculatePercentageChange(all[0].tvl.int, all[1].tvl.int),
                    }
                };
                _b = {};
                return [4 /*yield*/, calculatePValue(all, 'str')];
            case 2:
                // todo: optimize
                _b.str = _c.sent();
                return [4 /*yield*/, calculatePValue(all, 'agi')];
            case 3:
                _b.agi = _c.sent();
                return [4 /*yield*/, calculatePValue(all, 'wis')];
            case 4:
                _b.wis = _c.sent();
                return [4 /*yield*/, calculatePValue(all, 'hrt')];
            case 5:
                _b.hrt = _c.sent();
                return [4 /*yield*/, calculatePValue(all, 'int')];
            case 6:
                result = (_a.p_val_moon = (_b.int = _c.sent(),
                    _b),
                    _a.tvl_elements = {
                        air: calculatePercentageChange(all[0].tvl_elements.air, all[1].tvl_elements.air),
                        dark: calculatePercentageChange(all[0].tvl_elements.dark, all[1].tvl_elements.dark),
                        earth: calculatePercentageChange(all[0].tvl_elements.earth, all[1].tvl_elements.earth),
                        fire: calculatePercentageChange(all[0].tvl_elements.fire, all[1].tvl_elements.fire),
                        light: calculatePercentageChange(all[0].tvl_elements.light, all[1].tvl_elements.light),
                        metal: calculatePercentageChange(all[0].tvl_elements.metal, all[1].tvl_elements.metal),
                        mind: calculatePercentageChange(all[0].tvl_elements.mind, all[1].tvl_elements.mind),
                        water: calculatePercentageChange(all[0].tvl_elements.water, all[1].tvl_elements.water)
                    },
                    _a);
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
app.get('/fire', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    // console.log(results)
    // const result = {
    //     tvl: {
    //         str: calculatePercentageChange(all[0]!.tvl!.str, all[1]!.tvl!.str),
    //         agi: calculatePercentageChange(all[0]!.tvl!.agi, all[1]!.tvl!.agi),
    //         wis: calculatePercentageChange(all[0]!.tvl!.wis, all[1]!.tvl!.wis),
    //         hrt: calculatePercentageChange(all[0]!.tvl!.hrt, all[1]!.tvl!.hrt),
    //         int: calculatePercentageChange(all[0]!.tvl!.int, all[1]!.tvl!.int),
    //     },
    //     p_val_moon: {
    //         // todo: optimize
    //         str: await calculatePValue(all, 'str'),
    //         agi: await calculatePValue(all, 'agi'),
    //         wis: await calculatePValue(all, 'wis'),
    //         hrt: await calculatePValue(all, 'hrt'),
    //         int: await calculatePValue(all, 'int')
    //     },
    //     tvl_elements: {
    //         air: calculatePercentageChange(all[0]!.tvl_elements!.air, all[1]!.tvl_elements!.air!),
    //         dark: calculatePercentageChange(all[0]!.tvl_elements!.dark, all[1]!.tvl_elements!.dark!),
    //         earth: calculatePercentageChange(all[0]!.tvl_elements!.earth, all[1]!.tvl_elements!.earth!),
    //         fire: calculatePercentageChange(all[0]!.tvl_elements!.fire, all[1]!.tvl_elements!.fire!),
    //         light: calculatePercentageChange(all[0]!.tvl_elements!.light, all[1]!.tvl_elements!.light!),
    //         metal: calculatePercentageChange(all[0]!.tvl_elements!.metal, all[1]!.tvl_elements!.metal!),
    //         mind: calculatePercentageChange(all[0]!.tvl_elements!.mind, all[1]!.tvl_elements!.mind!),
    //         water: calculatePercentageChange(all[0]!.tvl_elements!.water, all[1]!.tvl_elements!.water!)
    //     }
    // };
    // res.send(results);
    function cumulativeSumUsingReduce(arr) {
        return arr.reduce(function (accumulator, currentValue) { return accumulator + currentValue; }, 0);
    }
    function findKeyWithHighestValue(obj) {
        var maxKey = null;
        var maxValue = -Infinity;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var value = obj[key];
                if (value > maxValue) {
                    maxValue = value;
                    maxKey = key;
                }
            }
        }
        return maxKey;
    }
    function calculateValue(data) {
        var elementTotals = {
            air: 0,
            dark: 0,
            earth: 0,
            fire: 0,
            light: 0,
            metal: 0,
            mind: 0,
            water: 0
        };
        var tvlTotals = {
            str: 0,
            agi: 0,
            wis: 0,
            hrt: 0,
            int: 0
        };
        var dualTotals = {
            agi_str: 0,
            wis_str: 0,
            hrt_str: 0,
            int_str: 0,
            agi_wis: 0,
            agi_hrt: 0,
            agi_int: 0,
            hrt_wis: 0,
            int_wis: 0,
            int_hrt: 0
        };
        // Your original data
        var originalData = [
            "air, wis_str, agi_wis, int_hrt, agi_hrt",
            "agi_str, air, str, wis",
            "agi_str, light, hrt, int_str",
            "hrt, int, dark",
            "hrt_str, dark, light, mind",
            "mind, str, wis_str, agi",
        ];
        // Iterate through each line in the original data
        var total = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };
        originalData.forEach(function (line, i) {
            var traits = line.split(', ');
            traits.forEach(function (trait) {
                if (categorizeValue(trait) == 0) {
                    // prism
                    total[i] = total[i] + Number(cumulativeSumUsingReduce(data.tvl[trait]));
                }
                else if (categorizeValue(trait) == 1) {
                    var prism = trait.split('_');
                    // dual
                    total[i] = total[i] + Number(cumulativeSumUsingReduce(data.tvl[prism[0]])) + Number(cumulativeSumUsingReduce(data.tvl[prism[1]]));
                }
                else {
                    // elements
                    total[i] = total[i] + Number(cumulativeSumUsingReduce(data.tvl_elements[trait]));
                }
            });
        });
        console.log(total);
        return findKeyWithHighestValue(total);
    }
    var all, results, shouldBreak, calculatePercentageChange, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Stat_1.Stat.find({ time_type: '1hr' }, null, { sort: { createdAt: -1 }, limit: 25 })];
            case 1:
                all = _a.sent();
                results = {
                    tvl_elements: {
                        air: [],
                        dark: [],
                        earth: [],
                        fire: [],
                        light: [],
                        metal: [],
                        mind: [],
                        water: []
                    },
                    tvl: {
                        str: [],
                        agi: [],
                        wis: [],
                        hrt: [],
                        int: []
                    }
                };
                shouldBreak = false;
                calculatePercentageChange = function (currentValue, previousValue) {
                    if (previousValue !== 0) {
                        return ((currentValue - previousValue) / previousValue) * 100;
                    }
                    else {
                        return 0;
                    }
                };
                all.map(function (el, i) {
                    if (shouldBreak) {
                        return; // Skip further iterations
                    }
                    if (i === 23) {
                        shouldBreak = true; // Set the flag to break
                        return;
                    }
                    // elements
                    results.tvl_elements.air.push(calculatePercentageChange(all[i].tvl_elements.air, all[i + 1].tvl_elements.air));
                    results.tvl_elements.dark.push(calculatePercentageChange(all[i].tvl_elements.dark, all[i + 1].tvl_elements.dark));
                    results.tvl_elements.earth.push(calculatePercentageChange(all[i].tvl_elements.earth, all[i + 1].tvl_elements.earth));
                    results.tvl_elements.fire.push(calculatePercentageChange(all[i].tvl_elements.fire, all[i + 1].tvl_elements.fire));
                    results.tvl_elements.light.push(calculatePercentageChange(all[i].tvl_elements.light, all[i + 1].tvl_elements.light));
                    results.tvl_elements.metal.push(calculatePercentageChange(all[i].tvl_elements.metal, all[i + 1].tvl_elements.metal));
                    results.tvl_elements.mind.push(calculatePercentageChange(all[i].tvl_elements.mind, all[i + 1].tvl_elements.mind));
                    results.tvl_elements.water.push(calculatePercentageChange(all[i].tvl_elements.water, all[i + 1].tvl_elements.water));
                    //prisms
                    results.tvl.str.push(calculatePercentageChange(all[i].tvl.str, all[i + 1].tvl.str));
                    results.tvl.agi.push(calculatePercentageChange(all[i].tvl.agi, all[i + 1].tvl.agi));
                    results.tvl.wis.push(calculatePercentageChange(all[i].tvl.wis, all[i + 1].tvl.wis));
                    results.tvl.hrt.push(calculatePercentageChange(all[i].tvl.hrt, all[i + 1].tvl.hrt));
                    results.tvl.int.push(calculatePercentageChange(all[i].tvl.int, all[i + 1].tvl.int));
                });
                result = calculateValue(results);
                console.log("Value: ".concat(result));
                res.send({ fire_state: result });
                return [2 /*return*/];
        }
    });
}); });
app.get('/load', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var raw, i, newStat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                raw = [[1, 1, 1, 1, 1], [5, 5, 5, 5, 5]];
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < raw.length)) return [3 /*break*/, 4];
                newStat = new Stat_1.Stat({ moon_period: 0, aspects: [['1', 'X', '0']], time_type: '1hr', tvl: { str: raw[i][0], agi: raw[i][1], wis: raw[i][0], hrt: raw[i][1], int: raw[i][0] } });
                return [4 /*yield*/, newStat.save()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4:
                res.sendStatus(200);
                return [2 /*return*/];
        }
    });
}); });
app.get('/trend', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var all, tvlData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Stat_1.Stat.find({}, null, { sort: { createdAt: -1 }, limit: 24 * 7 })];
            case 1:
                all = _a.sent();
                tvlData = {
                    str: [],
                    agi: [],
                    wis: [],
                    hrt: [],
                    int: [],
                };
                all.forEach(function (stat) {
                    var _a = stat.tvl, str = _a.str, agi = _a.agi, wis = _a.wis, hrt = _a.hrt, int = _a.int;
                    tvlData.str.unshift(str);
                    tvlData.agi.unshift(agi);
                    tvlData.wis.unshift(wis);
                    tvlData.hrt.unshift(hrt);
                    tvlData.int.unshift(int);
                });
                // console.log(tvlData);
                res.send({ tvl: tvlData });
                return [2 /*return*/];
        }
    });
}); });
app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("listening on port: ".concat(PORT));
        return [2 /*return*/];
    });
}); });
