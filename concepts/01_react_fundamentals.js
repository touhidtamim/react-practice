```
/*
============================================================
01. REACT FUNDAMENTALS
============================================================

React = JavaScript library for building user interfaces.

Core idea:
UI = f(state)

React uses:
- Components
- JSX
- Props
- State
- Declarative rendering
*/


// ============================================================
// 02. CREATING A REACT ROOT
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);


// ============================================================
// 03. COMPONENT BASICS
// ============================================================

// Component = reusable UI function

function Welcome() {
  return <h1>Hello React</h1>;
}


// Components must start with an uppercase letter.

function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
    </div>
  );
}


// ============================================================
// 04. JSX
// ============================================================

// JSX lets us write HTML-like syntax inside JavaScript.

const userName = "Touhid";

function Profile() {
  return <h1>Hello {userName}</h1>;
}


// JavaScript expressions go inside { }.

const age = 23;

function UserInfo() {
  return (
    <div>
      <h2>{userName}</h2>
      <p>{age >= 18 ? "Adult" : "Minor"}</p>
    </div>
  );
}


// ============================================================
// 05. JSX RULES
// ============================================================

// 1. Return one parent element
// 2. Close every tag
// 3. Use className instead of class
// 4. Use camelCase for most attributes
// 5. JavaScript expressions → { }


// Multiple elements need a wrapper.

function Card() {
  return (
    <>
      <h2>Title</h2>
      <p>Description</p>
    </>
  );
}


// Fragment: <>...</>
// Does not add an extra DOM element.


// ============================================================
// 06. JSX ATTRIBUTES
// ============================================================

const imageUrl = "/profile.png";

function Avatar() {
  return (
    <img
      src={imageUrl}
      alt="Profile"
      className="avatar"
    />
  );
}


// Dynamic attribute values use { }.

const isDisabled = true;

function Button() {
  return (
    <button disabled={isDisabled}>
      Submit
    </button>
  );
}


// ============================================================
// 07. JSX vs HTML
// ============================================================

// HTML:
// <label class="input-label">

// JSX:
// <label className="input-label">

// HTML:
// onclick="..."

// JSX:
// onClick={handler}


// Common JSX differences:
// class       → className
// for         → htmlFor
// onclick     → onClick
// tabindex    → tabIndex


// ============================================================
// 08. EXPRESSIONS IN JSX
// ============================================================

const price = 100;
const quantity = 3;

function Product() {
  return (
    <div>
      <p>Total: {price * quantity}</p>
      <p>{quantity > 0 ? "In stock" : "Out of stock"}</p>
    </div>
  );
}


// Statements cannot directly go inside JSX.

// ❌
// { if (age > 18) { ... } }

// Use expressions instead:
// ternary
// &&
// function result
// variable calculated before return


// ============================================================
// 09. CONDITIONAL RENDERING
// ============================================================

function Status({ loggedIn }) {
  if (!loggedIn) {
    return <p>Please log in</p>;
  }

  return <p>Welcome back</p>;
}


// Ternary

function Access({ isAdmin }) {
  return (
    <p>
      {isAdmin ? "Admin Panel" : "User Panel"}
    </p>
  );
}


// Logical AND

function Notification({ count }) {
  return (
    <div>
      {count > 0 && <p>You have notifications</p>}
    </div>
  );
}


// Be careful with 0 && ...

function Count({ count }) {
  return (
    <div>
      {count > 0 && <p>{count}</p>}
    </div>
  );
}


// ============================================================
// 10. DECLARATIVE UI
// ============================================================

// Imperative:
// "Find this element → change its text → change its class"

// React:
// "Given this state, this is what the UI should look like."

function LoginStatus({ loggedIn }) {
  return (
    <div>
      {loggedIn ? <Dashboard /> : <Login />}
    </div>
  );
}


// ============================================================
// 11. COMPONENT COMPOSITION
// ============================================================

function Header() {
  return <header>Header</header>;
}

function MainContent() {
  return <main>Main Content</main>;
}

function Footer() {
  return <footer>Footer</footer>;
}

function Layout() {
  return (
    <>
      <Header />
      <MainContent />
      <Footer />
    </>
  );
}


// Build larger UIs by combining smaller components.


// ============================================================
// 12. RENDERING MENTAL MODEL
// ============================================================

/*
State/props change
      ↓
Component renders again
      ↓
React calculates the new UI
      ↓
React updates the necessary DOM
*/


// Render does NOT mean:
// "React replaces the whole DOM."

// Think:
// render → calculate UI
// commit → apply required DOM changes


// ============================================================
// 13. RE-RENDER BASICS
// ============================================================

// A component may re-render when:
// - Its state changes
// - Its parent re-renders
// - Its context value changes
// - Relevant external/store data changes


// Re-render ≠ every DOM node gets recreated.


// ============================================================
// 14. STRICT MODE
// ============================================================

/*
<StrictMode>
  Helps detect potential problems during development.

Important:
- Development-only checks
- Can make some functions/effects appear to run more than once
  during development
- Does not mean production will behave the same way
*/

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);


// ============================================================
// 15. QUICK RULES
// ============================================================

// React:
// - Build UI with components
// - JSX describes UI
// - Props pass data into components
// - State stores changing component data
// - UI reacts to state/props
// - Keep components focused and reusable
// - Prefer declarative code


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What is React?
A:
A JavaScript library for building component-based user interfaces.

Q2. What is JSX?
A:
A syntax extension that lets us write HTML-like UI syntax
inside JavaScript.

Q3. Is JSX HTML?
A:
No. JSX is JavaScript syntax that gets transformed into
JavaScript expressions.

Q4. Why does a React component name usually start with uppercase?
A:
React uses uppercase names to distinguish user-defined
components from native HTML elements.

Q5. What is declarative UI?
A:
We describe what the UI should look like for a given state,
instead of manually controlling DOM operations.

Q6. What happens when a component re-renders?
A:
React runs the component again, calculates the new UI,
then commits the necessary DOM changes.

Q7. Does a React re-render mean the entire DOM is recreated?
A:
No. React determines which DOM changes are necessary.

Q8. What is a Fragment?
A:
A way to group multiple JSX elements without adding an extra
DOM element.

Q9. What is the difference between class and className in React?
A:
JSX uses className instead of the HTML class attribute.

Q10. What is StrictMode?
A:
A development tool that enables additional checks to help
find potential problems in a React application.

Q11. Can JavaScript statements be directly written inside JSX?
A:
No. JSX accepts expressions inside { }.
Use variables, functions, ternaries, or conditional logic
outside/around the JSX.

Q12. What is the basic React mental model?
A:
UI = f(state)
The UI is derived from the current state and props.
*/
```
