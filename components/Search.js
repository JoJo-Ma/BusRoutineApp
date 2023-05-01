import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native";
import { Button, TextInput } from 'react-native-paper';
import { ApiContext } from '../context/ApiContext';

const Search = ({ onPress }) => {
    const [text, setText] = useState('');
    const { bearer_token } = useContext(ApiContext);



    return (
        <SafeAreaView>
            <TextInput
                placeholder="Search"
                onChangeText={text => setText(text)}
                value={text}
            />
            <Button onPress={() => onPress(text)} mode="contained">
                Search
            </Button>
        </SafeAreaView>
    )


};

export default Search;