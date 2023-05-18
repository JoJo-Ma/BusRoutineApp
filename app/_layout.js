import { Slot } from 'expo-router';
import { 
    MD3LightTheme as DefaultTheme,
    Provider as PaperProvider } from 'react-native-paper';
import { ApiContextProvider } from '../contexts/ApiContext';
import { useEffect, useContext } from 'react';
import { BusGroupsContextProvider, BusGroupsDispatchContext } from '../contexts/BusGroupsContext';
import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Appbar } from 'react-native-paper';
import GlobalStyles from '../styles/GlobalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../styles/Theme';

const BOTTOM_APPBAR_HEIGHT = 60;

export default function Layout() {

    const navigation = useNavigation();
    const router = useRouter();

    const { bottom } = useSafeAreaInsets();

    return (
        <ApiContextProvider>
            <BusGroupsContextProvider>
                <PaperProvider theme={Theme}>
                    <Appbar.Header
                        mode='center-aligned'
                        style={{backgroundColor: Theme.colors.primary}}
                    >
                        <Appbar.Content
                        title="Bus"
                        color='white'
                        />
                    </Appbar.Header>
                    <Slot />
                    <Appbar
                        style={[
                        styles.bottom,
                        {
                            height: BOTTOM_APPBAR_HEIGHT + bottom,
                            backgroundColor: Theme.colors.primary
                        },
                        ]}
                        safeAreaInsets={{ bottom }}
                    >
                        <Appbar.Action
                            icon="home"
                            color='white'
                            onPress={() => {
                                navigation.dispatch({ type: 'POP_TO_TOP' })
                            }}
                        />
                        <Appbar.Action
                            icon="bus-multiple"
                            color='white'
                            onPress={() => {
                                router.push('/groups')
                            }}
                        />
                    </Appbar>
                </PaperProvider>
            </BusGroupsContextProvider>
        </ApiContextProvider>
    )
}

const styles = StyleSheet.create({
    bottom: {
      backgroundColor: 'aquamarine',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
    fab: {
      position: 'absolute',
      right: 16,
    },
  });