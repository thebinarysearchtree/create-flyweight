import createClient from './db.js';
import { watch } from 'flyweight-client';
import paths from './paths.js';

const db = createClient({ internal: true });

watch(db, paths, 'turso');
