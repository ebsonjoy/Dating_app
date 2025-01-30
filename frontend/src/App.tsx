import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <>
      {/* Global Toast Settings */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          backgroundColor: '#333',
          color: '#fff',
          borderRadius: '8px',
        }}
      />
      <Container fluid className="p-0"> 
        <Outlet />
      </Container>
    </>
  );
};

export default App;
