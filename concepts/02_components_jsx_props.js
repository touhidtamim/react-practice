```
/*
============================================================
02. COMPONENTS, JSX & PROPS
============================================================

Component → reusable UI
Props      → data passed from parent to child
children   → content passed between component tags
*/


// ============================================================
// 01. FUNCTION COMPONENT
// ============================================================

function UserCard() {
  return <div>User Card</div>;
}


// Use component like an HTML element.

function App() {
  return <UserCard />;
}


// ============================================================
// 02. COMPONENT COMPOSITION
// ============================================================

function Header() {
  return <header>Header</header>;
}

function Sidebar() {
  return <aside>Sidebar</aside>;
}

function Content() {
  return <main>Content</main>;
}

function Dashboard() {
  return (
    <>
      <Header />
      <Sidebar />
      <Content />
    </>
  );
}


// Small components → combine to build larger UI.


// ============================================================
// 03. PROPS
// ============================================================

function User(props) {
  return <h2>{props.name}</h2>;
}

function App() {
  return <User name="Touhid" />;
}


// Props can contain different data types.

function ProductCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Price: {props.price}</p>
      <p>Available: {props.available ? "Yes" : "No"}</p>
    </div>
  );
}

function Shop() {
  return (
    <ProductCard
      name="Keyboard"
      price={2500}
      available={true}
    />
  );
}


// ============================================================
// 04. DESTRUCTURING PROPS
// ============================================================

function Profile({ name, age }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
    </div>
  );
}


// Cleaner than props.name / props.age.


// ============================================================
// 05. OBJECT / ARRAY PROPS
// ============================================================

const profileData = {
  name: "Rahim",
  role: "Developer",
};

const skillList = ["React", "Node.js", "MongoDB"];

function ProfileCard({ profile, skills }) {
  return (
    <div>
      <h2>{profile.name}</h2>
      <p>{profile.role}</p>
      <p>{skills.join(", ")}</p>
    </div>
  );
}

function ProfilePage() {
  return (
    <ProfileCard
      profile={profileData}
      skills={skillList}
    />
  );
}


// ============================================================
// 06. PROPS ARE READ-ONLY
// ============================================================

function UserName({ name }) {
  // ❌ Don't modify props
  // name = "New Name";

  return <h2>{name}</h2>;
}


// Parent owns the data.
// Child receives it.


// ============================================================
// 07. PASSING FUNCTIONS AS PROPS
// ============================================================

function DeleteButton({ onDelete }) {
  return (
    <button onClick={onDelete}>
      Delete
    </button>
  );
}

function UserPanel() {
  function handleDelete() {
    console.log("Deleted");
  }

  return <DeleteButton onDelete={handleDelete} />;
}


// Functions as props allow child → parent communication.


// ============================================================
// 08. PASSING ARGUMENTS TO CALLBACK PROPS
// ============================================================

function Item({ id, onSelect }) {
  return (
    <button onClick={() => onSelect(id)}>
      Select
    </button>
  );
}

function ItemList() {
  function handleSelect(itemId) {
    console.log("Selected:", itemId);
  }

  return (
    <Item
      id={10}
      onSelect={handleSelect}
    />
  );
}


// Don't call the function while rendering:
//
// ❌ onClick={handleSelect()}
//
// Pass a function instead:
//
// ✅ onClick={handleSelect}
//
// With arguments:
//
// ✅ onClick={() => handleSelect(id)}


// ============================================================
// 09. CHILDREN PROP
// ============================================================

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

function Page() {
  return (
    <Card>
      <h2>Hello</h2>
      <p>Inside the card</p>
    </Card>
  );
}


// children = content between <Card>...</Card>


// ============================================================
// 10. COMPOSITION WITH CHILDREN
// ============================================================

function Modal({ children }) {
  return (
    <div className="modal">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}

function LoginMessage() {
  return (
    <Modal>
      <h2>Login Required</h2>
      <button>Login</button>
    </Modal>
  );
}


// Composition is generally preferred over deeply
// configurable components.


// ============================================================
// 11. DEFAULT PROP VALUES
// ============================================================

function Greeting({ name = "Guest" }) {
  return <h2>Hello, {name}</h2>;
}

function Home() {
  return (
    <>
      <Greeting />
      <Greeting name="Alex" />
    </>
  );
}


// Default value is used when prop is undefined.


// ============================================================
// 12. SPREADING PROPS
// ============================================================

const buttonProps = {
  type: "button",
  disabled: false,
};

function ActionButton(props) {
  return <button {...props}>Save</button>;
}

function Actions() {
  return <ActionButton {...buttonProps} />;
}


// Useful for forwarding multiple props.
// Don't use blindly; explicit props can be clearer.


// ============================================================
// 13. PROPS WITH JSX
// ============================================================

function Layout({ header, content }) {
  return (
    <div>
      <header>{header}</header>
      <main>{content}</main>
    </div>
  );
}

function AppLayout() {
  return (
    <Layout
      header={<h1>Dashboard</h1>}
      content={<p>Welcome</p>}
    />
  );
}


// JSX itself can be passed as a prop.


// ============================================================
// 14. KEYS — BASIC
// ============================================================

const users = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
];

function UserList() {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}


// key helps React identify list items between renders.
//
// Prefer:
// key={user.id}
//
// Avoid when possible:
// key={index}


// ============================================================
// 15. KEY RULES
// ============================================================

// Keys should be:
// - Unique among siblings
// - Stable
// - Related to the item identity

// ❌ Don't generate a random key during every render.
//
// key={Math.random()}


// ============================================================
// 16. COMPONENT RESPONSIBILITY
// ============================================================

// Prefer focused components.

function ProductTitle({ title }) {
  return <h2>{title}</h2>;
}

function ProductPrice({ price }) {
  return <p>${price}</p>;
}

function Product({ title, price }) {
  return (
    <article>
      <ProductTitle title={title} />
      <ProductPrice price={price} />
    </article>
  );
}


// Avoid creating tiny components with no real benefit.
// Component boundaries should make the code easier to manage.


// ============================================================
// 17. DATA FLOW
// ============================================================

/*
Parent
  |
  | props
  ↓
Child
*/


// Data normally flows downward.
// To send information back:
//
// Child
//   |
//   | callback
//   ↓
// Parent


// ============================================================
// QUICK RULES
// ============================================================

// Component → reusable UI
// Props → parent → child data
// Props → read-only
// children → nested content
// Function prop → child can notify parent
// key → identifies list item
// Keep component responsibilities clear
// Prefer stable keys


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What are props in React?
A:
Props are read-only values passed from a parent component
to a child component.

Q2. Can a child component modify its props?
A:
No. Props should be treated as read-only.

Q3. How can a child communicate with its parent?
A:
The parent passes a callback function as a prop, and the child
calls that function.

Q4. What is the children prop?
A:
It contains the JSX/content placed between a component's
opening and closing tags.

Q5. What is component composition?
A:
Building larger components by combining smaller reusable
components.

Q6. Why are keys required when rendering lists?
A:
Keys help React identify which list items are the same,
added, removed, or changed.

Q7. Why is array index usually a bad key?
A:
If items are inserted, removed, or reordered, indexes can
change and cause incorrect item identity.

Q8. Why shouldn't Math.random() be used as a key?
A:
It creates a new key on every render, so React cannot
reliably preserve item identity.

Q9. What happens if a prop is undefined and has a default value?
A:
The default value is used.

Q10. What is the difference between props and state?
A:
Props come from the parent and are read-only.
State is owned and managed by the component.

Q11. Can a function be passed as a prop?
A:
Yes. This is commonly used for child → parent communication.

Q12. What is the difference between:
onClick={handleClick}
and
onClick={handleClick()}?

A:
The first passes the function.
The second calls the function immediately during rendering.
*/
```
