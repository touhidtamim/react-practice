```
/*
  React Revision — Hooks

  Focus:
  - useState
  - useEffect
  - useRef
  - useContext
  - useReducer
  - useMemo
  - useCallback
  - Custom Hooks
  - Rules of Hooks
*/


// ============================================================
// 1. WHAT ARE HOOKS?
// ============================================================

// Hooks let function components use React features such as:
// - state
// - effects
// - refs
// - context
// - reducers

// Hooks normally start with "use":
// useState()
// useEffect()
// useRef()
// useContext()


// ============================================================
// 2. useState
// ============================================================

import {
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
  createContext,
} from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount((currentCount) => currentCount + 1);
  }

  return (
    <button onClick={increase}>
      Count: {count}
    </button>
  );
}

// Functional updater is useful when the new state depends on old state:
//
// setCount((currentCount) => currentCount + 1);


// ============================================================
// 3. useRef
// ============================================================

// useRef stores a value that persists between renders
// without causing a re-render when changed.

function FocusInput() {
  const inputRef = useRef(null);

  function handleFocus() {
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleFocus}>Focus</button>
    </div>
  );
}

// Common uses:
// - DOM element reference
// - timer ID
// - previous value
// - mutable value that should not trigger rendering


// ============================================================
// 4. useContext
// ============================================================

// Context avoids passing the same data through many component levels.

const ThemeContext = createContext("light");

function ThemeButton() {
  const theme = useContext(ThemeContext);

  return <button>Theme: {theme}</button>;
}

// Provider example:
//
// <ThemeContext value="dark">
//   <ThemeButton />
// </ThemeContext>
//
// Context is useful for shared values such as:
// - theme
// - authenticated user
// - locale
//
// Do not use Context for every piece of state.


// ============================================================
// 5. useReducer
// ============================================================

// Useful when state logic becomes more complex.

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };

    case "decrement":
      return { count: state.count - 1 };

    default:
      return state;
  }
}

function ReducerCounter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>{state.count}</p>

      <button onClick={() => dispatch({ type: "increment" })}>
        +
      </button>

      <button onClick={() => dispatch({ type: "decrement" })}>
        -
      </button>
    </div>
  );
}

// useState:
// simple/local state

// useReducer:
// complex state transitions or many related actions


// ============================================================
// 6. useMemo
// ============================================================

// useMemo caches a calculated value.

function ProductTotal({ products }) {
  const total = useMemo(() => {
    return products.reduce(
      (sum, product) => sum + product.price,
      0
    );
  }, [products]);

  return <p>Total: ${total}</p>;
}

// Important:
// useMemo is a performance optimization.
// Do not use it automatically for every calculation.


// ============================================================
// 7. useCallback
// ============================================================

// useCallback caches a function reference.

function SearchBox({ onSearch }) {
  return (
    <button onClick={() => onSearch("react")}>
      Search
    </button>
  );
}

function SearchContainer() {
  const [query, setQuery] = useState("");

  const handleSearch = useCallback((value) => {
    setQuery(value);
  }, []);

  return <SearchBox onSearch={handleSearch} />;
}

// Mainly useful when:
// - passing callbacks to memoized children
// - function identity matters

// Do not wrap every function with useCallback by default.


// ============================================================
// 8. useMemo vs useCallback
// ============================================================

// useMemo -> caches a VALUE
//
// const total = useMemo(() => calculate(), [items]);

// useCallback -> caches a FUNCTION
//
// const handleClick = useCallback(() => {}, []);


// ============================================================
// 9. CUSTOM HOOKS
// ============================================================

// Custom hooks extract reusable stateful logic.

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  function toggle() {
    setValue((currentValue) => !currentValue);
  }

  return [value, toggle];
}

function ToggleExample() {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <button onClick={toggleOpen}>
      {isOpen ? "Open" : "Closed"}
    </button>
  );
}

// Custom hook naming should start with "use".


// ============================================================
// 10. CUSTOM HOOK WITH LOGIC
// ============================================================

function useInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  function handleChange(event) {
    setValue(event.target.value);
  }

  return {
    value,
    onChange: handleChange,
  };
}

function InputExample() {
  const username = useInput("");

  return (
    <input
      type="text"
      placeholder="Username"
      {...username}
    />
  );
}


// ============================================================
// 11. RULES OF HOOKS
// ============================================================

// Rule 1:
// Call hooks only at the top level.

// Good:
function GoodComponent() {
  const [value, setValue] = useState(0);

  return <button onClick={() => setValue(value + 1)}>{value}</button>;
}

// Bad:
//
// if (condition) {
//   const [value, setValue] = useState(0);
// }


// Rule 2:
// Do not call hooks inside loops or nested functions.
//
// Bad:
//
// for (...) {
//   useState(...);
// }


// Rule 3:
// Hooks can be called from:
// - React function components
// - custom hooks


// ============================================================
// 12. HOOK SELECTION
// ============================================================
//
// Need local state?
// -> useState
//
// Complex state transitions?
// -> useReducer
//
// Need side effect?
// -> useEffect
//
// Need DOM/mutable value?
// -> useRef
//
// Need shared context value?
// -> useContext
//
// Expensive calculation?
// -> useMemo
//
// Stable callback reference?
// -> useCallback
//
// Reusable stateful logic?
// -> Custom Hook


// ============================================================
// 13. IMPORTANT MENTAL MODEL
// ============================================================

// Hooks are not "methods of a component".

// React associates hook calls with their position/order.
// That's why hooks must be called consistently.

// Therefore:
//
// Good:
// const [name, setName] = useState("");
// const [age, setAge] = useState(20);
//
// Bad:
//
// if (isLoggedIn) {
//   const [name, setName] = useState("");
// }


// ============================================================
// QUICK RULES
// ============================================================
//
// 1. Hooks are mainly used inside function components.
// 2. Hooks must be called at the top level.
// 3. Never call hooks conditionally.
// 4. useState -> simple state.
// 5. useReducer -> complex state logic.
// 6. useRef -> persistent mutable value / DOM reference.
// 7. useContext -> consume context.
// 8. useMemo -> memoized calculated value.
// 9. useCallback -> memoized function reference.
// 10. Custom hooks -> reuse stateful logic.
// 11. Don't use useMemo/useCallback everywhere.
// 12. Keep state as simple as possible.


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What are React Hooks?
A. Functions that let function components use React features such as
   state, effects, refs and context.

Q2. Why can't hooks be called conditionally?
A. React relies on the consistent order of hook calls between renders.

Q3. Where can hooks be called?
A. At the top level of React function components or custom hooks.

Q4. useState vs useReducer?
A. useState is usually simpler. useReducer is useful for complex state
   transitions involving multiple related actions.

Q5. What is useRef used for?
A. DOM references and persistent mutable values that do not need to
   trigger a re-render.

Q6. Does changing ref.current cause a re-render?
A. No.

Q7. What is useContext?
A. It reads a value from React Context without manually passing props
   through every intermediate component.

Q8. What does useMemo return?
A. A memoized calculated value.

Q9. What does useCallback return?
A. A memoized function reference.

Q10. useMemo vs useCallback?
A. useMemo caches a value; useCallback caches a function.

Q11. Should useMemo and useCallback always be used?
A. No. They are optimization tools and should be used when they provide
   a real benefit.

Q12. What is a custom hook?
A. A function starting with "use" that contains reusable hook-based logic.

Q13. Can a custom hook have state?
A. Yes. A custom hook can use other hooks such as useState or useEffect.

Q14. What is the main purpose of custom hooks?
A. Reuse stateful logic between components without duplicating that logic.
*/
```;
