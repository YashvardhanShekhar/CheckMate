import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import SubjectDashboardScreen from './screens/UploadSheet'; // Renamed import to reflect new screen purpose
import {EduTechTheme} from './Theme/EduTechTheme';
import HomeScreen from './screens/HomeScreen';
import RegistrationScreen from './screens/registrationScreen';
import MainAnswerScreen from './screens/mainAnswerScreen';
import StudentAnswerSheetUpload from './screens/studentAnswerUploadScreen';
import NewQuestionPaperUpload from './screens/newExamPaperScreen';

// Define a new theme inspired by the provided UI screenshot



function App(): React.JSX.Element {
  return (
    <PaperProvider theme={EduTechTheme}>
      <SafeAreaView style={styles.rootContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <NewQuestionPaperUpload /> {/* Use the new component name */}
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
