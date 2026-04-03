import fs from "fs";
import path from "path";
import { DB } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export function readDB(): DB {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DB;
}

export function writeDB(data: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
