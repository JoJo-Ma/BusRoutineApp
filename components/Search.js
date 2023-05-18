import React, { useState, useContext } from "react";
import { Button, TextInput } from 'react-native-paper';
import { ApiContext } from '../contexts/ApiContext';
import { View } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";

const Search = ({ onPress }) => {
    const [text, setText] = useState('');
    const { bearer_token } = useContext(ApiContext);



    return (
        <View>
            <TextInput
                mode="outlined"
                placeholder="Search"
                onChangeText={text => setText(text)}
                value={text}
                style={GlobalStyles.mediumMargin}
            />
            <Button onPress={() => onPress(text)} mode="contained">
                Search
            </Button>
        </View>
    )


};

export default Search;