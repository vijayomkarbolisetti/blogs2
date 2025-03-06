import { defineType, defineField } from "sanity";

export const authorSchema = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text" }),
    defineField({
      name: "image",
      title: "Profile Picture",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
