import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Header from "./components/Header";
// import AdminHeader from "./components/adminComponents/AdminHeader";

const App: React.FC = () => {
  console.log('App component rendered');
  // const location = useLocation(); // useLocation is correctly typed with react-router-dom's types

  // Determine if the current page is an admin page by checking the path
  // const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* {isAdminPage ? <AdminHeader /> : <Header />} */}
      <ToastContainer />
      {/* Use fluid container or remove margins */}
      <Container fluid className="p-0"> {/* Add p-0 to remove padding */}
        <Outlet />
      </Container>
    </>
  );
};

export default App;
