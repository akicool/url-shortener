
## API Endpoints

- `POST /shorten`: Create a short URL
- Body: `{ "originalUrl": "https://example.com" }`
- Response: Short URL string

- `GET /{shortUrl}`: Redirect to the original URL

- `GET /info/{shortUrl}`: Get information about a short URL
- Response: `{ "originalUrl": "...", "createdAt": "...", "clickCount": 0 }`

- `DELETE /delete/{shortUrl}`: Delete a short URL
- Response: `{ "message": "URL deleted successfully" }`

## Dependencies

- express
- mongoose
- crypto
- dotenv
