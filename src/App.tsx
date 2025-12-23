import { PrimeReactProvider } from 'primereact/api';
import ClientTablePage from './pages/ClientTablePage';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import './App.css';

function App() {

  return (
    <PrimeReactProvider>
        <ClientTablePage></ClientTablePage>
    </PrimeReactProvider>
  )
}

export default App
