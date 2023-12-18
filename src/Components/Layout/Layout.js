import { Outlet } from "react-router-dom";
import { Navbar } from "../Common/Navbar/Navbar";
import "./layout.scss";
export const Layout = () => {
  return (
    <main>
      <Navbar />
      <section className="main-part">
        <Outlet />
      </section>
    </main>
  );
};
