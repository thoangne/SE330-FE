import Header from "./components/Header";
import Footer from "./components/Footer";
import Router from "./router";

function App() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <Router />
      </main>
      <Footer />
    </>
  );
}

export default App;
