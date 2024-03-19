#!/usr/bin/env node
const path = require("node:path");
const minimist = require("minimist");
const { Plop, run } = require("plop");

const args = process.argv.slice(2);
const argv = minimist(args);

Plop.prepare({
    cwd: argv.cwd,
    configPath: path.join(__dirname, 'plopfile.js'),
    preload: argv.preload || [],
    completion: argv.completion
}, env => Plop.execute(env, run));