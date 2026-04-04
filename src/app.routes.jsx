import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/interview";
import Landing from "./features/interview/pages/Landing";

export const router = createBrowserRouter([
  {
    path:"/",
    element:<Landing/>
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: (
      <Protected>
       <Home/>
      </Protected>
    ),
  },
  {
    path:"/interview/:interviewId",
     element: (
      <Protected>
       <Interview/>
      </Protected>
    ),
  }
]);
