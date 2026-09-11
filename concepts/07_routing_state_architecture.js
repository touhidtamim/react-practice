```
/*
  React Revision — Routing, State & Architecture

  Focus:
  - React Router
  - Routes
  - Link / NavLink
  - Dynamic routes
  - Navigation
  - Nested routes
  - Protected routes
  - State management decisions
  - Context
  - Server state
  - Component architecture
*/


// ============================================================
// 1. REACT ROUTER
// ============================================================

// React itself does not provide full application routing.
// React Router is commonly used for client-side routing.
//
// Typical setup:
//
// npm install react-router-dom
//
// Example imports:
//
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Link,
//   NavLink,
//   useNavigate,
//   useParams,
//   useSearchParams,
//   Outlet,
// } from "react-router-dom";


// ============================================================
// 2. BASIC ROUTES
// ============================================================

// Example:
//
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// URL -> matching Route -> rendered element


// ============================================================
// 3. LINK
// ============================================================

// Use Link instead of normal <a> for internal navigation.
//
// <Link to="/about">About</Link>
//
// Link allows client-side navigation without a full page reload.


// ============================================================
// 4. NAVLINK
// ============================================================

// NavLink is useful when the active link needs special styling.
//
// <NavLink
//   to="/dashboard"
//   className={({ isActive }) =>
//     isActive ? "active" : ""
//   }
// >
//   Dashboard
// </NavLink>


// ============================================================
// 5. DYNAMIC ROUTES
// ============================================================

// Route:
//
// <Route path="/users/:userId" element={<UserProfile />} />

// URL:
// /users/42

// Read the parameter:
//
// import { useParams } from "react-router-dom";
//
// function UserProfile() {
//   const { userId } = useParams();
//
//   return <p>User ID: {userId}</p>;
// }


// ============================================================
// 6. PROGRAMMATIC NAVIGATION
// ============================================================

// useNavigate is useful when navigation happens after an action.
//
// import { useNavigate } from "react-router-dom";
//
// function LoginButton() {
//   const navigate = useNavigate();
//
//   function handleLogin() {
//     // login logic...
//     navigate("/dashboard");
//   }
//
//   return <button onClick={handleLogin}>Login</button>;
// }


// ============================================================
// 7. QUERY PARAMETERS
// ============================================================

// Example URL:
//
// /products?category=phone&page=2
//
// useSearchParams can read/update query parameters.
//
// import { useSearchParams } from "react-router-dom";
//
// function ProductPage() {
//   const [searchParams] = useSearchParams();
//
//   const category = searchParams.get("category");
//   const page = searchParams.get("page");
//
//   return (
//     <p>
//       Category: {category}, Page: {page}
//     </p>
//   );
// }


// ============================================================
// 8. NESTED ROUTES
// ============================================================

// Useful for layouts such as:
//
// /dashboard
// /dashboard/profile
// /dashboard/settings
//
// Parent route can render <Outlet />.
//
// Example:
//
// <Route path="/dashboard" element={<DashboardLayout />}>
//   <Route index element={<DashboardHome />} />
//   <Route path="profile" element={<Profile />} />
//   <Route path="settings" element={<Settings />} />
// </Route>
//
// DashboardLayout:
//
// function DashboardLayout() {
//   return (
//     <div>
//       <nav>Dashboard navigation</nav>
//       <Outlet />
//     </div>
//   );
// }


// ============================================================
// 9. PROTECTED ROUTES
// ============================================================

// Protected routes check authentication before rendering
// private content.
//
// Concept:
//
// function ProtectedRoute({ children }) {
//   const isAuthenticated = true;
//
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//
//   return children;
// }
//
// Then:
//
// <Route
//   path="/dashboard"
//   element={
//     <ProtectedRoute>
//       <Dashboard />
//     </ProtectedRoute>
//   }
// />


// ============================================================
// 10. ROUTING MENTAL MODEL
// ============================================================
//
// URL
//  ↓
// Router matches route
//  ↓
// Route renders component
//  ↓
// Component reads params/query/state
//  ↓
// UI


// ============================================================
// 11. LOCAL STATE
// ============================================================

// Keep state local when only one component needs it.
//
// Example:
//
// function SearchInput() {
//   const [text, setText] = useState("");
//
//   return (
//     <input
//       value={text}
//       onChange={(event) => setText(event.target.value)}
//     />
//   );
// }

// Don't make every state global.


// ============================================================
// 12. LIFT STATE UP
// ============================================================

// If sibling components need the same state:
//
// Parent
// ├── SearchInput
// └── SearchResults
//
// Keep the shared state in Parent.
//
// Parent owns state.
// Parent passes value + callbacks to children.


// ============================================================
// 13. CONTEXT
// ============================================================

// Context is useful when many components need the same value.
//
// Common examples:
// - theme
// - current user
// - locale
//
// Example:
//
// const AuthContext = createContext(null);
//
// function App() {
//   const user = { name: "Rahim" };
//
//   return (
//     <AuthContext value={user}>
//       <Dashboard />
//     </AuthContext>
//   );
// }
//
// function Dashboard() {
//   const user = useContext(AuthContext);
//
//   return <p>{user.name}</p>;
// }

// Context removes prop drilling,
// but it is not automatically a replacement for all state management.


// ============================================================
// 14. CONTEXT + REDUCER
// ============================================================

// For shared state with complex transitions:
//
// Context
//    +
// useReducer
//    ↓
// Shared state + state logic
//
// This can work well for medium-sized application-level state.
//
// Avoid creating one giant context for the whole application.


// ============================================================
// 15. CLIENT STATE vs SERVER STATE
// ============================================================

// Client state:
// - modal open/closed
// - selected tab
// - form input
// - UI preferences
//
// Server state:
// - users
// - products
// - orders
// - bookings
//
// Server state usually needs:
// - fetching
// - caching
// - refetching
// - synchronization
// - loading/error handling
//
// Tools such as TanStack Query are designed for server-state management.


// ============================================================
// 16. STATE MANAGEMENT DECISION TREE
// ============================================================
//
// Only one component needs it?
// -> useState
//
// Parent + child/siblings need it?
// -> lift state up
//
// Many distant components need simple shared values?
// -> Context
//
// Complex shared state?
// -> Context + useReducer
//    or a dedicated state library
//
// Data comes from API/server?
// -> server-state solution such as TanStack Query
//
// Don't add a state library just because the application has
// more than one component.


// ============================================================
// 17. AVOID PROP DRILLING
// ============================================================

// Prop drilling:
//
// App
//  ↓
// Layout
//  ↓
// Page
//  ↓
// Card
//  ↓
// Button
//
// Same value is passed through components that don't actually need it.
//
// Possible solutions:
// - component composition
// - Context
// - state management library


// ============================================================
// 18. COMPONENT ARCHITECTURE
// ============================================================

// A practical structure:
//
// src/
// ├── components/
// ├── pages/
// ├── layouts/
// ├── hooks/
// ├── services/
// ├── context/
// ├── utils/
// └── App.jsx
//
// Exact structure can change based on project size.
// Don't create folders just for the sake of creating folders.


// ============================================================
// 19. SERVICES / API LOGIC
// ============================================================

// Keep reusable API logic outside UI components when appropriate.
//
// Example:
//
// async function getUsers() {
//   const response = await fetch("/api/users");
//
//   if (!response.ok) {
//     throw new Error("Failed to fetch users");
//   }
//
//   return response.json();
// }
//
// Component can call the service instead of containing every
// API detail directly.


// ============================================================
// 20. AUTH FLOW
// ============================================================
//
// Login form
//    ↓
// Send credentials
//    ↓
// Backend verifies user
//    ↓
// Authentication state/session established
//    ↓
// Fetch current user
//    ↓
// Protected routes become available
//
// Important:
// Authentication/authorization should ultimately be enforced
// by the backend. Frontend route protection is mainly UI/navigation
// protection, not a security boundary.


// ============================================================
// QUICK RULES
// ============================================================
//
// 1. Use React Router for client-side routing.
// 2. Use Link/NavLink for internal navigation.
// 3. useParams -> dynamic route parameters.
// 4. useSearchParams -> URL query parameters.
// 5. useNavigate -> programmatic navigation.
// 6. Outlet -> render nested route content.
// 7. Keep simple state local.
// 8. Lift shared state to the closest common parent.
// 9. Use Context when shared values are needed across distant components.
// 10. Context is not automatically a replacement for state libraries.
// 11. Separate client state from server state.
// 12. Don't duplicate server data unnecessarily in local state.
// 13. Keep API/business logic separated when the project grows.
// 14. Frontend route protection is not backend security.
// 15. Prefer simple architecture; add complexity when needed.


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What is React Router?
A. A routing library commonly used to map URLs to React components.

Q2. Link vs <a>?
A. Link is used for internal client-side navigation. A normal <a> can
   trigger a full browser navigation.

Q3. What is useParams?
A. It reads dynamic parameters from the current route.

Q4. What is useNavigate?
A. It allows programmatic navigation.

Q5. What is useSearchParams?
A. It reads and updates query parameters in the URL.

Q6. What is Outlet?
A. It renders the matching child route inside a parent route.

Q7. What is a protected route?
A. A route that checks whether the user is allowed to access a page
   before rendering or redirecting.

Q8. What is prop drilling?
A. Passing props through multiple components that don't actually need
   the data themselves.

Q9. How can prop drilling be reduced?
A. Component composition, Context, or an appropriate state-management tool.

Q10. When should state stay local?
A. When only one component or a small local component tree needs it.

Q11. When should state be lifted?
A. When multiple related components need to read or update the same state.

Q12. Context vs state management library?
A. Context is useful for sharing values and simple state. Larger or more
   complex global state may benefit from a dedicated state library.

Q13. What is server state?
A. Data owned by the backend/server that the frontend fetches and may need
   to cache, refetch and synchronize.

Q14. Is frontend route protection a security mechanism?
A. No. Backend authorization must enforce actual access control.

Q15. Where should API logic live in a growing React application?
A. Often in dedicated service/API modules or a server-state layer rather
   than duplicating request logic across components.

Q16. Should every React application use Redux or another state library?
A. No. Start with local state, lifting state and Context where appropriate,
   then add a dedicated library when the application's needs justify it.
*/
```;
