import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import "./styles/main.sass";
import "./styles/components/app.sass";
import Praticar from "./components/Praticar";


function App() {
  return (
    <>
      <h1></h1>
      <br />
      <p></p>
      <p></p>
      <NavBar />
      <Dashboard />
      <Praticar />
      {/* <FlashCards /> precisa re importar caso for usar esta pagina*/}
    </>
  );
}

export default App;
