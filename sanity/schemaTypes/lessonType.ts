import { PlayIcon, UserIcon, VideoIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  icon: PlayIcon,
  groups: [
    { name: "content", title: "Content", icon: PlayIcon, default: true },
    { name: "video", title: "Video", icon: VideoIcon },
    { name: "settings", title: "Settings" },
    { name: "completion", title: "Completed By", icon: UserIcon },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (Rule) => [
        Rule.required().error("Lesson title is required"),
        Rule.max(100).warning("Keep lesson titles concise"),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "settings",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => [
        Rule.required().error("Slug is required for URL generation"),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "content",
      description: "Brief overview of what this lesson covers",
      validation: (Rule) => [
        Rule.max(500).warning("Keep descriptions under 500 characters"),
      ],
    }),
    defineField({
      title: "Video file",
      name: "video",
      type: "mux.video",
      group: ["content", "video"],
      description: "Upload or select a video for this lesson",
    }),
    defineField({
      title: "YouTube URL",
      name: "youtubeUrl",
      type: "url",
      group: ["content", "video"],
      description: "Alternative: Paste a YouTube video URL (e.g., https://www.youtube.com/watch?v=...) or embed URL (e.g., https://www.youtube.com/embed/...)",
      validation: (Rule) => [
        Rule.custom((value, context) => {
          if (!value) return true; // Optional field
          const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
          if (!youtubeRegex.test(value)) {
            return "Please enter a valid YouTube URL";
          }
          return true;
        }),
      ],
    }),
    defineField({
      name: "content",
      type: "array",
      group: "content",
      description: "Additional lesson content, notes, or resources",
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.required().error("URL is required for links"),
                  },
                  {
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          fields: [
            defineField({
              name: "caption",
              type: "string",
              description: "Optional caption for the image",
            }),
            defineField({
              name: "alt",
              type: "string",
              description: "Alternative text for accessibility",
            }),
          ],
        }),
        // TODO: Add code blocks once @sanity/code-input is installed
        // defineArrayMember({
        //   type: "code",
        //   options: {
        //     withFilename: true,
        //   },
        // }),
      ],
    }),
    defineField({
      name: "completedBy",
      type: "array",
      group: "completion",
      description: "List of user IDs who have completed this lesson",
      of: [defineArrayMember({ type: "string" })],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Untitled Lesson",
        media: PlayIcon,
      };
    },
  },
});
