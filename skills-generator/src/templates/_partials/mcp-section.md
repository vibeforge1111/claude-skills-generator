## MCP Server Requirements

### Required MCPs
These MCP servers must be installed for this skill to work:

{{#each requiredMcps}}
- **{{name}}**: {{description}}
  ```json
  {
    "{{name}}": {
      "command": "{{command}}",
      "args": {{args}}
    }
  }
  ```
{{/each}}

### Optional MCPs
These MCP servers enhance the skill but aren't required:

{{#each optionalMcps}}
- **{{name}}**: {{description}}
{{/each}}

### Installation
Add the required MCPs to your Claude Code configuration:

```json
{
  "mcpServers": {
    // Add required MCP configs here
  }
}
```
