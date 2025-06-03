import React, {useState} from 'react';
import {ScrollView, View, StyleSheet, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {
  TextInput,
  Button,
  Menu,
  Divider,
  Text,
  Card,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';

// EduTech Theme Configuration
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4F46E5',
    accent: '#00F5D4',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#1F2937',
    placeholder: '#9CA3AF',
  },
};

const registrationScreen = () => {
  const [educationLevel, setEducationLevel] = useState('');
  const [field, setField] = useState('');
  const [description, setDescription] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const educationOptions = [
    {label: '5th or Below 5th', value: 'below_5th'},
    {label: '9th or Below 9th', value: 'below_9th'},
    {label: '12th or Below 12th', value: 'below_12th'},
    {label: 'Under Graduation', value: 'graduation'},
    {label: 'Post Graduation', value: 'post_graduation'},
  ];

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleEducationSelect = (value, label) => {
    setEducationLevel(label);
    closeMenu();
  };

  const handleContinuePress = () => {
    if (!educationLevel) {
      Alert.alert(
        'Required Field',
        'Please select your education level to continue.',
      );
      return;
    }

    if (!field.trim()) {
      Alert.alert(
        'Required Field',
        'Please enter your field or subject to continue.',
      );
      return;
    }

    // Handle navigation or data submission here
    console.log({
      educationLevel,
      field: field.trim(),
      description: description.trim(),
    });

    Alert.alert('Success', 'Information saved successfully!');
  };

  return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Tell us about Students</Text>
              <Text style={styles.subtitle}>
                Help us personalize your experience
              </Text>
            </View>

            {/* Education Level Dropdown */}
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.label}>What is your teaching level ?</Text>
                <Menu
                  visible={menuVisible}
                  onDismiss={closeMenu}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={openMenu}
                      style={styles.dropdown}
                      contentStyle={styles.dropdownContent}
                      labelStyle={styles.dropdownLabel}
                      icon={({size, color}) => (
                        <Icon
                          name="keyboard-arrow-down"
                          size={size}
                          color={color}
                        />
                      )}>
                      {educationLevel || 'Select your student\'s level'}
                    </Button>
                  }
                  contentStyle={styles.menuContent}>
                  {educationOptions.map(option => (
                    <Menu.Item
                      key={option.value}
                      onPress={() =>
                        handleEducationSelect(option.value, option.label)
                      }
                      title={option.label}
                      titleStyle={styles.menuItemTitle}
                    />
                  ))}
                </Menu>
              </Card.Content>
            </Card>

            {/* Field/Subject Input */}
            <Card style={styles.card}>
              <Card.Content>
                <TextInput
                  label="What is your field or subject?"
                  placeholder="e.g., Science, History, Computer Science"
                  value={field}
                  onChangeText={setField}
                  mode="outlined"
                  style={styles.textInput}
                  theme={theme}
                  left={<TextInput.Icon icon="school" />}
                />
              </Card.Content>
            </Card>

            {/* Description Input */}
            <Card style={styles.card}>
              <Card.Content>
                <TextInput
                  label="Tell us more about it (optional)"
                  placeholder="Describes the field or subject"
                  value={description}
                  onChangeText={setDescription}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={styles.textInput}
                  theme={theme}
                  left={<TextInput.Icon icon="text-box" />}
                />
              </Card.Content>
            </Card>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleContinuePress}
                style={styles.continueButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon="arrow-right">
                Continue
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(16),
    paddingBottom: verticalScale(24),
  },
  header: {
    marginBottom: verticalScale(24),
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    // color: '#1F2937',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: moderateScale(16),
    // color: '#6B7280',
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  card: {
    marginBottom: verticalScale(16),
    // elevation: 2,
    borderRadius: moderateScale(12),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    // color: '#1F2937',
    marginBottom: verticalScale(12),
  },
  dropdown: {
    borderRadius: moderateScale(8),
    // borderColor: '#D1D5DB',
  },
  dropdownContent: {
    height: verticalScale(48),
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
  },
  dropdownLabel: {
    fontSize: moderateScale(16),
    textAlign: 'left',
    flex: 1,
  },
  menuContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(8),
    marginTop: verticalScale(8),
  },
  menuItemTitle: {
    fontSize: moderateScale(16),
    // color: '#1F2937',
  },
  textInput: {
    fontSize: moderateScale(16),
    // backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: verticalScale(24),
    paddingHorizontal: scale(8),
  },
  continueButton: {
    borderRadius: moderateScale(12),
    elevation: 3,
  },
  buttonContent: {
    height: verticalScale(48),
    flexDirection: 'row-reverse',
  },
  buttonLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default registrationScreen;
