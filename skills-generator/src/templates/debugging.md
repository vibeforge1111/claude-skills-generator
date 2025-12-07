---
name: {{name}}
description: {{description}}
version: 1.0.0
author: {{author}}
mcps:
  required:
    - filesystem
  optional:
    - browser-tools
triggers:
  - "when debugging {{topic}}"
  - "when investigating errors"
  - "when troubleshooting issues"
tags:
  - debugging
  - troubleshooting
---

# {{name}}

## Purpose

A systematic debugging skill for {{topic}}. Helps identify, diagnose, and fix issues methodically.

## When to Use

Use this skill when:
- User encounters errors or unexpected behavior
- Something isn't working as expected
- Need to trace the root cause of an issue
- Debugging {{topic}}-related problems

## Instructions

### Phase 1: Gather Information

1. **Reproduce the issue**
   - Get exact steps to reproduce
   - Note the expected vs actual behavior
   - Capture any error messages

2. **Check the obvious first**
   - Verify configuration is correct
   - Check for typos or syntax errors
   - Ensure dependencies are installed

### Phase 2: Systematic Investigation

1. **Isolate the problem**
   - Narrow down which component is failing
   - Create minimal reproduction if possible
   - Check if issue is consistent or intermittent

2. **Trace the data flow**
   - Follow the code path from input to error
   - Check variable values at each step
   - Look for where expected behavior diverges

3. **Check common culprits**
   - Race conditions / timing issues
   - Null/undefined values
   - Type mismatches
   - Missing error handling

### Phase 3: Fix and Verify

1. **Implement the fix**
   - Make the minimal change needed
   - Don't fix unrelated issues simultaneously

2. **Verify the fix**
   - Confirm the original issue is resolved
   - Check for regressions
   - Test edge cases

3. **Document the solution**
   - Note what caused the issue
   - Explain why the fix works
   - Consider if similar issues could exist elsewhere

## Examples

### Example 1: Error Message Investigation
**User:** "I'm getting an error: {{exampleError}}"

**Expected behavior:**
1. Ask for full error message and stack trace
2. Identify the error type and location
3. Check the code at that location
4. Trace backwards to find root cause
5. Propose fix with explanation

### Example 2: Silent Failure
**User:** "The feature isn't working but there's no error"

**Expected behavior:**
1. Add logging to trace execution
2. Verify data at each step
3. Find where expected behavior stops
4. Identify the cause of silent failure

## Error Handling

| Symptom | Common Causes | Investigation Steps |
|---------|---------------|---------------------|
| Crashes on startup | Missing config, bad dependencies | Check logs, verify environment |
| Silent failures | Swallowed exceptions, async issues | Add logging, check promise chains |
| Intermittent issues | Race conditions, external dependencies | Check timing, isolate components |
| Works locally, fails in prod | Environment differences | Compare configs, check for hardcoded values |

## Debugging Checklist

- [ ] Can I reproduce the issue consistently?
- [ ] Do I have the full error message/stack trace?
- [ ] Have I checked the logs?
- [ ] Is the configuration correct?
- [ ] Are all dependencies installed and correct versions?
- [ ] Have I isolated which component is failing?
- [ ] Did I check for recent changes that could cause this?

## References

- [Error documentation]({{errorDocsUrl}})
- [Debugging guide]({{debuggingGuideUrl}})
