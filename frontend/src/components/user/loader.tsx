import { Spinner } from "react-bootstrap";
import React from "react"; // You may need this depending on your setup

const Loader: React.FC = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: '100px',
        height: '100px',
        margin: 'auto',
        display: 'block',
      }}
    />
  );
};

export default Loader;
