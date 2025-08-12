import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import "./styles/main.sass";
import "./styles/components/app.sass";
import Praticar from "./components/Praticar";


function App() {
  return (
    <>
      <h1>Aplicativo rodando :D</h1>
      <br />
      <p>Adicione aqui seus componentes</p>
      <p>Você pode deletar esses elementos!</p>
      <NavBar />
      <Dashboard />
      <Praticar />
      {/* <FlashCards /> precisa re importar caso for usar esta pagina*/}
    </>
  );
}

export default App;
