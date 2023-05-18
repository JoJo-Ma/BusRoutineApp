import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useContext, useEffect } from "react";
import { BusGroupsContext, BusGroupsDispatchContext } from "../contexts/BusGroupsContext";
import GroupTimeEstimate from "../components/GroupTimeEstimate";
import GlobalStyles from "../styles/GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Page() {
  const { busGroups } = useContext(BusGroupsContext);
  const dispatch = useContext(BusGroupsDispatchContext);

  useEffect(() => {
    const getLocalStorage = async () => {
        try {
            const busGroups = await AsyncStorage.getItem('busGroups');
            console.log('busGroups', typeof JSON.parse(busGroups), busGroups);
            console.log(dispatch);
            if (busGroups) {
                dispatch({
                    type: 'SET_BUS_GROUPS',
                    payload: {
                        busGroups: JSON.parse(busGroups),
                    },
                });
            }
        } catch (error) {
            console.log('error', error);
        }
    }
    getLocalStorage();
}, [])

  return (
    <ScrollView style={GlobalStyles.container}>
        { busGroups && busGroups.length > 0 ?
          busGroups.map((busGroup) => {
            if (busGroup.data.length === 0) return;
            return (<GroupTimeEstimate key={busGroup.id} groupId={busGroup.id} />) 
          }
          )
          : <Text style={GlobalStyles.emptyList}>No groups configured yet</Text>
        }
    </ScrollView>
  );
}
