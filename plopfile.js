import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `.env.local`, override: true });

export default async function (plop) {
    plop.setPlopfilePath(__dirname);
    await plop.load(path.join(__dirname, 'src', 'actions-brokers-generator.js'));
};