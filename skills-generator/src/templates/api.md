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
  - "when working with {{apiName}} API"
  - "when integrating {{apiName}}"
  - "when making requests to {{apiName}}"
tags:
  - api
  - integration
  - {{apiName}}
---

# {{name}}

## Purpose

Integrate with the {{apiName}} API. Handles authentication, request formatting, error handling, and response parsing.

## When to Use

Use this skill when:
- Making requests to {{apiName}} API
- Setting up {{apiName}} integration
- Debugging {{apiName}} API issues
- Working with {{apiName}} data

## Configuration

### Required Environment Variables
```
{{API_KEY_VAR}}=your-api-key
{{API_URL_VAR}}={{apiBaseUrl}}
```

### Authentication
{{authMethod}} authentication is used:
{{authInstructions}}

## Instructions

### Making Requests

1. **Prepare the request**
   - Set required headers (Authorization, Content-Type)
   - Format request body according to API spec
   - Include any required query parameters

2. **Send the request**
   - Use appropriate HTTP method
   - Handle timeouts appropriately
   - Log request for debugging

3. **Handle the response**
   - Check status code
   - Parse response body
   - Handle errors appropriately

### Common Operations

#### {{operation1}}
```javascript
// {{operation1Description}}
const response = await fetch('{{endpoint1}}', {
  method: '{{method1}}',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({{requestBody1}})
});
```

#### {{operation2}}
```javascript
// {{operation2Description}}
const response = await fetch('{{endpoint2}}', {
  method: '{{method2}}',
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
});
```

## Examples

### Example 1: Basic API Call
**User:** "Fetch {{resource}} from {{apiName}}"

**Expected behavior:**
1. Construct the API request
2. Include proper authentication
3. Make the request
4. Parse and return the response

### Example 2: Error Handling
**User:** "The {{apiName}} API is returning an error"

**Expected behavior:**
1. Check the error response
2. Identify the error type
3. Suggest fix based on error code
4. Retry if appropriate

## Error Handling

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Verify API key |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify endpoint/resource |
| 429 | Rate Limited | Wait and retry |
| 500+ | Server Error | Retry with backoff |

### Rate Limiting
- Rate limit: {{rateLimit}}
- Implement exponential backoff on 429
- Cache responses when appropriate

### Retry Logic
```javascript
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.status === 429) {
        await sleep(Math.pow(2, i) * 1000);
      }
    }
  }
}
```

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| {{endpoint1}} | {{method1}} | {{desc1}} |
| {{endpoint2}} | {{method2}} | {{desc2}} |

## References

- [{{apiName}} API Documentation]({{apiDocsUrl}})
- [Authentication Guide]({{authDocsUrl}})
- [Error Codes Reference]({{errorDocsUrl}})
