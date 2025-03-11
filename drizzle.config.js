import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_k3gbnoGSO1ji@ep-dry-darkness-a1xtjj6y-pooler.ap-southeast-1.aws.neon.tech/ai-form-builder?sslmode=require',
  }
});
