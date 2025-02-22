// src/pages/Dashboard.js
import React, { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";

const Dashboard = () => {
  const { user } = useContext(GlobalContext);

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <p>Hello, {user?.name}!</p>
    </div>
  );
};

export default Dashboard;
