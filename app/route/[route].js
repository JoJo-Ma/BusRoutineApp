import { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { CLIENT_ID, CLIENT_SECRET } from "@env";
import { Link, useSearchParams } from "expo-router";
import { List, TextInput, Button, Divider } from 'react-native-paper';
// import Search from "../../components/Search";
import useBearerToken from "../../hooks/useBearerToken";
import axios from "axios";
import { BusGroupsContext, BusGroupsDispatchContext } from "../../contexts/BusGroupsContext";
import SnackbarComponent from "../../components/Snackbar";
import GlobalStyles from "../../styles/GlobalStyles";
import Search from "../../components/Search";
import Theme from "../../styles/Theme";

const cities = [{
    name: 'Taipei',
    value: 'Taipei',
}, {
    name: 'New Taipei',
    value: 'NewTaipei',
}
]

export default function Route() {
    const [busGroup, setBusGroup] = useState(null);
    const [busStops, setBusStops] = useState([]);
    const [busStopFilter, setBusStopFilter] = useState('');
    const [filteredBusStops, setFilteredBusStops] = useState([]);
    const token = useBearerToken();
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const [direction, setDirection] = useState(0);
    const [selectedStop, setSelectedStop] = useState(null);
    const [estimatedTimeOfArrival, setEstimatedTimeOfArrival] = useState(null);
    const { route } = useSearchParams();
    const { busGroups } = useContext(BusGroupsContext);
    const busGroupsDispatch = useContext(BusGroupsDispatchContext);
    const [snackbarVisible, setSnackbarVisible] = useState(false);


    const handleCityChosen = (city) => {
        setSelectedCity(city);
    }

    const handleBusStopFilter = (text) => {
        setSelectedStop(null);
        setBusStopFilter(text);
        const filtered = busStops.map((busStopDirection) => {
            return {
                ...busStopDirection,
                Stops: busStopDirection.Stops.filter((stop) => {
                    return stop.StopName.En.toLowerCase().includes(text.toLowerCase());
                }),
                }
            }
            );
        setFilteredBusStops(filtered);
    }

    const retrieveEstimateTime = async () => {
        if (!token) {
            return;
        }
        console.log(selectedStop);
        const res = await axios.get(`https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/${selectedCity.value}/${selectedStop.RouteName.En}`,
        {
            params: {
                $format: 'JSON',
                $top: 30,
                $filter: `RouteID eq '${selectedStop.RouteId}' and StopId eq '${selectedStop.StopID}'`,
            },
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        console.log(res.data);
        setEstimatedTimeOfArrival(res.data[0].EstimateTime);
    }

    const getStopsFromRoute = async (routeName, city) => {
        city = city || selectedCity;
        if (!token) {
            return;
        }
        const res = await axios.get(`https://tdx.transportdata.tw/api/basic/v2/Bus/DisplayStopOfRoute/City/${city.value}/${routeName}`,
        {
            params: {
                $format: 'JSON',
                $top: 30,
                $filter: `RouteName/Zh_tw eq '${routeName}'`,
            },
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        console.log(res.data);
        setFilteredBusStops(res.data);
        setBusStops(res.data);
    }

    const confirmBusRoute = () => {
        busGroupsDispatch({
            type: 'SET_BUS_GROUP_BUS_ROUTE',
            payload: {
                id: busGroup.id,
                busRouteId: route,
                busRoute: {
                    ...selectedStop,
                    city: selectedCity,
                },
            }
        })
        setSnackbarVisible(true);
    }

    useEffect(() => {
        if (route && busGroups && !busGroup) {
            for (let i = 0; i < busGroups.length; i++) {
                const busGroup = busGroups[i];
                for (let j = 0; j < busGroup.data.length; j++) {
                    const busRoute = busGroup.data[j];
                    console.log(busRoute);
                    if (busRoute.id === route) {
                        setBusGroup(busGroup);
                        if (busRoute.busRoute) {
                            setSelectedCity(busRoute.busRoute.city)
                            getStopsFromRoute(busRoute.busRoute.RouteName.En, busRoute.busRoute.city);
                        }
                    }
                }
            }
        }
    }, [route, busGroups])



  return (
    <ScrollView style={GlobalStyles.container}>
      <View style={GlobalStyles.main}>
        <List.Section titleStyle={{ color: Theme.colors.primary }}title="City">
            {cities.map((city, index) => {
                return (
                    <List.Item
                        key={index}
                        title={city.name}
                        onPress={() => handleCityChosen(city)}
                        style={{ backgroundColor: selectedCity.name === city.name ? '#ccc' : '#fff' }}
                    />
                )
            }
            )
            }
        </List.Section>
        <Search onPress={getStopsFromRoute} />
        {
            busStops.length > 0 &&
            (   
            <>
                <TextInput
                    label='Filter Bus Stop'
                    mode='outlined'
                    placeholder="Search"
                    onChangeText={text => handleBusStopFilter(text)}
                    value={busStopFilter}
                    style={GlobalStyles.mediumMargin}
                    
                />
                <List.Section title="Destination" titleStyle={{ color: Theme.colors.primary }}>
                    <List.Item
                        key={0}
                        title={busStops[0].Stops[busStops[0].Stops.length - 1].StopName.En}
                        onPress={() => setDirection(0)}
                        style={{ backgroundColor: direction === 0 ? '#ccc' : '#fff' }}
                    />
                    <List.Item
                        key={1}
                        title={busStops[1].Stops[busStops[1].Stops.length - 1].StopName.En}
                        onPress={() => setDirection(1)}
                        style={{ backgroundColor: direction === 1 ? '#ccc' : '#fff' }}
                    />
                </List.Section>
                <List.Section title="Bus Stop" titleStyle={{ color: Theme.colors.primary }}>
                    {filteredBusStops[direction].Stops.map((stop, index) => {
                        return (
                            <View key={index}>
                                <List.Item
                                    title={stop.StopName.En}
                                    onPress={() => {
                                        console.log(stop);
                                        setSelectedStop({ ...stop, RouteId: busStops[0].RouteID, RouteName: busStops[0].RouteName })
                                    }}
                                    style={{ backgroundColor: (selectedStop && selectedStop.StopID === stop.StopID) ? '#ccc' : '#fff' }}
                                />
                                <Divider />
                            </View>
                        )
                    })
                    }
                </List.Section>
                <Button onPress={() => retrieveEstimateTime()} mode="contained">
                    Retrieve EstimatedTimeOfArrival
                </Button>
                {estimatedTimeOfArrival && <Text>{Math.floor(estimatedTimeOfArrival / 60)} min</Text>}
                <Button
                    disabled={!selectedStop}
                    onPress={() => { confirmBusRoute() }} mode="contained"
                >
                    Confirm
                </Button>
                <SnackbarComponent
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    caption="Bus route added to group"
                />
            </>
            )
        }
        {
            busGroup &&
            <Link
                href={`/groups/${busGroup.id}`}
                style={[GlobalStyles.mediumMargin, { paddingTop: 20 }]}
            >Back</Link>
        }
      </View>
        <View
            style={{
                margin: 40,
            }}
        ></View>
    </ScrollView>
  );
}

