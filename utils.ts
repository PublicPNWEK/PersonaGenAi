import { ProfileSuggestions } from "./types";

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const profilesToMarkdown = (suggestions: ProfileSuggestions): string => {
    let markdown = `# Social Media Launch Kit\n\n`;
    markdown += `**Generated on:** ${new Date().toLocaleDateString()}\n\n---\n\n`;

    suggestions.forEach(profile => {
        markdown += `## ${profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1)}\n\n`;
        markdown += `**Username:** \`${profile.username}\`\n\n`;
        markdown += `**Bio:**\n`;
        markdown += `> ${profile.bio.replace(/\n/g, '\n> ')}\n\n`;
        markdown += `---\n\n`;
    });

    return markdown;
};
