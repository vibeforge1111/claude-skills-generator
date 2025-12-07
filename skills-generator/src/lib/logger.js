import chalk from 'chalk';
import ora from 'ora';

// Symbols for status indicators
const symbols = {
  success: chalk.green('✓'),
  error: chalk.red('✗'),
  warning: chalk.yellow('!'),
  info: chalk.blue('ℹ'),
  active: chalk.cyan('>'),
  pending: chalk.gray('○'),
  completed: chalk.green('+'),
  needsInput: chalk.magenta('*'),
};

// Create a spinner
export function spinner(text) {
  return ora({
    text,
    color: 'cyan',
  });
}

// Log with prefix
export function log(message, type = 'info') {
  const prefix = symbols[type] || symbols.info;
  console.log(`${prefix} ${message}`);
}

// Shorthand methods
export function success(message) {
  log(message, 'success');
}

export function error(message) {
  log(chalk.red(message), 'error');
}

export function warn(message) {
  log(chalk.yellow(message), 'warning');
}

export function info(message) {
  log(message, 'info');
}

// Header for sections
export function header(text) {
  console.log();
  console.log(chalk.bold.cyan(text));
  console.log(chalk.gray('─'.repeat(text.length)));
}

// Subheader
export function subheader(text) {
  console.log();
  console.log(chalk.bold(text));
}

// List item
export function listItem(text, indent = 0) {
  const padding = '  '.repeat(indent);
  console.log(`${padding}${chalk.gray('•')} ${text}`);
}

// Key-value pair
export function keyValue(key, value, indent = 0) {
  const padding = '  '.repeat(indent);
  console.log(`${padding}${chalk.gray(key + ':')} ${value}`);
}

// Score display (for validation)
export function score(label, value, max = 100) {
  const percentage = Math.round((value / max) * 100);
  let color = chalk.green;
  if (percentage < 70) color = chalk.yellow;
  if (percentage < 50) color = chalk.red;
  console.log(`${label}: ${color(`${value}/${max}`)} (${percentage}%)`);
}

// Box for important messages
export function box(title, content) {
  const width = 60;
  const border = chalk.gray('─'.repeat(width));

  console.log();
  console.log(border);
  console.log(chalk.bold(title));
  console.log(border);
  console.log(content);
  console.log(border);
  console.log();
}

// Newline
export function newline() {
  console.log();
}

export default {
  spinner,
  log,
  success,
  error,
  warn,
  info,
  header,
  subheader,
  listItem,
  keyValue,
  score,
  box,
  newline,
  symbols,
};
