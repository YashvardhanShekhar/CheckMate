import React, {useState} from 'react';
import {View, FlatList, StyleSheet, Alert} from 'react-native';
import {Card, Text, Button, useTheme, Surface} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

const HomeScreen = ({navigation}) => {
  const theme = useTheme();

  // Sample data - in a real app, this would come from your state management/API
  const [answerSheets, setAnswerSheets] = useState([
    {
      id: '1',
      answerSheetName: 'Mathematics',
      creationDate: new Date('2024-12-15T10:30:00'),
    },
    {
      id: '2',
      answerSheetName: 'Physics',
      creationDate: new Date('2024-12-14T14:20:00'),
    },
    {
      id: '3',
      answerSheetName: 'Chemistry',
      creationDate: new Date('2024-12-13T09:15:00'),
    },
    {
      id: '4',
      answerSheetName: 'Biology',
      creationDate: new Date('2024-12-12T16:45:00'),
    },
    {
      id: '5',
      answerSheetName: 'English Literature',
      creationDate: new Date('2024-12-11T11:20:00'),
    },
  ]);

  // Sort answer sheets by creation date (latest first)
  const sortedAnswerSheets = [...answerSheets].sort(
    (a, b) => new Date(b.creationDate) - new Date(a.creationDate),
  );

  const handleAddPress = () => {
    // This function will be called when the add button is pressed
    Alert.alert('Add Answer Sheet', 'Navigate to add new answer sheet screen', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          // Here you would typically navigate to the add screen
          // navigation.navigate('AddAnswerSheet');
          console.log('Navigate to Add Answer Sheet screen');
        },
      },
    ]);
  };

  const formatDate = date => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const renderAddButton = () => (
    <Card
      style={[styles.card, {backgroundColor: theme.colors.primaryContainer}]}
      onPress={handleAddPress}
      mode="contained">
      <Card.Content style={styles.addCardContent}>
        <Icon
          name="add-circle"
          size={moderateScale(32)}
          color={theme.colors.primary}
          style={styles.addIcon}
        />
        <Text
          variant="titleMedium"
          style={[styles.addText, {color: theme.colors.primary}]}>
          Add Answer Sheet
        </Text>
      </Card.Content>
    </Card>
  );

  const renderAnswerSheetItem = ({item}) => (
    <Card
      style={[styles.card, {backgroundColor: theme.colors.surface}]}
      mode="contained"
      onPress={() => {
        // Handle answer sheet item press
        Alert.alert('Answer Sheet', `Open ${item.answerSheetName} answer sheet`);
      }}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleLarge" style={styles.answerSheetName}>
            {item.answerSheetName}
          </Text>
          <Icon
            name="description"
            size={moderateScale(24)}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
        <Text
          variant="bodyMedium"
          style={[styles.dateText, {color: theme.colors.onSurfaceVariant}]}>
          Created: {formatDate(item.creationDate)}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Surface
        style={[styles.surface, {backgroundColor: theme.colors.background}]}>
        <Text
          variant="headlineMedium"
          style={[styles.title, {color: theme.colors.onBackground}]}>
          Answer Sheets
        </Text>

        <FlatList
          data={[{id: 'add-button', isAddButton: true}, ...sortedAnswerSheets]}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            if (item.isAddButton) {
              return renderAddButton();
            }
            return renderAnswerSheetItem({item});
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </Surface>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  surface: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  title: {
    marginBottom: verticalScale(20),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: verticalScale(20),
  },
  card: {
    marginBottom: verticalScale(12),
    elevation: 3,
    borderRadius: moderateScale(12),
  },
  addCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
  },
  addIcon: {
    marginRight: scale(12),
  },
  addText: {
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  answerSheetName: {
    fontWeight: '600',
    flex: 1,
  },
  dateText: {
    fontSize: moderateScale(14),
    fontStyle: 'italic',
  },
});

export default HomeScreen;
