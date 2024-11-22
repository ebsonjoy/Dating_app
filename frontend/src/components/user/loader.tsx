import React from "react";

const Loader: React.FC = () => {
  return (
    <div style={loaderContainerStyle}>
      <div style={loaderStyle}></div>
    </div>
  );
};

const loaderContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", 
  backgroundColor: "#f8f9fa", 
};

const loaderStyle: React.CSSProperties = {
  width: "80px",
  height: "80px",
  border: "8px solid transparent",
  borderTop: "8px solid #4caf50",
  borderRight: "8px solid #2196f3", 
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const loaderAnimation = `
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;
const styleElement = document.createElement("style");
styleElement.innerHTML = loaderAnimation;
document.head.appendChild(styleElement);

export default Loader;
