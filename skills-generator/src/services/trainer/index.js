import youtube from './youtube.js';
import merger from './merger.js';
import claude from '../../lib/claude.js';
import filesystem from '../../lib/filesystem.js';
import path from 'path';

// Train a skill with YouTube content
export async function trainWithYouTube(skillName, urls, options = {}) {
  const { baseDir = process.cwd(), save = true } = options;

  // Fetch transcripts
  const transcripts = await youtube.fetchMultipleTranscripts(urls);
  const successful = transcripts.filter((t) => t.success);

  if (successful.length === 0) {
    throw new Error('No transcripts could be fetched');
  }

  // Combine all transcript text
  const combinedText = successful.map((t) => t.text).join('\n\n');

  // Extract knowledge using AI
  let knowledge = {
    techniques: [],
    antiPatterns: [],
    tools: [],
    keyInsights: [],
  };

  if (claude.isConfigured()) {
    knowledge = await claude.extractKnowledge(combinedText, skillName);
  }

  // Read current skill
  const skillContent = await filesystem.readSkill(skillName, baseDir);

  // Merge knowledge
  const enhancedContent = await merger.smartMerge(skillContent, knowledge);

  // Save enhanced skill
  if (save) {
    await filesystem.writeSkill(skillName, enhancedContent, baseDir);

    // Save transcripts to resources
    const skillPath = filesystem.getSkillPath(skillName, baseDir);
    const transcriptsDir = path.join(skillPath, 'resources', 'transcripts');

    for (const transcript of successful) {
      const filename = `${transcript.videoId}.txt`;
      const filepath = path.join(transcriptsDir, filename);
      await filesystem.ensureDir(transcriptsDir);
      const fs = await import('fs/promises');
      await fs.writeFile(filepath, transcript.text, 'utf-8');
    }
  }

  return {
    transcripts: {
      total: urls.length,
      successful: successful.length,
      failed: transcripts.filter((t) => !t.success).length,
      totalWords: successful.reduce((sum, t) => sum + t.wordCount, 0),
    },
    knowledge,
    enhancedContent,
  };
}

// Just fetch and save transcripts
export async function fetchAndSaveTranscripts(skillName, urls, baseDir = process.cwd()) {
  const transcripts = await youtube.fetchMultipleTranscripts(urls);
  const successful = transcripts.filter((t) => t.success);

  const skillPath = filesystem.getSkillPath(skillName, baseDir);
  const transcriptsDir = path.join(skillPath, 'resources', 'transcripts');
  await filesystem.ensureDir(transcriptsDir);

  const fs = await import('fs/promises');
  for (const transcript of successful) {
    const filename = `${transcript.videoId}.txt`;
    const filepath = path.join(transcriptsDir, filename);
    await fs.writeFile(filepath, transcript.text, 'utf-8');
  }

  return {
    saved: successful.length,
    failed: transcripts.filter((t) => !t.success).length,
    directory: transcriptsDir,
  };
}

export default {
  trainWithYouTube,
  fetchAndSaveTranscripts,
};
