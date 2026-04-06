import React from "react";
import AppRoutes from "./routes/approutes.jsx";
import Layout from "./components/layout.jsx";

export default function App() {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}