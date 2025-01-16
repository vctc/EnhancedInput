# Enhanced Input Component

This project is a React component featuring an enhanced input box with support for mentions, hashtags, and URL highlighting. It is styled using TailwindCSS and can be easily integrated into other projects.

## Features

- Mention system with `@` symbol triggering user suggestions.
- Real-time text processing to highlight URLs, mentions, and hashtags.
- Autoresizing textarea to accommodate text.
- Styled with TailwindCSS for modern, responsive design.

## Screenshots

![screencapture-enhancedinput-netlify-app-2025-01-16-18_05_37](https://github.com/user-attachments/assets/0636bde2-542f-44f7-9165-b482941d02ef)
![screencapture-enhancedinput-netlify-app-2025-01-16-18_06_10](https://github.com/user-attachments/assets/f2f7a86d-83a1-4f56-90d8-a6fac641bdd9)
![screencapture-enhancedinput-netlify-app-2025-01-16-18_06_37](https://github.com/user-attachments/assets/9f56e899-97dc-4ba7-840f-c2e7b14f8f20)
![image](https://github.com/user-attachments/assets/39b6d06b-58ca-4f33-9916-fea6b3f2e55e)





## Installation

1. Clone the repository:

   ```bash
   git clone <your-github-repo-url>
   cd <repository-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

## Usage

In your React project, you can import and use the `EnhancedInput` component as follows:

```jsx
import EnhancedInput from "./components/EnhancedInput";

function App() {
  return (
    <div className="app">
      <EnhancedInput maxLength={200} placeholder="Type your message..." />
    </div>
  );
}
```

## Running Tests

This project uses Vitest for testing. To run the tests, use:

```bash
npm run test
```

## Scripts

- `dev`: Start the development server.
- `build`: Build the project for production.
- `lint`: Run ESLint to lint files.
- `preview`: Preview the production build.
- `test`: Run test cases with Vitest.

## Contributing

Contributions are welcome! Feel free to open a pull request or file an issue on the repository.

## License

This project is licensed under the MIT License.

## Contact

For any questions or suggestions, please contact Victor Rajkumar at victorrajkumar1@gmail.com

````

### Testing

You mentioned using `vitest` for testing. Here’s a simple setup for writing test cases:

1. **Install Vitest** (if not already done):

   ```bash
   npm install vitest --save-dev
````

2. **Setup a Test File**:

   You can create a test file, e.g., `EnhancedInput.test.tsx`, inside a `tests` or similar directory.

3. **Run the Tests**:

   ```bash
   npm run test
   ```
