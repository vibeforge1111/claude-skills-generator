# Claude Skills Generator

Generate production-ready Claude Skills from natural language.

A [Vibeship](https://vibeship.co) open source project.

---

## What it does

Describe what you want a Claude Skill to do → get a complete, production-ready skill folder with `SKILL.md`, validation, and any supporting files.

**State of the art features:**
- **AI-assisted creation** — Claude helps write your skill, not just templates
- **Multi-layer validation** — Schema, quality scoring, AI review, and live testing
- **YouTube training** — Enrich skills with knowledge from video tutorials
- **Context-aware** — Scans your project and suggests relevant skills
- **MCP integration** — Auto-generates MCP server configs for your skills

---

## Quick start

```bash
npm install -g claude-skills-generator

# Create your first skill
skill new
```

---

## Usage

```bash
# Create a new skill with AI assistance
skill new my-skill

# Validate an existing skill
skill validate my-skill

# Test a skill in the playground
skill test my-skill

# Train a skill with YouTube content
skill train my-skill --youtube https://youtube.com/watch?v=...
```

---

## Examples

**Input:**
```
? Skill name: seo-blog-writer
? Description: Generates SEO-optimized blog posts from a topic and target keywords
? Template: [content-creation]
```

**Output:**
```
seo-blog-writer/
├── SKILL.md              # Complete skill with instructions, examples, error handling
├── resources/
│   └── examples/         # Sample inputs/outputs
└── mcp-config.json       # Required MCP servers (filesystem, web-search)
```

**Generated SKILL.md:**
```yaml
---
name: seo-blog-writer
description: Generates SEO-optimized blog posts from a topic and target keywords
version: 1.0.0
mcps:
  required: [filesystem]
  optional: [web-search]
triggers:
  - "write a blog post about"
  - "create SEO content for"
---

# SEO Blog Writer

## Purpose
Generate well-structured, SEO-optimized blog posts...

## Instructions
1. Analyze the target keywords...
2. Research the topic...
3. Structure the content with proper headings...

## Examples
[Detailed examples with expected outputs]

## Error Handling
[Common issues and how to resolve them]
```

---

## Commands

| Command | Description |
|---------|-------------|
| `skill new [name]` | Create a new skill with AI assistance |
| `skill edit <name>` | Edit skill with live preview |
| `skill validate <name>` | Run multi-layer validation |
| `skill test <name>` | Test in playground sandbox |
| `skill improve <name>` | Get AI-powered improvement suggestions |
| `skill suggest` | Scan project and recommend skills |
| `skill train <name> --youtube <url>` | Enrich with YouTube content |
| `skill list` | Show all installed skills |
| `skill import <url>` | Import from GitHub |
| `skill export <name>` | Package for sharing |
| `skill mcps <name>` | Show/configure MCP requirements |

---

## How it works

1. **Templates + AI** — Starts with battle-tested templates, then Claude customizes based on your description and project context
2. **Validation pipeline** — Schema validation → Quality scoring → AI review → Live playground testing
3. **Progressive enhancement** — Train skills with YouTube transcripts, improve based on test results, iterate until production-ready

---

## Requirements

- Node.js 18+
- Anthropic API key (for AI features)

---

## Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Areas we'd love help with:**
- New skill templates
- Additional training sources (docs, podcasts)
- MCP server integrations
- Validation rules

---

## License

MIT

---

<p align="center">
  <i>You vibe. It ships.</i>
</p>
