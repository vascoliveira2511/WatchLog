import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
  console.log("Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file");
  process.exit(1);
}

const sqlFile = join(__dirname, "../supabase/migrations/001_initial_setup.sql");
const sql = readFileSync(sqlFile, "utf8");

async function setupDatabase() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Database setup failed:", error);
      process.exit(1);
    }

    console.log("✅ Database schema created successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
