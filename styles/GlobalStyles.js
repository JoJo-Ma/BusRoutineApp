import { StyleSheet, Platform } from 'react-native';
export default StyleSheet.create({
    droidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
    container: {
        flex: 1,
        padding: 16,
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
      largePadding: {
        padding: 16,
    },
    smallMargin: {
        margin: 4,
    },
    mediumMargin: {
        margin: 8,
    },
    largeMargin: {
        margin: 32,
    },
    borderRadius: {
        borderRadius: 5,
    },
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flexJustifySpaceBetween: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    emptyList: {
        textAlign: 'center',
        padding: 16,
        margin: 16,
    }
});