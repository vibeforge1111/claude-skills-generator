import { YoutubeTranscript } from 'youtube-transcript';

// Extract video ID from various YouTube URL formats
export function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  throw new Error(`Invalid YouTube URL: ${url}`);
}

// Fetch transcript for a video
export async function fetchTranscript(url) {
  const videoId = extractVideoId(url);

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    // Combine transcript segments
    const text = transcript.map((segment) => segment.text).join(' ');

    // Clean up text
    const cleaned = text
      .replace(/\[.*?\]/g, '') // Remove [Music], [Applause], etc.
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();

    return {
      videoId,
      url: `https://youtube.com/watch?v=${videoId}`,
      text: cleaned,
      segments: transcript,
      duration: transcript.length > 0
        ? Math.round(transcript[transcript.length - 1].offset / 1000 / 60)
        : 0,
      wordCount: cleaned.split(/\s+/).length,
    };
  } catch (error) {
    throw new Error(`Failed to fetch transcript: ${error.message}`);
  }
}

// Fetch multiple transcripts
export async function fetchMultipleTranscripts(urls) {
  const results = [];

  for (const url of urls) {
    try {
      const transcript = await fetchTranscript(url);
      results.push({ success: true, ...transcript });
    } catch (error) {
      results.push({ success: false, url, error: error.message });
    }
  }

  return results;
}

// Chunk transcript for processing (if too long)
export function chunkTranscript(text, maxChars = 10000) {
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChars) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export default {
  extractVideoId,
  fetchTranscript,
  fetchMultipleTranscripts,
  chunkTranscript,
};
