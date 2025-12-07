import chalk from 'chalk';
import logger from '../../lib/logger.js';
import filesystem from '../../lib/filesystem.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import archiver from 'archiver';

export async function exportCommand(name, options) {
  try {
    const baseDir = process.cwd();

    // Check if skill exists
    if (!(await filesystem.skillExists(name, baseDir))) {
      logger.error(`Skill "${name}" not found`);
      process.exit(1);
    }

    logger.header(`Export: ${name}`);
    console.log();

    const skillPath = filesystem.getSkillPath(name, baseDir);

    // Determine output path
    let outputPath = options.output;
    if (!outputPath) {
      outputPath = path.join(baseDir, `${name}-skill.zip`);
    } else if (!outputPath.endsWith('.zip')) {
      outputPath = path.join(outputPath, `${name}-skill.zip`);
    }

    // Ensure output directory exists
    await fsPromises.mkdir(path.dirname(outputPath), { recursive: true });

    // Create zip archive
    const spin = logger.spinner('Creating archive...');
    spin.start();

    await createZipArchive(skillPath, outputPath, name);

    spin.succeed('Archive created');

    // Get file size
    const stats = await fsPromises.stat(outputPath);
    const sizeKb = Math.round(stats.size / 1024);

    // Show result
    console.log();
    logger.success(`Exported: ${outputPath}`);
    logger.keyValue('Size', `${sizeKb} KB`);

    // Show contents
    console.log();
    logger.subheader('Contents');
    const contents = await listSkillContents(skillPath);
    contents.forEach((item) => {
      console.log(chalk.gray(`  ${item}`));
    });

    // Show sharing info
    console.log();
    console.log(chalk.gray('Share this skill:'));
    console.log(chalk.gray('  1. Upload to GitHub and use: skill import <url>'));
    console.log(chalk.gray('  2. Share the zip file directly'));

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

// Create zip archive of skill directory
async function createZipArchive(sourcePath, outputPath, skillName) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(sourcePath, skillName);
    archive.finalize();
  });
}

// List skill directory contents
async function listSkillContents(skillPath) {
  const contents = [];

  async function scan(dir, prefix = '') {
    try {
      const entries = await fsPromises.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          contents.push(`${relativePath}/`);
          await scan(path.join(dir, entry.name), relativePath);
        } else {
          contents.push(relativePath);
        }
      }
    } catch {
      // Directory doesn't exist or can't be read
    }
  }

  await scan(skillPath);
  return contents;
}

export default exportCommand;
