import { Slot } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { ApiContextProvider } from '../context/ApiContext';

export default function Layout() {
    return (
        <ApiContextProvider>
            <PaperProvider>
                <Slot />
            </PaperProvider>
        </ApiContextProvider>
    )
}