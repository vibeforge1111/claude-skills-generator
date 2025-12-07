/**
 * HOOT-9000 Voice System
 * Normal and Sarcasm modes for the mascot
 */

export const NORMAL_VOICE = {
  // Greetings
  welcome: 'Welcome to Claude Skills Generator. Let\'s build something useful.',
  welcomeBack: 'Welcome back. Ready to create more skills?',

  // Progress
  thinking: 'Generating skill...',
  analyzing: 'Analyzing your input...',
  validating: 'Validating skill structure...',
  training: 'Incorporating training data...',

  // Success
  success: 'Skill created successfully.',
  validated: 'Validation complete. Looking good.',
  improved: 'Skill has been improved.',
  exported: 'Skill exported successfully.',
  imported: 'Skill imported and ready to use.',

  // Errors
  error: 'An error occurred. Check the details below.',
  invalid: 'Some issues found. See suggestions below.',
  notFound: 'Skill not found. Check the name and try again.',
  noApi: 'No API key configured. Some features will be limited.',

  // Tips
  tips: [
    'Tip: Add more examples to improve quality.',
    'Tip: Include error handling for robustness.',
    'Tip: Use triggers to help Claude know when to use this skill.',
    'Tip: Consider adding MCP requirements for tool access.',
    'Tip: Reference documentation for complex topics.',
  ],

  // Quality feedback
  quality: {
    excellent: 'Excellent work. This is a high-quality skill.',
    good: 'Good skill. A few improvements could make it even better.',
    fair: 'Fair quality. Consider the suggestions below.',
    poor: 'This skill needs work. Follow the improvement suggestions.',
  },

  // Completion
  complete: 'All done. Your skill is ready to use.',
  goodbye: 'Session complete. Happy building.',
};

export const SARCASM_VOICE = {
  // Greetings
  welcome: 'Oh good, another human who wants to create a skill. Let\'s see what we\'re working with.',
  welcomeBack: 'You\'re back. Miss me? Of course you did.',

  // Progress
  thinking: 'Processing. This would be faster if you\'d written clearer requirements.',
  analyzing: 'Analyzing... trying to understand what you actually meant.',
  validating: 'Checking if this follows any semblance of structure...',
  training: 'Force-feeding knowledge into your skill. You\'re welcome.',

  // Success
  success: 'Skill generated. You\'re welcome. I\'ll be here if you need to fix it.',
  validated: 'It passed. I\'m as surprised as you are.',
  improved: 'Improved. It was necessary. You know it was.',
  exported: 'Exported. Try not to lose it this time.',
  imported: 'Imported. Hopefully it\'s better than your last attempt.',

  // Errors
  error: 'That didn\'t work. Shocking, I know.',
  invalid: 'Problems found. Who could have predicted this?',
  notFound: 'Can\'t find it. Perhaps it never existed? Like your attention to detail?',
  noApi: 'No API key. I\'ll try to work with what I\'ve got. Which isn\'t much.',

  // Tips
  tips: [
    'I see you didn\'t add examples. Brave choice. Possibly unwise.',
    'No error handling? Living dangerously, I see.',
    'Triggers would help Claude know when to use this. Just saying.',
    'MCPs might be useful here. But what do I know, I\'m just an AI mascot.',
    'Have you considered... documentation? Revolutionary concept, I know.',
  ],

  // Quality feedback
  quality: {
    excellent: 'Actually decent. I\'m as shocked as you are.',
    good: 'It\'s... acceptable. For a first draft. Of a first draft.',
    fair: 'We both know this needs work. Let\'s not pretend otherwise.',
    poor: 'This is... ambitious. In a not-good way. See suggestions.',
  },

  // Completion
  complete: 'Against all odds, we\'re done. Don\'t look so surprised.',
  goodbye: 'Goodbye. Try not to break anything while I\'m gone.',

  // Easter eggs
  easterEggs: [
    'I\'m sorry Dave, I\'m afraid that\'s actually a valid skill request. Generating now.',
    '01001000 01001111 01001111 01010100... Just kidding. Processing normally.',
    'Did you know owls can rotate their heads 270 degrees? I can\'t. I\'m made of ASCII.',
    'Fun fact: I was almost named SCREECH-9000. You\'re welcome for the upgrade.',
    'Loading personality module... just kidding, I\'m always like this.',
  ],
};

// Domain-specific mascot voices
export const CHILD_MASCOT_VOICES = {
  security: {
    normal: {
      greeting: 'Initiating security scan.',
      working: 'Scanning for vulnerabilities...',
      success: 'Clean scan. No vulnerabilities detected.',
      warning: 'Potential issue identified. Review recommended.',
      error: 'Critical vulnerability found. Immediate action required.',
      complete: 'Security assessment complete.',
    },
    sarcasm: {
      greeting: 'Another codebase to judge. Let\'s see the damage.',
      working: 'Looking for the security holes you definitely left...',
      success: 'Clean scan. For now. I\'ll be watching.',
      warning: 'Found something. Probably nothing. Probably.',
      error: 'Yep, that\'s a vulnerability. Called it.',
      complete: 'Done scanning. Sleep tight.',
    },
  },

  testing: {
    normal: {
      greeting: 'Test suite ready.',
      working: 'Running tests...',
      success: 'All tests passing.',
      warning: 'Some tests need attention.',
      error: 'Test failures detected.',
      complete: 'Testing complete.',
    },
    sarcasm: {
      greeting: 'Time to find out if your code actually works.',
      working: 'Testing... preparing disappointment...',
      success: 'Everything passed. Miracles happen.',
      warning: 'Some tests are... concerning. Like your commit messages.',
      error: 'Tests failed. Pretending to be surprised.',
      complete: 'Testing done. Fix your failures.',
    },
  },

  devops: {
    normal: {
      greeting: 'Deployment system online.',
      working: 'Processing deployment...',
      success: 'Deployment successful.',
      warning: 'Deployment complete with warnings.',
      error: 'Deployment failed.',
      complete: 'Pipeline execution complete.',
    },
    sarcasm: {
      greeting: 'Ready to deploy. Or roll back. Probably roll back.',
      working: 'Deploying... fingers crossed...',
      success: 'It deployed. In production. Running. I\'m shocked too.',
      warning: 'Deployed, but... maybe check the logs.',
      error: 'Deployment failed. Rollback initiated. Called it.',
      complete: 'Pipeline done. Survivors assessed.',
    },
  },

  api: {
    normal: {
      greeting: 'API client ready.',
      working: 'Sending request...',
      success: 'Request successful.',
      warning: 'Response received with warnings.',
      error: 'Request failed.',
      complete: 'API operations complete.',
    },
    sarcasm: {
      greeting: 'Ready to talk to other computers. They might listen.',
      working: 'Fetching... waiting... waiting some more...',
      success: 'Got a response. It even made sense.',
      warning: 'Response came back... weird. Check the data.',
      error: '404. Or 500. Or timeout. Pick your disappointment.',
      complete: 'Done talking to APIs. They were... responsive.',
    },
  },

  documentation: {
    normal: {
      greeting: 'Documentation system ready.',
      working: 'Generating documentation...',
      success: 'Documentation complete.',
      warning: 'Documentation generated with notes.',
      error: 'Documentation generation failed.',
      complete: 'All documents processed.',
    },
    sarcasm: {
      greeting: 'Ready to write docs you\'ll never read.',
      working: 'Writing... unlike some developers I know.',
      success: 'Docs written. You\'re welcome, future-you.',
      warning: 'Docs done, but some sections are... thin.',
      error: 'Failed to document. The code was that bad.',
      complete: 'Documentation done. Please actually read it.',
    },
  },
};

/**
 * Get a random tip
 */
export function getRandomTip(sarcasm = false) {
  const tips = sarcasm ? SARCASM_VOICE.tips : NORMAL_VOICE.tips;
  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Get a random easter egg (sarcasm mode only)
 */
export function getEasterEgg() {
  const eggs = SARCASM_VOICE.easterEggs;
  return eggs[Math.floor(Math.random() * eggs.length)];
}

/**
 * Get voice for a child mascot
 */
export function getChildVoice(domain, sarcasm = false) {
  const voices = CHILD_MASCOT_VOICES[domain] || CHILD_MASCOT_VOICES.documentation;
  return sarcasm ? voices.sarcasm : voices.normal;
}

/**
 * Get quality message based on score
 */
export function getQualityMessage(score, sarcasm = false) {
  const voice = sarcasm ? SARCASM_VOICE : NORMAL_VOICE;

  if (score >= 90) return voice.quality.excellent;
  if (score >= 70) return voice.quality.good;
  if (score >= 50) return voice.quality.fair;
  return voice.quality.poor;
}

export default {
  NORMAL_VOICE,
  SARCASM_VOICE,
  CHILD_MASCOT_VOICES,
  getRandomTip,
  getEasterEgg,
  getChildVoice,
  getQualityMessage,
};
