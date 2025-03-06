import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./sanity/schemas";


export default defineConfig({
  name: "default",
  title: "My Sanity Blog",
  projectId: "bgqq8r69", // ✅ Ensure this matches your project
  dataset: "production",
  plugins: [deskTool()],
  schema: {
    types: schemaTypes, // ✅ Ensure this imports all schema types
  },
});
