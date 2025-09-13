# Shared Store Implementation

This implementation combines `electron-shared-state` with localStorage persistence to provide:

- ✅ **Real-time synchronization** between main and renderer processes
- ✅ **Persistent storage** that survives app restarts (via localStorage)
- ✅ **TypeScript type safety** with your existing types
- ✅ **Synchronous access** in React components
- ✅ **React hooks** for easy component integration

## Usage

### 1. Basic Store Access

```tsx
import { useAppStore } from "src/shared/hooks";

function MyComponent() {
  const { state, setPoeSessionId, setAutoWhisper } = useAppStore();

  return (
    <div>
      <p>Session ID: {state.poeSessionid}</p>
      <button onClick={() => setPoeSessionId("new-id")}>Update Session</button>
    </div>
  );
}
```

### 2. Individual Data Hooks

```tsx
import {
  useLiveSearches,
  usePoeSessionId,
  useAutoWhisper,
} from "src/shared/hooks";

function LiveSearchesComponent() {
  const { liveSearches, addLiveSearch, updateLiveSearch, deleteLiveSearch } =
    useLiveSearches();
  const [sessionId, setSessionId] = usePoeSessionId();
  const [autoTeleport, setAutoWhisper] = useAutoWhisper();

  // Your component logic...
}
```

### 3. Synchronous Access (for event handlers)

```tsx
import { useAppStoreSync } from "src/shared/hooks";

function EventHandlerComponent() {
  const { getState, addResult } = useAppStoreSync();

  const handleSomeEvent = () => {
    const currentState = getState(); // Synchronous access
    addResult(newResult); // Update store
  };
}
```

## Migration from localStorage

To migrate your existing localStorage-based search configs:

1. Import the migration function:

```tsx
import { migrateLiveSearches } from "src/renderer/live-search/hooks/liveSearchManagerNew";
```

2. Call it during app initialization:

```tsx
// In your main App component or index.tsx
useEffect(() => {
  migrateLiveSearches();
}, []);
```

3. Replace your existing search config manager imports:

```tsx
// Old
import { getLiveSearches, addLiveSearch } from "./liveSearchManager";

// New
import { getLiveSearches, addLiveSearch } from "./liveSearchManagerNew";
```

## Data Structure

The store contains:

```typescript
interface AppState {
  poeSessionid: string; // POE session ID
  liveSearches: LiveSearch[]; // Array of live search configurations
  results: TransformedItemData[]; // Array of search results
  autoTeleport: boolean; // Auto-whisper setting
}
```

## Persistence

- Data is automatically saved to localStorage when changed
- Data is loaded from localStorage on app startup
- Changes are synchronized between main and renderer processes in real-time
- Data survives app restarts

## Example Component

See `src/renderer/examples/StoreExample.tsx` for a complete working example.
