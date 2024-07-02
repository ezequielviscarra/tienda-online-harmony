import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar></Navbar>
      <main>{children}</main>
      <style jsx>{`
        main {
          margin-top: 100px; /* Ajusta el valor según la altura de tu Navbar */
        }
      `}</style>

    </div>
  );
}