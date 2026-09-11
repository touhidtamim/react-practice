```
/*
  React Revision — Effects & Data Fetching

  Focus:
  - useEffect
  - Dependency array
  - Cleanup
  - Stale closures
  - Infinite loops
  - Fetching data
  - Loading / error / success / empty
  - AbortController
  - Race conditions
  - Server state awareness
*/


// ============================================================
// 1. WHAT IS useEffect?
// ============================================================

// useEffect is used to synchronize a component with an
// external system.
//
// Examples:
// - API requests
// - subscriptions
// - timers
// - browser APIs
// - event listeners

function EffectExample() {
  useEffect(() => {
    console.log("Effect ran");
  });

  return <p>Effect example</p>;
}

// Without dependency array:
// runs after every render.


// ============================================================
// 2. EMPTY DEPENDENCY ARRAY
// ============================================================

function MountEffect() {
  useEffect(() => {
    console.log("Component rendered");

    // Cleanup runs when the component unmounts.
    return () => {
      console.log("Cleanup");
    };
  }, []);

  return <p>Mounted component</p>;
}

// [] means:
// Run after initial render and cleanup on unmount.
//
// Note:
// In development StrictMode, React may run setup/cleanup
// more than once to help detect problems.


// ============================================================
// 3. DEPENDENCIES
// ============================================================

function UserEffect({ userId }) {
  useEffect(() => {
    console.log("User changed:", userId);
  }, [userId]);

  return <p>User: {userId}</p>;
}

// Effect runs when userId changes.


// ============================================================
// 4. CLEANUP
// ============================================================

// Cleanup prevents subscriptions/listeners/timers from
// continuing after they are no longer needed.

function TimerExample() {
  useEffect(() => {
    const timerId = setInterval(() => {
      console.log("Tick");
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return <p>Timer running</p>;
}


// ============================================================
// 5. EVENT LISTENER + CLEANUP
// ============================================================

function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <p>Width: {width}px</p>;
}

// Important:
// Add listener -> remove same listener in cleanup.


// ============================================================
// 6. FETCHING DATA
// ============================================================

function UserData({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/users/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data);
      } catch (requestError) {
        setError(requestError);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return <p>{user.name}</p>;
}


// ============================================================
// 7. ABORTCONTROLLER
// ============================================================

// Abort a request when the component unmounts or the
// dependency changes.

function AbortableFetch({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        const response = await fetch(
          `/api/users/${userId}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await response.json();
        setUser(data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          console.error(requestError);
        }
      }
    }

    loadUser();

    return () => {
      controller.abort();
    };
  }, [userId]);

  return <p>{user ? user.name : "Loading..."}</p>;
}

// Useful when requests become outdated.


/* ============================================================
   8. RACE CONDITION
   ============================================================ */

// Example:
//
// User ID = 1 -> request A starts
// User ID = 2 -> request B starts
// Request B finishes first
// Request A finishes later
//
// Old response from A could overwrite the newer data from B.
//
// AbortController can help cancel the outdated request.


// ============================================================
// 9. COMMON INFINITE LOOP
// ============================================================

// Bad:
//
// function BadEffect() {
//   const [count, setCount] = useState(0);
//
//   useEffect(() => {
//     setCount(count + 1);
//   }, [count]);
//
//   return <p>{count}</p>;
// }

// Why?
// Effect changes count -> render -> effect runs again -> ...

// Effects should not be used to blindly mirror derived values.


// ============================================================
// 10. DERIVED DATA DOES NOT NEED useEffect
// ============================================================

// Avoid:
//
// const [fullName, setFullName] = useState("");
//
// useEffect(() => {
//   setFullName(`${firstName} ${lastName}`);
// }, [firstName, lastName]);

// Prefer:

function FullName({ firstName, lastName }) {
  const fullName = `${firstName} ${lastName}`;

  return <p>{fullName}</p>;
}

// If something can be calculated during rendering,
// usually don't store it as separate state.


// ============================================================
// 11. STALE CLOSURE
// ============================================================

// An effect/callback can capture an older value from its render.

function CurrentUser({ name }) {
  useEffect(() => {
    console.log("Current name:", name);
  }, [name]);

  return <p>{name}</p>;
}

// Keep reactive values used by an effect in its dependency list.
// React's linter can help detect missing dependencies.


// ============================================================
// 12. EFFECT DEPENDENCY MENTAL MODEL
// ============================================================

// useEffect(() => {
//   // effect
// }, [a, b]);

// Effect uses a and b.
// When a or b changes -> effect runs again.
//
// Think:
// "Synchronize this effect with these values."


// ============================================================
// 13. LOADING / ERROR / EMPTY / SUCCESS
// ============================================================

function ProductData({ products, loading, error }) {
  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Failed to load products.</p>;
  }

  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// Standard async UI states:
// 1. Loading
// 2. Error
// 3. Empty
// 4. Success


// ============================================================
// 14. SHOULD EVERYTHING USE useEffect?
// ============================================================

// No.
//
// Don't use useEffect just because something happens after
// a user interaction.
//
// Example:
// Button click -> submit form
//
// Better:
// onClick / onSubmit handler
//
// Effects are mainly for synchronization with external systems.


// ============================================================
// 15. SERVER STATE
// ============================================================

// API data is often called "server state".
//
// It may need:
// - caching
// - refetching
// - retries
// - synchronization
// - stale data handling
// - request deduplication
//
// For larger applications, libraries such as TanStack Query
// can manage this instead of manually handling every request
// with useEffect.


// ============================================================
// QUICK RULES
// ============================================================
//
// 1. useEffect synchronizes with external systems.
// 2. Don't use effects for simple derived calculations.
// 3. Include reactive values used by the effect in dependencies.
// 4. Return cleanup when something needs to be stopped/removed.
// 5. Clear timers and remove event listeners.
// 6. Check response.ok when using fetch.
// 7. Handle loading, error, empty and success states.
// 8. Cancel outdated requests when appropriate.
// 9. Watch for stale closures.
// 10. Avoid effect -> state -> effect infinite loops.
// 11. User interactions usually belong in event handlers.
// 12. For complex server-state needs, consider TanStack Query.


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What is useEffect?
A. A hook used to synchronize a component with external systems such as
   APIs, subscriptions, timers and browser APIs.

Q2. When does useEffect run?
A. After rendering. Its dependency array determines when it runs again.

Q3. What does [] mean in useEffect?
A. The effect does not re-run because of changing reactive dependencies.
   Its cleanup runs when the component unmounts.

Q4. Why is cleanup important?
A. It prevents resources such as timers, subscriptions and event listeners
   from continuing after they are no longer needed.

Q5. Why should fetch check response.ok?
A. fetch() does not reject the promise for normal HTTP errors such as
   404 or 500. response.ok must be checked.

Q6. What is AbortController used for?
A. It can cancel an ongoing request, which is useful when a request becomes
   outdated or a component no longer needs it.

Q7. What is a stale closure?
A. A callback or effect may retain values from an older render.

Q8. How can missing dependencies cause problems?
A. An effect may use outdated values because it does not re-run when those
   values change.

Q9. Should derived values be stored using useEffect + useState?
A. Usually no. If a value can be calculated from existing props/state,
   calculate it during rendering.

Q10. What causes an effect infinite loop?
A. The effect updates state, that state changes a dependency, and the effect
   runs again repeatedly.

Q11. Should API calls always be made with useEffect?
A. Not necessarily. User-triggered actions can happen directly in event
   handlers, and server-state libraries can manage API data.

Q12. What is server state?
A. Data owned by a backend/server that the UI reads and may need to cache,
   refetch, synchronize or invalidate.
*/
```
