---
name: {{name}}
description: {{description}}
version: 1.0.0
author: {{author}}
mcps:
  required:
    - filesystem
  optional: []
triggers:
  - "when processing {{documentType}} documents"
  - "when analyzing {{documentType}} files"
  - "when extracting data from {{documentType}}"
tags:
  - document
  - processing
  - extraction
---

# {{name}}

## Purpose

Process and extract information from {{documentType}} documents. Handles parsing, validation, transformation, and data extraction.

## When to Use

Use this skill when:
- Processing {{documentType}} files
- Extracting structured data from documents
- Validating document format/content
- Transforming documents to other formats

## Instructions

### Step 1: Load and Validate

1. **Read the document**
   - Load file from specified path
   - Detect encoding if necessary
   - Handle file access errors gracefully

2. **Validate format**
   - Check file extension and content type
   - Verify document structure
   - Report any format issues

### Step 2: Parse and Extract

1. **Parse document structure**
   - Identify sections/elements
   - Build internal representation
   - Handle malformed content gracefully

2. **Extract requested data**
   - Follow user's extraction requirements
   - Handle missing fields appropriately
   - Preserve data types where possible

### Step 3: Transform and Output

1. **Transform data**
   - Apply any requested transformations
   - Validate output format
   - Handle edge cases

2. **Output results**
   - Format output as requested
   - Include metadata if relevant
   - Report any issues encountered

## Examples

### Example 1: Extract Data
**User:** "Extract all {{dataType}} from this {{documentType}} file"

**Expected behavior:**
1. Read and parse the document
2. Identify all {{dataType}} instances
3. Extract and structure the data
4. Return formatted results

### Example 2: Validate Document
**User:** "Check if this {{documentType}} file is valid"

**Expected behavior:**
1. Load the document
2. Check against expected schema/format
3. Report validation results
4. List any issues found

### Example 3: Transform Format
**User:** "Convert this {{documentType}} to {{outputFormat}}"

**Expected behavior:**
1. Parse source document
2. Map to target format
3. Generate output file
4. Verify conversion accuracy

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| File not found | Invalid path | Verify path, check permissions |
| Parse error | Malformed document | Report specific location, suggest fixes |
| Encoding error | Wrong encoding | Detect encoding, convert if needed |
| Missing required field | Incomplete document | Report missing fields, use defaults if appropriate |

## Supported Formats

| Format | Read | Write | Notes |
|--------|------|-------|-------|
| {{format1}} | ✓ | ✓ | {{notes1}} |
| {{format2}} | ✓ | ✓ | {{notes2}} |

## References

- [{{documentType}} specification]({{specUrl}})
- [Parsing library docs]({{libraryUrl}})
