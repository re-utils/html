# A JSX renderer

Add these stuff to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@re-utils/html"
  }
}
```

Then you can write JSX in your file:
```tsx
const html: string = <p>Hi</p>;
```

And to escape HTML strings:
```tsx
import { escapeHTML } from "@re-utils/html";

const html: string = <div>{escapeHTML(htmlString)}</div>;
```
