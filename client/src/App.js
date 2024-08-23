import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout'; 
import Login from './pages/admin/Login';
import EmployeeForm from './pages/admin/EmployeeForm';
import CheckinForm from './pages/admin/CheckinForm';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "admin/employee-registeration", element: <EmployeeForm /> },
      { path: "employee/check-in", element: <CheckinForm /> },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
