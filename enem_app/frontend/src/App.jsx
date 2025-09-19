import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import TelaLogin from "./pages/TelaLogin"

import "./styles/components/app.sass";

function App() {
  return (
    <>
      {/* <h1>Aplicativo rodando :D</h1>
      <br />
      <p>Adicione aqui seus componentes</p>
      <p>Você pode deletar esses elementos!</p>
      <NavBar />
      <Dashboard /> */}
      <TelaLogin />
      {/* <Praticar />  precisa re importar caso for usar esta pagina*/}
      {/* <FlashCards /> precisa re importar caso for usar esta pagina*/}
    </>
  );
}

export default App;
