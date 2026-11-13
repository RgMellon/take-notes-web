export type Structured = {
  id: string;
  chapterId: string;
  markdownContent: string;
  frontmatter: Record<string, unknown>;
  generatedAt: string;
};
