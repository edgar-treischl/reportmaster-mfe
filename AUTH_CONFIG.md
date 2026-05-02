# Authentication Configuration

This application includes an authentication system that can be toggled for development purposes.

## Configuration

Authentication is controlled via `src/config.ts`:

```typescript
export const config: AppConfig = {
  // Set to false to disable authentication for development
  AUTH_ENABLED: true,
  
  // API configuration (update when backend is ready)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // Development API key (used when AUTH_ENABLED is false)
  DEV_API_KEY: 'dev-key-12345',
};
```

## Disabling Authentication for Development

To disable authentication during development:

1. Open `src/config.ts`
2. Set `AUTH_ENABLED: false`
3. Save the file
4. The app will automatically use the `DEV_API_KEY` and skip the login page

## Enabling Authentication

To enable authentication (production mode):

1. Open `src/config.ts`
2. Set `AUTH_ENABLED: true`
3. Save the file
4. Users will be required to enter an API key on the login page

## How Authentication Works

### When Enabled (`AUTH_ENABLED: true`)
- Users see a login page on first visit
- They must enter a valid API key
- The API key is stored in `localStorage`
- The key is sent with all API requests (TODO: implement when backend is ready)
- Users can logout to clear their stored key

### When Disabled (`AUTH_ENABLED: false`)
- No login page is shown
- The `DEV_API_KEY` is automatically used for all requests
- Perfect for local development and testing

## API Key Storage

- API keys are stored in browser `localStorage`
- Key: `apiKey`
- Users remain authenticated across browser sessions
- Logout clears the stored key

## Backend Integration (TODO)

When connecting to the backend API, update the following in your API calls:

```typescript
import { getApiKey } from './config'

// Example API call
const response = await fetch('/api/load-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getApiKey()}`, // Include API key
  },
  body: JSON.stringify(formData),
})
```

## Environment Variables

You can override the API base URL using environment variables:

```bash
# .env.local
VITE_API_BASE_URL=https://your-api-server.com
```

## Security Notes

1. **Never commit real API keys to version control**
2. The `DEV_API_KEY` in config.ts is for development only
3. In production, users should provide their own keys
4. Consider implementing key validation on the backend
5. Use HTTPS in production to protect API keys in transit
