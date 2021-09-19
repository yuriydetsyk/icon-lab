import * as path from 'path';
const main = require('require-main-filename')();

export const appRoot = path.dirname(main);
