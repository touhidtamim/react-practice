/*
  React Revision — Advanced & Modern React

  Focus:
  - Performance
  - React.memo
  - useMemo / useCallback
  - lazy + Suspense
  - Error Boundaries
  - Portals
  - Imperative refs
  - Modern Actions
  - useActionState
  - useFormStatus
  - useOptimistic
  - use
  - ref as prop
  - Server Components awareness
  - React Compiler
*/


// ============================================================
// 1. PERFORMANCE MENTAL MODEL
// ============================================================

// First make the component correct and simple.
//
// Then optimize only when there is a real performance problem.
//
// Common tools:
// - React.memo
// - useMemo
// - useCallback
// - lazy
// - Suspense
// - React Compiler
//
// Don't optimize everything by default.


// ============================================================
// 2. React.memo
// ============================================================

import {
  lazy,
  memo,
  Suspense,
  use,
  useActionState,
  useOptimistic,
  useRef,
  useState,
} from "react";

const UserCard = memo(function UserCard({ name }) {
  return <p>User: {name}</p>;
});

function UserPage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((value) => value + 1)}>
        Count: {count}
      </button>

      <UserCard name="Rahim" />
    </div>
  );
}

// memo can skip re-rendering when props have not changed.
//
// It is a performance optimization, not a correctness tool.


// ============================================================
// 3. useMemo
// ============================================================

function ExpensiveList({ items }) {
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.active);
  }, [items]);

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// Use when a calculation is actually expensive or when stable
// identity is useful.
//
// Don't use useMemo for every small calculation.


// ============================================================
// 4. useCallback
// ============================================================

function ActionButton({ onAction }) {
  return <button onClick={onAction}>Run</button>;
}

function ActionPage() {
  const [count, setCount] = useState(0);

  const handleAction = () => {
    setCount((value) => value + 1);
  };

  return (
    <div>
      <ActionButton onAction={handleAction} />
      <p>{count}</p>
    </div>
  );
}

// With React Compiler, manual memoization is often less necessary.
// Still understand useCallback because existing codebases use it.


// ============================================================
// 5. REACT COMPILER
// ============================================================

// React Compiler is a build-time optimization tool.
//
// It can automatically optimize components and values,
// reducing the need for manual memoization.
//
// Practical rule:
//
// Write correct, pure React code first.
// Let the compiler handle many optimizations when enabled.
//
// Don't write code that depends on memoization for correctness.


// ============================================================
// 6. LAZY LOADING
// ============================================================

const SettingsPage = lazy(() => import("./SettingsPage"));

function AppSettings() {
  return (
    <Suspense fallback={<p>Loading settings...</p>}>
      <SettingsPage />
    </Suspense>
  );
}

// lazy() loads component code when it is first rendered.
//
// Useful for:
// - large pages
// - rarely used features
// - route-level code splitting


// ============================================================
// 7. Suspense
// ============================================================

// Suspense shows fallback UI while supported content is waiting.
//
// <Suspense fallback={<Loading />}>
//   <SomeContent />
// </Suspense>
//
// Common uses:
// - lazy-loaded components
// - Suspense-enabled data
// - reading Promises with use()
// - streaming/server rendering


// ============================================================
// 8. ERROR BOUNDARIES
// ============================================================

// Error Boundaries show fallback UI when a part of the component
// tree throws a rendering error.
//
// Concept:
//
// <ErrorBoundary>
//   <Dashboard />
// </ErrorBoundary>
//
// Important:
// Error boundaries are different from try/catch around event handlers.
//
// Use an Error Boundary for UI rendering failures.


// ============================================================
// 9. PORTALS
// ============================================================

// Portals render UI into another DOM node.
//
// Common use:
// - modal
// - tooltip
// - dropdown
//
// Example:
//
// import { createPortal } from "react-dom";
//
// function Modal({ children }) {
//   return createPortal(
//     <div className="modal">{children}</div>,
//     document.body
//   );
// }
//
// The portal changes the DOM location,
// but React's component/event tree relationship is preserved.


// ============================================================
// 10. IMPERATIVE REF
// ============================================================

// Prefer props for normal component behavior.
//
// Use refs when you genuinely need imperative behavior:
// - focus
// - scroll
// - select text
// - trigger a DOM action

function InputWithRef({ ref }) {
  return <input ref={ref} />;
}

function RefExample() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current.focus();
  }

  return (
    <div>
      <InputWithRef ref={inputRef} />

      <button onClick={focusInput}>
        Focus
      </button>
    </div>
  );
}

// In modern React, ref can be received as a prop.
// Older code may use forwardRef.


// ============================================================
// 11. useActionState
// ============================================================

// useActionState helps manage state produced by an Action.
//
// Useful for:
// - form submissions
// - async mutations
// - pending state
// - server actions/functions

async function updateProfileAction(previousState, formData) {
  const name = formData.get("name");

  if (!name) {
    return {
      success: false,
      message: "Name is required",
    };
  }

  return {
    success: true,
    message: `Saved ${name}`,
    previousState,
  };
}

function ProfileForm() {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    {
      success: false,
      message: "",
    }
  );

  return (
    <form action={formAction}>
      <input name="name" />

      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>

      <p>{state.message}</p>
    </form>
  );
}


// ============================================================
// 12. useFormStatus
// ============================================================

// useFormStatus comes from react-dom.
//
// It gives a child component information about its parent form.
//
// Example:
//
// import { useFormStatus } from "react-dom";
//
// function SubmitButton() {
//   const { pending } = useFormStatus();
//
//   return (
//     <button type="submit" disabled={pending}>
//       {pending ? "Submitting..." : "Submit"}
//     </button>
//   );
// }
//
// Important:
// useFormStatus must be called from a component rendered
// inside the form it tracks.


// ============================================================
// 13. useOptimistic
// ============================================================

// Shows the expected UI result immediately while an Action
// is still running.
//
// Example concept:
//
// const [optimisticName, setOptimisticName] = useOptimistic(name);
//
// During an Action:
//
// setOptimisticName("New name");
//
// UI shows "New name" immediately.
// If the operation fails, the UI can return to the real state.
//
// Useful for:
// - likes
// - comments
// - cart updates
// - follow/unfollow
// - quick mutations


// ============================================================
// 14. use
// ============================================================

// use() can read a resource such as a Promise or Context.
//
// Example:
//
// function Message({ messagePromise }) {
//   const message = use(messagePromise);
//
//   return <p>{message}</p>;
// }
//
// Promise-based use() works with Suspense.
//
// Unlike normal Hooks, use() can be called inside conditions
// and loops, but it must still be called from a component or Hook.
//
// Do not put use(promise) inside try/catch.
// Use an Error Boundary for rejected Promise errors.


// ============================================================
// 15. SERVER COMPONENTS — AWARENESS
// ============================================================

// Server Components render on the server and can reduce the amount
// of JavaScript sent to the browser.
//
// Client Components are needed for browser-side interactivity.
//
// Think:
//
// Server Component
//      ↓
// Client Component
//
// The exact setup depends on the framework/environment.
//
// Important concept:
// "Server Component" is not the same thing as "SSR".


// ============================================================
// 16. SERVER FUNCTIONS / ACTIONS — AWARENESS
// ============================================================

// Modern React supports Actions that can integrate with forms,
// async mutations and server-side functions.
//
// Frameworks provide the actual server implementation.
//
// You should understand:
// - form actions
// - pending state
// - optimistic updates
// - server/client boundary
//
// Don't memorize framework-specific implementation details here.


// ============================================================
// 17. PURE COMPONENTS
// ============================================================

// React components should behave like pure functions:
//
// Same props/state/context
//        ↓
// Same UI result
//
// Avoid side effects during rendering.
//
// Bad:
//
// function BadComponent() {
//   localStorage.setItem("theme", "dark");
//   return <p>Hello</p>;
// }
//
// Side effects belong in:
// - event handlers
// - effects
// - appropriate external/server mechanisms


// ============================================================
// 18. RENDERING vs EVENT HANDLERS
// ============================================================

// Rendering:
// Describe what the UI should look like.
//
// Event handler:
// Respond to something the user did.
//
// Example:
//
// function SaveButton({ save }) {
//   function handleClick() {
//     save();
//   }
//
//   return <button onClick={handleClick}>Save</button>;
// }
//
// Don't perform user-triggered actions simply because a component
// rendered.


// ============================================================
// 19. COMMON PERFORMANCE MISTAKES
// ============================================================
//
// 1. Memoizing everything.
// 2. Using useMemo for tiny calculations.
// 3. Using useCallback everywhere.
// 4. Keeping too much state globally.
// 5. Unnecessary effects that update state.
// 6. Rendering huge lists without considering virtualization.
// 7. Sending unnecessary JavaScript to the browser.
// 8. Creating unstable props when memoization actually matters.
//
// First measure.
// Then optimize.


/* ============================================================
   20. MODERN REACT — QUICK MAP
   ============================================================
//
// Performance
// -> React Compiler
// -> memo
// -> useMemo
// -> useCallback
//
// Code splitting
// -> lazy
// -> Suspense
//
// Forms / Actions
// -> useActionState
// -> useFormStatus
// -> useOptimistic
//
// Async resources
// -> use
// -> Suspense
// -> Error Boundary
//
// DOM / imperative behavior
// -> ref prop
// -> useRef
// -> useImperativeHandle
//
// UI outside normal DOM hierarchy
// -> Portal
//
// Server architecture
// -> Server Components
// -> Client Components
// -> Server Functions / Actions
*/


// ============================================================
// QUICK RULES
// ============================================================
//
// 1. Optimize only when needed.
// 2. Keep rendering pure.
// 3. React.memo is a performance optimization.
// 4. useMemo caches a calculated value.
// 5. useCallback caches a function reference.
// 6. React Compiler can automate many memoization optimizations.
// 7. lazy + Suspense enables component code splitting.
// 8. Error Boundaries handle rendering errors in a subtree.
// 9. Portals are useful for modals and overlays.
// 10. Prefer props over imperative refs when possible.
// 11. useActionState is useful for Action/form state.
// 12. useFormStatus reads the status of a parent form.
// 13. useOptimistic gives temporary optimistic UI.
// 14. use() can read Promises or Context.
// 15. Server Components and Client Components have different roles.
// 16. Don't confuse SSR with Server Components.
// 17. Measure performance before optimizing.


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What is React.memo?
A. A performance optimization that can skip re-rendering a component when
   its props have not changed.

Q2. useMemo vs React.memo?
A. useMemo memoizes a calculated value. React.memo memoizes a component's
   rendered result based on props.

Q3. What is useCallback?
A. It provides a cached function reference when dependencies have not changed.

Q4. Should useMemo/useCallback be used everywhere?
A. No. They add complexity and should be used when there is a real benefit.

Q5. What is React Compiler?
A. A build-time tool that can automatically optimize React code and reduce
   the need for manual memoization.

Q6. What does lazy() do?
A. It defers loading a component's code until that component is rendered.

Q7. What is Suspense?
A. It provides a fallback UI while supported content is waiting to become
   ready.

Q8. What is an Error Boundary?
A. A component boundary that can display fallback UI when rendering errors
   occur in its child tree.

Q9. What is a Portal?
A. It renders React content into a different DOM location while keeping it
   connected to the React tree.

Q10. When should refs be used?
A. For imperative operations such as focusing, scrolling or interacting
    directly with a DOM node.

Q11. What is useActionState?
A. A Hook for managing state produced by an Action, including async form or
   mutation results and pending state.

Q12. What is useFormStatus?
A. A React DOM Hook that gives a component information about the submission
   status of its parent form.

Q13. What is optimistic UI?
A. Showing the expected result immediately before the server operation
   finishes, then reconciling with the real result.

Q14. What does useOptimistic do?
A. It provides temporary optimistic state during an Action.

Q15. What is the use() API?
A. It can read resources such as Promises or Context during rendering.

Q16. Is use() exactly the same as a normal Hook?
A. No. Despite its name, use() is a React API and can be used inside
   conditions and loops, unlike normal Hooks.

Q17. What are Server Components?
A. Components that render on the server and can reduce the amount of
   client-side JavaScript. They are different from simply doing SSR.

Q18. What is the role of Client Components?
A. They are used where client-side interactivity and browser APIs are needed.

Q19. What is the most important performance rule?
A. Keep components correct and simple first. Measure real bottlenecks,
   then optimize.

Q20. Why shouldn't rendering contain side effects?
A. React may render components multiple times or abandon a render. Rendering
   should remain pure and predictable.
*/

