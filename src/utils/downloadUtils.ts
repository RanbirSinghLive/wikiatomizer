export const generateMarkdown = (title: string, content: string, index: number): string => {
  return `# ${title}

${content}

---
Notecard ${index + 1}
`;
};

export const downloadMarkdown = (title: string, content: string, index: number) => {
  const markdown = generateMarkdown(title, content, index);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notecard-${index + 1}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log(`Downloaded notecard ${index + 1}: ${title}`);
}; 