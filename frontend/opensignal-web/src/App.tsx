import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "semantic-ui-css/semantic.min.css";
// import {SnackbarProvider} from 'material-ui-snackbar-provider';
import { GitcoinProvider } from "./store";
import Pages from "./pages";
import "./App.scss";

const colors = {
    brand: {
        900: "#1a365d",
        800: "#153e75",
        700: "#2a69ac",
    },
};
const theme = extendTheme({ colors });

function App() {
    return (
        <GitcoinProvider>
            <ChakraProvider theme={theme}>
                <Pages />
            </ChakraProvider>
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
