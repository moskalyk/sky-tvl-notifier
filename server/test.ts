import * as dotenv from "dotenv";

import { createServer } from "http";
import socketIo from "socket.io";
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import SkyHealth from '../index';
import { auth, signUp } from '.';
import http from 'http';

dotenv.config();

import { db } from './db'
import mongoose from 'mongoose';
import { Stat } from './models/Stat'

var username = 'mm';
var password = process.env.PASSWORD;
var hosts = 'lon5-c14-0.mongo.objectrocket.com:43793,lon5-c14-1.mongo.objectrocket.com:43793,lon5-c14-2.mongo.objectrocket.com:43793';
var database = 'erc721';
var options = '?replicaSet=faf5ae88bece406282f758108bb2641e';
var connectionString = 'mongodb://' + username + ':' + password + '@' + hosts + '/' + database + options;
// Connect to the remote MongoDB database
console.log(connectionString)
mongoose.connect(connectionString)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

(async () => {
    const all = await Stat.find({})
    console.log(all)
})();
