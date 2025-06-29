import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {Card, Title, Button, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Slider from '@react-native-community/slider';
import uploadPDF from '../utils/uploadPDF'; // Adjust import path as needed

const StudentAnswerSheetUpload = ({route, navigation}) => {
  const theme = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    strictness: 5,
  });
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateName = name => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name.trim()) return 'Name is required';
    if (!nameRegex.test(name)) return 'Name should contain only alphabets';
    if (name.trim().length < 2) return 'Name should be at least 2 characters';
    return null;
  };

  const validateRollNumber = rollNumber => {
    const rollRegex = /^[a-zA-Z0-9]+$/;
    if (!rollNumber.trim()) return 'Roll number is required';
    if (!rollRegex.test(rollNumber))
      return 'Roll number should be alphanumeric only';
    if (rollNumber.length < 3)
      return 'Roll number should be at least 3 characters';
    return null;
  };

  const validatePDF = pdf => {
    if (!pdf) return 'Please select a PDF file';
    return null;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: null}));
    }
  };

  // Handle PDF upload
  const handlePDFUpload = async () => {
    try {
      const result = await uploadPDF();
      if (result) {
        setSelectedPDF(result);
        // Clear PDF error if exists
        if (errors.pdf) {
          setErrors(prev => ({...prev, pdf: null}));
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload PDF. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all fields
    const nameError = validateName(formData.name);
    const rollError = validateRollNumber(formData.rollNumber);
    const pdfError = validatePDF(selectedPDF);

    const newErrors = {
      name: nameError,
      rollNumber: rollError,
      pdf: pdfError,
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== null);

    if (!hasErrors) {
      setIsSubmitting(true);
      try {
        // Handle form submission here
        const submissionData = {
          ...formData,
          pdf: selectedPDF,
        };

        // Your submission logic here
        console.log('Submitting:', submissionData);

        // Show success and navigate back or to next screen
        Alert.alert('Success', 'Answer sheet uploaded successfully!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } catch (error) {
        Alert.alert('Error', 'Failed to submit. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

   // Get strictness label
   const getStrictnessLabel = value => {
    if (value <= 1) return 'Very Lenient';
    if (value <= 3) return 'Lenient';
    if (value <= 7) return 'Moderate';
    if (value <= 9) return 'Strict';
    return 'Very Strict';
  };

  // Get strictness color
  const getStrictnessColor = value => {
    if (value <= 3) return '#10B981';
    if (value <= 7) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <Card style={styles.headerCard} elevation={4}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View style={styles.headerIconContainer}>
                <Icon
                  name="cloud-upload"
                  size={moderateScale(32)}
                  color="#4F46E5"
                />
              </View>
              <View style={styles.headerTextContainer}>
                <Title style={styles.headerTitle}>Upload Answer Sheet</Title>
                <Text style={styles.headerSubtitle}>
                  Submit your answer sheet for evaluation
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Form Section */}
        <Card style={styles.formCard} elevation={2}>
          <Card.Content>
            <Title style={styles.sectionTitle}>📝 Student Information</Title>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View
                style={[
                  styles.textInputContainer,
                  errors.name && styles.inputError,
                ]}>
                <Icon
                  name="person"
                  size={moderateScale(20)}
                  color="#6B7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={value => handleInputChange('name', value)}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Roll Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Roll Number</Text>
              <View
                style={[
                  styles.textInputContainer,
                  errors.rollNumber && styles.inputError,
                ]}>
                <Icon
                  name="badge"
                  size={moderateScale(20)}
                  color="#6B7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter roll number (e.g., 21PHY102)"
                  value={formData.rollNumber}
                  onChangeText={value => handleInputChange('rollNumber', value)}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                />
              </View>
              {errors.rollNumber && (
                <Text style={styles.errorText}>{errors.rollNumber}</Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* PDF Upload Section */}
        <Card style={styles.formCard} elevation={2}>
          <Card.Content>
            <Title style={styles.sectionTitle}>📄 Answer Sheet PDF</Title>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>
                📋 Upload Instructions:
              </Text>
              <View style={styles.instructionsList}>
                <Text style={styles.instructionItem}>
                  • PDF should be clear and readable
                </Text>
                <Text style={styles.instructionItem}>
                  • Maximum file size: 300MB
                </Text>
                <Text style={styles.instructionItem}>
                  • For best results, keep file size under 100MB
                </Text>
                <Text style={styles.instructionItem}>
                  • Ensure all pages are properly scanned
                </Text>
                <Text style={styles.instructionItem}>
                  • Avoid blurry or dark images
                </Text>
              </View>
            </View>

            {/* Upload Button */}
            <TouchableOpacity
              style={[
                styles.uploadButton,
                selectedPDF && styles.uploadButtonSuccess,
                errors.pdf && styles.uploadButtonError,
              ]}
              onPress={handlePDFUpload}
              activeOpacity={0.7}>
              <Icon
                name={selectedPDF ? 'check-circle' : 'cloud-upload'}
                size={moderateScale(24)}
                color={
                  selectedPDF ? '#10B981' : errors.pdf ? '#EF4444' : '#4F46E5'
                }
              />
              <Text
                style={[
                  styles.uploadButtonText,
                  selectedPDF && styles.uploadButtonTextSuccess,
                  errors.pdf && styles.uploadButtonTextError,
                ]}>
                {selectedPDF ? 'PDF Selected ✓' : 'Select PDF File'}
              </Text>
            </TouchableOpacity>

            {selectedPDF && (
              <View style={styles.selectedFileContainer}>
                <Icon
                  name="picture-as-pdf"
                  size={moderateScale(20)}
                  color="#EF4444"
                />
                <Text style={styles.selectedFileName}>
                  {selectedPDF.name || 'Selected PDF'}
                </Text>
                <Text style={styles.selectedFileSize}>
                  {selectedPDF.size
                    ? `${(selectedPDF.size / (1024 * 1024)).toFixed(2)} MB`
                    : ''}
                </Text>
              </View>
            )}

            {errors.pdf && <Text style={styles.errorText}>{errors.pdf}</Text>}
          </Card.Content>
        </Card>

        {/* Strictness Section */}
        <Card style={styles.formCard} elevation={2}>
          <Card.Content>
            <Title style={styles.sectionTitle}>⚖️ Evaluation Strictness</Title>
            <Text style={styles.sectionDescription}>
              Set how strictly you want your answer sheet to be evaluated
            </Text>

            <View style={styles.strictnessContainer}>
              <View style={styles.strictnessHeader}>
                <Text style={styles.strictnessValue}>
                  {formData.strictness}
                </Text>
                <View
                  style={[
                    styles.strictnessLabel,
                    {
                      backgroundColor: `${getStrictnessColor(
                        formData.strictness,
                      )}20`,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.strictnessLabelText,
                      {color: getStrictnessColor(formData.strictness)},
                    ]}>
                    {getStrictnessLabel(formData.strictness)}
                  </Text>
                </View>
              </View>

              <View style={styles.sliderControlContainer}>
                <TouchableOpacity
                  style={[
                    styles.sliderControlButton,
                    formData.strictness <= 1 &&
                      styles.sliderControlButtonDisabled,
                  ]}
                  onPress={() =>
                    formData.strictness > 1 &&
                    handleInputChange('strictness', formData.strictness - 1)
                  }
                  disabled={formData.strictness <= 1}
                  activeOpacity={0.7}>
                  <Icon
                    name="remove"
                    size={moderateScale(20)}
                    color={formData.strictness <= 1 ? '#9CA3AF' : '#4F46E5'}
                  />
                </TouchableOpacity>

                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={formData.strictness}
                  onValueChange={value =>
                    handleInputChange('strictness', value)
                  }
                  minimumTrackTintColor="#4F46E5"
                  maximumTrackTintColor="#E5E7EB"
                  thumbStyle={styles.sliderThumb}
                />

                <TouchableOpacity
                  style={[
                    styles.sliderControlButton,
                    formData.strictness >= 10 &&
                      styles.sliderControlButtonDisabled,
                  ]}
                  onPress={() =>
                    formData.strictness < 10 &&
                    handleInputChange('strictness', formData.strictness + 1)
                  }
                  disabled={formData.strictness >= 10}
                  activeOpacity={0.7}>
                  <Icon
                    name="add"
                    size={moderateScale(20)}
                    color={formData.strictness >= 10 ? '#9CA3AF' : '#4F46E5'}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>Lenient (1)</Text>
                <Text style={styles.sliderLabelText}>Very Strict (10)</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.submitButtonLabel}>
          {isSubmitting ? 'Uploading...' : 'Submit Answer Sheet'}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(40),
  },
  headerCard: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(20),
    borderRadius: moderateScale(16),
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    backgroundColor: '#EEF2FF',
    padding: scale(12),
    borderRadius: moderateScale(12),
    marginRight: scale(16),
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },
  formCard: {
    marginBottom: verticalScale(16),
    borderRadius: moderateScale(12),
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: verticalScale(16),
  },
  sectionDescription: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    marginBottom: verticalScale(16),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#374151',
    marginBottom: verticalScale(8),
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: scale(12),
    height: verticalScale(48),
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: scale(8),
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#1F2937',
    paddingVertical: 0,
  },
  errorText: {
    fontSize: moderateScale(12),
    color: '#EF4444',
    marginTop: verticalScale(4),
  },
  strictnessContainer: {
    // marginTop: verticalScale(8),
  },
  strictnessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  strictnessValue: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  strictnessLabel: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(12),
  },
  strictnessLabelText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  sliderControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginVertical: verticalScale(8),
  },
  sliderControlButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderControlButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  slider: {
    flex: 1,
    height: verticalScale(40),
    marginHorizontal: scale(16),
  },
  sliderThumb: {
    backgroundColor: '#4F46E5',
    width: moderateScale(20),
    height: moderateScale(20),
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(4),
  },
  sliderLabelText: {
    fontSize: moderateScale(11),
    color: '#6B7280',
  },
  instructionsContainer: {
    backgroundColor: '#F0F9FF',
    padding: scale(16),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(20),
    borderLeftWidth: 3,
    borderLeftColor: '#0EA5E9',
  },
  instructionsTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: verticalScale(8),
  },
  instructionsList: {
    marginLeft: scale(4),
  },
  instructionItem: {
    fontSize: moderateScale(12),
    color: '#0C4A6E',
    marginBottom: verticalScale(4),
    lineHeight: moderateScale(16),
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderStyle: 'dashed',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(12),
  },
  uploadButtonSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  uploadButtonError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  uploadButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: scale(8),
  },
  uploadButtonTextSuccess: {
    color: '#10B981',
  },
  uploadButtonTextError: {
    color: '#EF4444',
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: scale(12),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
  },
  selectedFileName: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#1F2937',
    marginLeft: scale(8),
  },
  selectedFileSize: {
    fontSize: moderateScale(12),
    color: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: moderateScale(12),
    // marginTop: verticalScale(20),
  },
  submitButtonContent: {
    paddingVertical: verticalScale(4),
  },
  submitButtonLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default StudentAnswerSheetUpload;
