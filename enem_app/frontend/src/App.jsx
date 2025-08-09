import "./styles/components/app.sass";
import CardHabilidade from "./components/CardHabilidade"
import { BiMath } from 'react-icons/bi'

const App = () => {
  const dadosCards = [
    {
      icone: BiMath,
      titulo: 'Matemática e Suas Tecnologias',
      porcentagem: 10,
      questoes: 200,
      conteudoVerso: [
        'Números e operações',
        'Expressões algébricas',
        'Funções e seus gráficos',
        'Geometria e o espaço',
        'Estatística e probabilidade',
        'Grandezas e medidas'
      ],
      icone: BiMath,
    }
  ]

  return (
    <div className='cards-container'>
      {dadosCards.map((card, index) => (
        <CardHabilidade
        key={index}
        icone={card.icone}
        titulo={card.titulo}
        porcentagem={card.porcentagem}
        questoes={card.questoes}
        conteudoVerso={card.conteudoVerso}
    />
      ))}
  </div>
  )
}

export default App;
