import 'semantic-ui-css/semantic.min.css';
import './App.scss';
import {GitcoinProvider} from './store';
import {Screens} from './screens';
function App() {
    return (
        <GitcoinProvider>
            <Screens />
        </GitcoinProvider>
    );
}

export default App;
