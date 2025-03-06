import { defineType, defineField } from "sanity";

export const categorySchema = defineType({
  name: "category",
  title: "News Categories",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
  ],
});
