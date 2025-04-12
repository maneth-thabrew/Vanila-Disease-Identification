
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Menu from './components/menu/Menu';
import Container from './components/container/Container';

function App() {
  return (
    <div className="App">
      <Router>
        <Menu />
        <Container />
      </Router>
    </div>
  );
}

export default App;
