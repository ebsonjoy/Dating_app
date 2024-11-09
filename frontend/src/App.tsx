import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App: React.FC = () => {
  console.log('App component rendered');

  return (
    <>
      <ToastContainer />
      <Container fluid className="p-0"> 
        <Outlet />
      </Container>
    </>
  );
};

export default App;
