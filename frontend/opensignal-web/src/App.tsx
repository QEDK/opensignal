// import {SnackbarProvider} from 'material-ui-snackbar-provider';
import { GitcoinProvider } from "./store";
import Pages from "./pages";

function App() {
    return (
        <GitcoinProvider>
            <Pages />
        </GitcoinProvider>
    );
}
{
    /* <SnackbarProvider SnackbarProps={{autoHideDuration: 4000}}> */
}
export default App;
declare global {
    interface Window {
        __CIPHER__?: any;
    }
}
