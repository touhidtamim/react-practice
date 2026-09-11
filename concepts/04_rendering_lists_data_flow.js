```
/*
  React Revision — Rendering, Lists & Data Flow

  Focus:
  - Conditional rendering
  - Lists & keys
  - One-way data flow
  - Lifting state up
  - Derived data
  - Filtering / sorting
  - Empty states
*/

// ============================================================
// 1. CONDITIONAL RENDERING
// ============================================================

// Ternary
function UserStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <p>Welcome back</p> : <p>Please log in</p>}
    </div>
  );
}

// && for "show or nothing"
function AdminPanel({ isAdmin }) {
  return <div>{isAdmin && <button>Admin Panel</button>}</div>;
}

// Multiple conditions
function ResultMessage({ status }) {
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Something went wrong.</p>;
  }

  return <p>Data loaded.</p>;
}


// ============================================================
// 2. RENDERING LISTS
// ============================================================

const users = [
  { id: 1, name: "Rahim" },
  { id: 2, name: "Karim" },
  { id: 3, name: "Nadia" },
];

function UserList() {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// map() returns JSX for each item.

// Avoid:
// users.forEach(...)
// forEach() does not return a new array for React to render.


// ============================================================
// 3. KEYS
// ============================================================

// Keys help React identify which list item is which.

const products = [
  { id: "p1", name: "Laptop" },
  { id: "p2", name: "Mouse" },
  { id: "p3", name: "Keyboard" },
];

function ProductList() {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// Good:
// key={product.id}

// Avoid when the list can change:
// key={index}

// Avoid random keys:
// key={Math.random()}

// Key should be:
// - unique among siblings
// - stable
// - connected to item identity


// ============================================================
// 4. LIST WITH EVENT HANDLER
// ============================================================

function ActionList({ items, onSelect }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <button onClick={() => onSelect(item.id)}>
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

// Do not call the function immediately:
// onClick={onSelect(item.id)}   // wrong

// Use a function:
// onClick={() => onSelect(item.id)}


// ============================================================
// 5. ONE-WAY DATA FLOW
// ============================================================

// Parent -> Child through props.

function ChildCard({ title }) {
  return <h3>{title}</h3>;
}

function ParentCard() {
  const cardTitle = "Dashboard";

  return <ChildCard title={cardTitle} />;
}

// Data normally flows downward:
// Parent
//   ↓
// Child
//   ↓
// Grandchild


// ============================================================
// 6. CHILD -> PARENT COMMUNICATION
// ============================================================

// Child does not directly change parent's state.
// Parent passes a callback.

function SearchButton({ onSearch }) {
  return (
    <button onClick={() => onSearch("react")}>
      Search
    </button>
  );
}

function SearchPage() {
  function handleSearch(query) {
    console.log(query);
  }

  return <SearchButton onSearch={handleSearch} />;
}


// ============================================================
// 7. LIFTING STATE UP
// ============================================================

// If two components need the same state,
// move that state to their closest common parent.

// Example concept:
//
// Parent
// ├── Input
// └── Preview
//
// State lives in Parent.

import { useState } from "react";

function TextInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function TextPreview({ value }) {
  return <p>Preview: {value}</p>;
}

function SharedText() {
  const [text, setText] = useState("");

  return (
    <div>
      <TextInput value={text} onChange={setText} />
      <TextPreview value={text} />
    </div>
  );
}

// One source of truth:
// text is stored once in SharedText.


// ============================================================
// 8. DERIVED DATA
// ============================================================

// Do not store values that can be calculated from existing state.

function CartSummary({ items }) {
  const totalItems = items.length;

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <div>
      <p>Items: {totalItems}</p>
      <p>Total: ${totalPrice}</p>
    </div>
  );
}

// Prefer:
// const total = calculate(items);

// Avoid unnecessary duplicate state:
// const [total, setTotal] = useState(0);

// If total depends on items, derive it from items.


// ============================================================
// 9. FILTERING BEFORE MAP
// ============================================================

const allProducts = [
  { id: 101, name: "Laptop", active: true },
  { id: 102, name: "Phone", active: false },
  { id: 103, name: "Monitor", active: true },
];

function ActiveProducts() {
  const activeProducts = allProducts.filter(
    (product) => product.active
  );

  return (
    <ul>
      {activeProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// Common pattern:
// data
//   -> filter
//   -> map
//   -> JSX


// ============================================================
// 10. SEARCH + FILTER
// ============================================================

function ProductSearch({ products, searchText }) {
  const visibleProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <ul>
      {visibleProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// searchText is state/prop.
// visibleProducts is derived data.


// ============================================================
// 11. SORTING
// ============================================================

// Do not mutate the original array with sort().

function SortedProducts({ products }) {
  const sortedProducts = [...products].sort(
    (first, second) => first.price - second.price
  );

  return (
    <ul>
      {sortedProducts.map((product) => (
        <li key={product.id}>
          {product.name} - ${product.price}
        </li>
      ))}
    </ul>
  );
}

// [...products] creates a new array before sorting.


// ============================================================
// 12. EMPTY LIST
// ============================================================

function MessageList({ messages }) {
  if (messages.length === 0) {
    return <p>No messages found.</p>;
  }

  return (
    <ul>
      {messages.map((message) => (
        <li key={message.id}>{message.text}</li>
      ))}
    </ul>
  );
}


// ============================================================
// 13. LOADING / EMPTY / DATA
// ============================================================

function DataView({ loading, items }) {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (items.length === 0) {
    return <p>No data found.</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// Think in UI states:
// Loading
// Empty
// Success
// Error


// ============================================================
// 14. COMPONENT RESPONSIBILITY
// ============================================================

// Prefer small components with clear responsibilities.

function ProductItem({ product }) {
  return (
    <li>
      {product.name} - ${product.price}
    </li>
  );
}

function ProductCollection({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ul>
  );
}

// Parent handles collection.
// Child handles one item.


// ============================================================
// QUICK RULES
// ============================================================
//
// 1. Use map() to render lists.
// 2. Give list items stable keys.
// 3. Prefer real IDs instead of array indexes for keys.
// 4. Props flow from parent -> child.
// 5. Child -> parent communication uses callbacks.
// 6. Lift shared state to the closest common parent.
// 7. Avoid duplicate/derived state.
// 8. Calculate derived values during rendering.
// 9. Filter/sort data before map() when needed.
// 10. Do not mutate state or props.
// 11. Do not mutate arrays with sort() directly.
// 12. Handle loading, empty, error and success states.
// 13. Keep components focused and composable.


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. Why are keys needed in React lists?
A. Keys help React identify list items between renders.

Q2. Why is array index a bad key?
A. If items are inserted, removed or reordered, index-based identity can
   change and cause incorrect UI/state behavior.

Q3. Can keys be random?
A. No. Keys should be stable between renders.

Q4. What is one-way data flow?
A. Data normally flows from parent to child through props.

Q5. How does a child communicate with its parent?
A. The parent passes a callback function as a prop.

Q6. What is lifting state up?
A. Moving shared state to the closest common parent of the components
   that need it.

Q7. What is derived data?
A. Data calculated from existing props/state instead of stored separately.

Q8. Why avoid duplicate state?
A. Multiple sources of truth can become inconsistent.

Q9. Why should we avoid mutating arrays before rendering?
A. Mutation can cause unexpected behavior and makes state/data flow harder
   to reason about.

Q10. Why use [...items].sort() instead of items.sort()?
A. sort() mutates the original array. The spread creates a new array first.

Q11. What is the common pattern for rendering filtered data?
A. filter() -> map() -> JSX.

Q12. What UI states should data-driven components usually consider?
A. Loading, error, empty and successful data states.
*/
```;
