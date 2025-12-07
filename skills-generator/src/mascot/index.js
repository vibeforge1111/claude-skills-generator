/**
 * HOOT-9000 Mascot System
 * The owl-robot-monster mascot for Claude Skills Generator
 */

import chalk from 'chalk';
import { getHootArt, generateMascotArt, CHILD_MASCOT_TEMPLATES } from './art.js';
import {
  NORMAL_VOICE,
  SARCASM_VOICE,
  getRandomTip,
  getEasterEgg,
  getChildVoice,
  getQualityMessage,
} from './voice.js';

// Global mascot configuration
let mascotConfig = {
  enabled: true,
  sarcasm: false,
  animations: true,
};

/**
 * Configure mascot settings
 */
export function configureMascot(options = {}) {
  mascotConfig = { ...mascotConfig, ...options };
}

/**
 * Check if mascot is enabled
 */
export function isMascotEnabled() {
  return mascotConfig.enabled;
}

/**
 * Check if sarcasm mode is enabled
 */
export function isSarcasmEnabled() {
  return mascotConfig.sarcasm;
}

/**
 * Get current voice based on sarcasm setting
 */
function getVoice() {
  return mascotConfig.sarcasm ? SARCASM_VOICE : NORMAL_VOICE;
}

/**
 * Display HOOT-9000 with a message
 */
export function hoot(state = 'normal', message = null) {
  if (!mascotConfig.enabled) {
    if (message) console.log(message);
    return;
  }

  const art = getHootArt(state);
  const coloredArt = colorize(art, state);

  console.log(coloredArt);
  if (message) {
    console.log();
    console.log(chalk.cyan(message));
  }
}

/**
 * Colorize mascot art based on state
 */
function colorize(art, state) {
  switch (state) {
    case 'normal':
      return chalk.cyan(art);
    case 'thinking':
      return chalk.yellow(art);
    case 'excited':
      return chalk.green(art);
    case 'error':
      return chalk.red(art);
    case 'sleeping':
      return chalk.gray(art);
    case 'wink':
      return chalk.magenta(art);
    default:
      return chalk.cyan(art);
  }
}

/**
 * Say a message (with or without mascot art)
 */
export function say(messageKey, artState = null) {
  const voice = getVoice();
  const message = voice[messageKey] || messageKey;

  if (artState && mascotConfig.enabled) {
    hoot(artState, message);
  } else {
    console.log(chalk.cyan(`> ${message}`));
  }
}

/**
 * Show welcome message
 */
export function welcome() {
  hoot('normal', getVoice().welcome);
}

/**
 * Show thinking state
 */
export function thinking(message = null) {
  const voice = getVoice();
  hoot('thinking', message || voice.thinking);
}

/**
 * Show success state
 */
export function success(message = null) {
  const voice = getVoice();
  hoot('excited', message || voice.success);

  // Easter egg chance in sarcasm mode
  if (mascotConfig.sarcasm && Math.random() < 0.1) {
    console.log();
    console.log(chalk.magenta(`> ${getEasterEgg()}`));
  }
}

/**
 * Show error state
 */
export function error(message = null) {
  const voice = getVoice();
  hoot('error', message || voice.error);
}

/**
 * Show a random tip
 */
export function tip() {
  const tipMessage = getRandomTip(mascotConfig.sarcasm);
  console.log(chalk.yellow(`> ${tipMessage}`));
}

/**
 * Show quality feedback
 */
export function qualityFeedback(score) {
  const message = getQualityMessage(score, mascotConfig.sarcasm);
  const state = score >= 70 ? 'excited' : score >= 50 ? 'normal' : 'error';
  hoot(state, message);
}

/**
 * Goodbye message
 */
export function goodbye() {
  hoot('wink', getVoice().goodbye);
}

/**
 * Create a child mascot instance
 */
export function createChildMascot(options = {}) {
  const { domain = 'generic', name = null, personality = null } = options;

  const template = CHILD_MASCOT_TEMPLATES[domain] || CHILD_MASCOT_TEMPLATES.generic;
  const mascotName = name || template.name;
  const art = generateMascotArt(domain, mascotName);

  return {
    name: mascotName,
    domain,
    personality: personality || `${domain}-focused, helpful`,
    art,
    voice: getChildVoice(domain, mascotConfig.sarcasm),

    show(state = 'normal', message = null) {
      if (!mascotConfig.enabled) {
        if (message) console.log(message);
        return;
      }

      const artState = art[state] || art.normal;
      console.log(chalk.cyan(artState));
      if (message) {
        console.log();
        console.log(chalk.cyan(`> ${message}`));
      }
    },

    say(key) {
      const voice = getChildVoice(domain, mascotConfig.sarcasm);
      const message = voice[key] || key;
      console.log(chalk.cyan(`> ${message}`));
    },

    toJSON() {
      return {
        name: mascotName,
        parent: 'HOOT-9000',
        personality: {
          style: personality || `${domain}-focused`,
          traits: [domain, 'helpful'],
        },
        art,
        voice: {
          normal: getChildVoice(domain, false),
          sarcasm: getChildVoice(domain, true),
        },
        enabled: true,
      };
    },
  };
}

/**
 * List available child mascot templates
 */
export function listMascotTemplates() {
  return Object.keys(CHILD_MASCOT_TEMPLATES).map((key) => ({
    key,
    name: CHILD_MASCOT_TEMPLATES[key].name,
    description: `${key.charAt(0).toUpperCase() + key.slice(1)}-focused mascot`,
  }));
}

/**
 * Get suggested mascot for a domain
 */
export function suggestMascot(domain) {
  const template = CHILD_MASCOT_TEMPLATES[domain];
  if (template) {
    return {
      name: template.name,
      domain,
      template,
    };
  }
  return {
    name: 'SKILL-BOT',
    domain: 'generic',
    template: CHILD_MASCOT_TEMPLATES.generic,
  };
}

export default {
  configureMascot,
  isMascotEnabled,
  isSarcasmEnabled,
  hoot,
  say,
  welcome,
  thinking,
  success,
  error,
  tip,
  qualityFeedback,
  goodbye,
  createChildMascot,
  listMascotTemplates,
  suggestMascot,
};
