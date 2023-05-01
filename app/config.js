import { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { CLIENT_ID, CLIENT_SECRET } from "@env";
import { Link } from "expo-router";
import { List, TextInput, Button } from 'react-native-paper';
import Search from "../components/Search";
import useBearerToken from "../hooks/useBearerToken";
import axios from "axios";

const cities = [{
    name: 'Taipei',
    value: 'Taipei',
}, {
    name: 'New Taipei',
    value: 'NewTaipei',
}
]

export default function Config() {
    const [busStops, setBusStops] = useState([]);
    const [busStopFilter, setBusStopFilter] = useState('');
    const [filteredBusStops, setFilteredBusStops] = useState([]);
    const token = useBearerToken();
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const [direction, setDirection] = useState(0);
    const [selectedStop, setSelectedStop] = useState(null);
    const [estimatedTimeOfArrival, setEstimatedTimeOfArrival] = useState(null);

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

    const getStopsFromRoute = async (routeName) => {
        if (!token) {
            return;
        }
        const res = await axios.get(`https://tdx.transportdata.tw/api/basic/v2/Bus/DisplayStopOfRoute/City/${selectedCity.value}/${routeName}`,
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
        setBusStops(res.data);
        setFilteredBusStops(res.data);
    }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Config</Text>
        <List.Section title="City">
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
                    placeholder="Search"
                    onChangeText={text => handleBusStopFilter(text)}
                    value={busStopFilter}
                />
                <List.Section title="Destination">
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
                <List.Section title="Bus Stop">
                    {filteredBusStops[direction].Stops.map((stop, index) => {
                        return (
                            <List.Item
                                key={index}
                                title={stop.StopName.En}
                                onPress={() => {
                                    console.log(stop);
                                    setSelectedStop({ ...stop, RouteId: busStops[0].RouteID, RouteName: busStops[0].RouteName })
                                }}
                                style={{ backgroundColor: (selectedStop && selectedStop.StopID === stop.StopID) ? '#ccc' : '#fff' }}
                            />
                        )
                    })
                    }
                </List.Section>
                <Button onPress={() => retrieveEstimateTime()} mode="contained">
                    Retrieve EstimatedTimeOfArrival
                </Button>
                {estimatedTimeOfArrival && <Text>{Math.floor(estimatedTimeOfArrival / 60)} min</Text>}
            </>
            )
        }
        <Link href="/">Home</Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
