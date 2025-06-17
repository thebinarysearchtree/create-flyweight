import { database } from './db.js';
import { watch } from 'flyweight-client';
import { paths } from './config.js';

watch(database, paths);
