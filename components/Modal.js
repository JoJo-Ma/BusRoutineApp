import { Modal, Portal, Text, Button, Provider } from 'react-native-paper';

const ModalComponent = ({ visible, hideModal, action }) => {

    const containerStyle = {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
    };

    return (
        // <Provider>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}
                >
                    <Text>Example Modal</Text>
                    <Button onPress={action}>Yes</Button>
                    <Button onPress={hideModal}>No</Button>
                </Modal>
            </Portal>
        // </Provider>
    )

}

export { ModalComponent };