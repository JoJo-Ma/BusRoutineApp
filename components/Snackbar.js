import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';

const SnackbarComponent = ({ visible, onDismiss, caption }) => {

    return (
        <View>
            <Snackbar
                visible={visible}
                onDismiss={onDismiss}
                action={{
                    label: 'Close',
                    onPress: () => {
                        onDismiss()
                    },
                }}>
                {caption}
            </Snackbar>
        </View>
    );

}

export default SnackbarComponent;