```
/*
============================================================
03. STATE, EVENTS & FORMS
============================================================

State  → component-এর changing data
Event  → user/browser interaction
Form   → user input collect & manage
*/


// ============================================================
// 01. useState
// ============================================================

import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  );
}


// State update → component re-renders.


// ============================================================
// 02. FUNCTIONAL STATE UPDATE
// ============================================================

// When new state depends on previous state,
// prefer the functional updater.

function ScoreCounter() {
  const [score, setScore] = useState(0);

  function increaseScore() {
    setScore((previousScore) => previousScore + 1);
  }

  return (
    <div>
      <p>{score}</p>
      <button onClick={increaseScore}>
        +1
      </button>
    </div>
  );
}


// Useful when multiple updates depend on previous state.


// ============================================================
// 03. BATCHING
// ============================================================

function BatchExample() {
  const [value, setValue] = useState(0);

  function handleClick() {
    setValue((current) => current + 1);
    setValue((current) => current + 1);
    setValue((current) => current + 1);
  }

  return (
    <button onClick={handleClick}>
      Value: {value}
    </button>
  );
}


// Functional updates correctly apply all three updates.


// ============================================================
// 04. OBJECT STATE
// ============================================================

function UserForm() {
  const [user, setUser] = useState({
    name: "",
    age: 0,
  });

  function updateName(event) {
    setUser((currentUser) => ({
      ...currentUser,
      name: event.target.value,
    }));
  }

  return (
    <input
      value={user.name}
      onChange={updateName}
      placeholder="Name"
    />
  );
}


// Don't mutate state directly.
//
// ❌ user.name = "Alex";
//
// Create a new object instead.


// ============================================================
// 05. ARRAY STATE
// ============================================================

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React" },
  ]);

  function addTodo() {
    const newTodo = {
      id: Date.now(),
      text: "Practice",
    };

    setTodos((currentTodos) => [
      ...currentTodos,
      newTodo,
    ]);
  }

  return (
    <div>
      <button onClick={addTodo}>
        Add
      </button>

      {todos.map((todo) => (
        <p key={todo.id}>
          {todo.text}
        </p>
      ))}
    </div>
  );
}


// Common immutable array patterns:
//
// Add     → [...items, newItem]
// Remove  → items.filter(...)
// Update  → items.map(...)


// ============================================================
// 06. STATE IMMUTABILITY
// ============================================================

// ❌ Don't mutate state directly:
//
// state.push(item);
// state.name = "Alex";
// state.items[0].done = true;
//
// Prefer creating a new value.


// ============================================================
// 07. DERIVED DATA
// ============================================================

function PriceSummary() {
  const [price] = useState(100);
  const [quantity] = useState(3);

  const total = price * quantity;

  return <p>Total: {total}</p>;
}


// Don't create state for values that can be calculated
// from existing state/props.


// ============================================================
// 08. EVENT HANDLERS
// ============================================================

function ClickExample() {
  function handleClick() {
    console.log("Clicked");
  }

  return (
    <button onClick={handleClick}>
      Click
    </button>
  );
}


// Pass the function:
//
// ✅ onClick={handleClick}
//
// Don't call it during render:
//
// ❌ onClick={handleClick()}


// ============================================================
// 09. EVENT OBJECT
// ============================================================

function InputExample() {
  function handleChange(event) {
    console.log(event.target.value);
  }

  return (
    <input onChange={handleChange} />
  );
}


// Common properties:
//
// event.target
// event.currentTarget
// event.preventDefault()


// ============================================================
// 10. PASSING ARGUMENTS TO EVENT HANDLERS
// ============================================================

function DeleteItem({ itemId, onDelete }) {
  return (
    <button onClick={() => onDelete(itemId)}>
      Delete
    </button>
  );
}


// ============================================================
// 11. EVENT PROPAGATION
// ============================================================

function EventExample() {
  function handleParentClick() {
    console.log("Parent");
  }

  function handleChildClick(event) {
    event.stopPropagation();
    console.log("Child");
  }

  return (
    <div onClick={handleParentClick}>
      <button onClick={handleChildClick}>
        Click
      </button>
    </div>
  );
}


// stopPropagation() prevents the event from continuing
// through the propagation path.


// ============================================================
// 12. preventDefault()
// ============================================================

function LinkExample() {
  function handleClick(event) {
    event.preventDefault();
    console.log("Default navigation prevented");
  }

  return (
    <a href="/dashboard" onClick={handleClick}>
      Dashboard
    </a>
  );
}


// Common with forms and links.


// ============================================================
// 13. CONTROLLED INPUT
// ============================================================

function ControlledInput() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}


// React state controls the input value.


// ============================================================
// 14. CONTROLLED FORM
// ============================================================

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    console.log({
      email,
      password,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
}


// ============================================================
// 15. MULTIPLE INPUTS WITH ONE STATE OBJECT
// ============================================================

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  return (
    <form>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
    </form>
  );
}


// ============================================================
// 16. CHECKBOX
// ============================================================

function TermsCheckbox() {
  const [accepted, setAccepted] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={accepted}
        onChange={(event) => setAccepted(event.target.checked)}
      />

      Accept terms
    </label>
  );
}


// checkbox → checked
// text input → value


// ============================================================
// 17. SELECT
// ============================================================

function CountrySelect() {
  const [country, setCountry] = useState("");

  return (
    <select
      value={country}
      onChange={(event) => setCountry(event.target.value)}
    >
      <option value="">Select country</option>
      <option value="bd">Bangladesh</option>
      <option value="us">USA</option>
    </select>
  );
}


// ============================================================
// 18. BASIC VALIDATION
// ============================================================

function SignupForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }

    setError("");
    console.log("Submit:", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      {error && <p>{error}</p>}

      <button type="submit">
        Sign up
      </button>
    </form>
  );
}


// ============================================================
// 19. CONTROLLED vs UNCONTROLLED
// ============================================================

/*
Controlled:
React state controls the value.

<input value={name} onChange={...} />


Uncontrolled:
DOM keeps the current value.
Usually accessed with a ref.

<input ref={inputRef} />
*/


// Controlled → useful when UI needs to react to input changes.
// Uncontrolled → useful for simple forms / DOM-based access.


// ============================================================
// 20. LIFTING STATE UP
// ============================================================

/*
If two components need the same state:

        Parent
       /      \
      ↓        ↓
  Child A   Child B

Move the state to their nearest common parent.
*/


function TemperatureInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function TemperaturePanel() {
  const [temperature, setTemperature] = useState("");

  return (
    <TemperatureInput
      value={temperature}
      onChange={setTemperature}
    />
  );
}


// ============================================================
// 21. STATE DESIGN RULES
// ============================================================

/*
Keep state:
- Minimal
- Local when possible
- Immutable

Avoid:
- Duplicate state
- Unnecessary derived state
- Storing values that can be calculated
*/


// ============================================================
// QUICK RULES
// ============================================================

// useState → local component state
// setState → request a state update
// Previous state needed → functional updater
// Object/array state → create new value
// Input controlled → value + onChange
// Checkbox → checked + onChange
// Form submit → onSubmit + preventDefault
// Child → parent → callback prop
// Shared state → lift state up
// Derived value → calculate, don't store


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What is state in React?
A:
Data owned by a component that can change and cause the
component to render again.

Q2. Why shouldn't React state be mutated directly?
A:
React relies on state updates and new references to determine
when UI needs to update. Direct mutation can cause incorrect
or unpredictable UI behavior.

Q3. When should you use a functional state update?
A:
When the new state depends on the previous state.

Example:
setCount((previous) => previous + 1);

Q4. Why can multiple functional state updates work correctly?
A:
Each updater receives the latest pending state.

Q5. What is a controlled component?
A:
A form element whose value is controlled by React state.

Q6. What is an uncontrolled component?
A:
A form element whose current value is mainly managed by the
DOM, commonly accessed through a ref.

Q7. What is the difference between value and checked?
A:
Text-like inputs commonly use value.
Checkbox/radio inputs use checked.

Q8. How do you prevent normal form submission?
A:
Call event.preventDefault() inside the submit handler.

Q9. How does a child send data to its parent?
A:
The parent passes a callback function as a prop.

Q10. What is lifting state up?
A:
Moving shared state to the nearest common parent of the
components that need it.

Q11. What is derived state?
A:
A value that can be calculated from existing props/state.
It usually should not be stored as separate state.

Q12. What is the difference between event.target and
event.currentTarget?
A:
target is the element where the event originated.
currentTarget is the element whose handler is currently running.

Q13. Why should event handlers receive a function instead of
calling the function directly?

A:
Because React needs the function to execute when the event
occurs.

Correct:
onClick={handleClick}

Incorrect:
onClick={handleClick()}

Q14. When should you use preventDefault()?
A:
When you want to prevent the browser's default action, such
as normal form submission or link navigation.

Q15. What does stopPropagation() do?
A:
It stops the event from continuing through the propagation path.
*/
```;
