import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import SubjectDashboardScreen from './screens/UploadSheet'; // Renamed import to reflect new screen purpose

// Define a new theme inspired by the provided UI screenshot

function App(): React.JSX.Element {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.rootContainer}>
        <StatusBar
          barStyle="dark-content" // Suitable for light backgrounds
          backgroundColor='#fff'
        />
        <SubjectDashboardScreen /> {/* Use the new component name */}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff', // Match with the theme background
  },
});

export default App;
