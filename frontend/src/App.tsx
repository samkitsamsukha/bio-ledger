import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard.tsx';
import Equipment from './pages/Equipment.tsx';
import Incharges from './pages/Incharges.tsx';
import Assistant from './pages/Assistant.tsx';

function App() {  
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/incharges" element={<Incharges />} />
          <Route path="/assistant" element={<Assistant />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;