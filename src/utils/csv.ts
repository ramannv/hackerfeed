import { StarredStory } from '../types';

export const exportStarredStoriesToCSV = (stories: StarredStory[]): void => {
  if (stories.length === 0) {
    alert('No starred stories to export');
    return;
  }

  // CSV headers
  const headers = ['Title', 'URL', 'Author', 'Domain', 'Starred Date'];

  // Convert stories to CSV rows
  const rows = stories.map(story => {
    const date = new Date(story.starredAt).toISOString().split('T')[0];
    return [
      escapeCSV(story.title),
      escapeCSV(story.url || ''),
      escapeCSV(story.by),
      escapeCSV(story.domain || ''),
      date,
    ].join(',');
  });

  // Combine headers and rows
  const csv = [headers.join(','), ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `hn_starred_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Escape special characters in CSV
const escapeCSV = (value: string): string => {
  if (!value) return '';

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};
