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
import {pick} from '@react-native-documents/picker';

const NewQuestionPaperUpload = ({route, navigation}) => {
  const theme = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    subjectCode: '',
  });
  const [selectedQuestionPDF, setSelectedQuestionPDF] = useState(null);
  const [selectedMarkingSchemePDF, setSelectedMarkingSchemePDF] =
    useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateSubjectCode = subjectCode => {
    if (!subjectCode.trim()) return 'Subject/Paper code is required';
    if (subjectCode.trim().length < 2)
      return 'Subject code should be at least 2 characters';
    return null;
  };

  const validateQuestionPDF = pdf => {
    if (!pdf) return 'Please select a Question Paper PDF';
    return null;
  };

  const validateMarkingSchemePDF = pdf => {
    if (!pdf) return 'Please select a Marking Scheme PDF';
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

  // Handle PDF upload for Question Paper
  const handleQuestionPDFUpload = async () => {
    if (selectedQuestionPDF) {
      Alert.alert(
        'Info',
        'Please remove the current file before selecting a new one.',
      );
      return;
    }

    try {
      const [file] = await pick({type: 'application/pdf'});
      console.log(file)
      if (file) {
        setSelectedQuestionPDF(file);
        // Clear PDF error if exists
        if (errors.questionPdf) {
          setErrors(prev => ({...prev, questionPdf: null}));
        }
      }
    } catch (error) {
      if (error.code !== 'DOCUMENT_PICKER_CANCELED') {
        Alert.alert(
          'Error',
          'Failed to select Question Paper PDF. Please try again.',
        );
      }
    }
  };

  // Handle PDF upload for Marking Scheme
  const handleMarkingSchemePDFUpload = async () => {
    if (selectedMarkingSchemePDF) {
      Alert.alert(
        'Info',
        'Please remove the current file before selecting a new one.',
      );
      return;
    }

    try {
      const [file] = await pick({type: 'application/pdf'});
      if (file) {
        setSelectedMarkingSchemePDF(file);
        // Clear PDF error if exists
        if (errors.markingSchemePdf) {
          setErrors(prev => ({...prev, markingSchemePdf: null}));
        }
      }
    } catch (error) {
      if (error.code !== 'DOCUMENT_PICKER_CANCELED') {
        Alert.alert(
          'Error',
          'Failed to select Marking Scheme PDF. Please try again.',
        );
      }
    }
  };

  // Handle removing Question Paper PDF
  const handleRemoveQuestionPDF = () => {
    setSelectedQuestionPDF(null);
  };

  // Handle removing Marking Scheme PDF
  const handleRemoveMarkingSchemePDF = () => {
    setSelectedMarkingSchemePDF(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all fields
    const subjectCodeError = validateSubjectCode(formData.subjectCode);
    const questionPdfError = validateQuestionPDF(selectedQuestionPDF);
    const markingSchemePdfError = validateMarkingSchemePDF(
      selectedMarkingSchemePDF,
    );

    const newErrors = {
      subjectCode: subjectCodeError,
      questionPdf: questionPdfError,
      markingSchemePdf: markingSchemePdfError,
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
          questionPdf: selectedQuestionPDF,
          markingSchemePdf: selectedMarkingSchemePDF,
        };

        // Your submission logic here
        console.log('Submitting:', submissionData);

        // Show success and navigate back or to next screen
        Alert.alert(
          'Success',
          'Question paper and marking scheme uploaded successfully!',
          [{text: 'OK', onPress: () => navigation.goBack()}],
        );
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

  // Render PDF upload section
  const renderPDFUploadSection = (
    title,
    selectedPDF,
    onUpload,
    onRemove,
    errorKey,
    instructions,
  ) => (
    <Card style={styles.formCard} elevation={2}>
      <Card.Content>
        <Title style={styles.sectionTitle}>{title}</Title>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>📋 Upload Instructions:</Text>
          <View style={styles.instructionsList}>
            {instructions.map((instruction, index) => (
              <Text key={index} style={styles.instructionItem}>
                • {instruction}
              </Text>
            ))}
          </View>
        </View>

        {/* Upload Button */}
        {!selectedPDF && (
          <TouchableOpacity
            style={[
              styles.uploadButton,
              selectedPDF && styles.uploadButtonSuccess,
              errors[errorKey] && styles.uploadButtonError,
            ]}
            onPress={onUpload}
            activeOpacity={0.7}>
            <Icon
              name={selectedPDF ? 'check-circle' : 'cloud-upload'}
              size={moderateScale(24)}
              color={
                selectedPDF
                  ? '#10B981'
                  : errors[errorKey]
                  ? '#EF4444'
                  : '#4F46E5'
              }
            />
            <Text
              style={[
                styles.uploadButtonText,
                selectedPDF && styles.uploadButtonTextSuccess,
                errors[errorKey] && styles.uploadButtonTextError,
              ]}>
              {selectedPDF ? 'PDF Selected ✓' : 'Select PDF File'}
            </Text>
          </TouchableOpacity>
        )}

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
            <TouchableOpacity
              style={styles.removeButton}
              onPress={onRemove}
              activeOpacity={0.7}>
              <Icon name="close" size={moderateScale(18)} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        {errors[errorKey] && (
          <Text style={styles.errorText}>{errors[errorKey]}</Text>
        )}
      </Card.Content>
    </Card>
  );

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
                  name="assignment"
                  size={moderateScale(32)}
                  color="#4F46E5"
                />
              </View>
              <View style={styles.headerTextContainer}>
                <Title style={styles.headerTitle}>New Question Paper</Title>
                <Text style={styles.headerSubtitle}>
                  Upload question paper and marking scheme
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Subject Code Section */}
        <Card style={styles.formCard} elevation={2}>
          <Card.Content>
            <Title style={styles.sectionTitle}>📚 Paper Information</Title>

            {/* Subject Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Subject/Paper Code</Text>
              <View
                style={[
                  styles.textInputContainer,
                  errors.subjectCode && styles.inputError,
                ]}>
                <Icon
                  name="school"
                  size={moderateScale(20)}
                  color="#6B7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., math-feb-25, PHY101, CS-Mid-2024"
                  value={formData.subjectCode}
                  onChangeText={value =>
                    handleInputChange('subjectCode', value)
                  }
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.subjectCode && (
                <Text style={styles.errorText}>{errors.subjectCode}</Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Question Paper PDF Upload Section */}
        {renderPDFUploadSection(
          '📄 Question Paper PDF',
          selectedQuestionPDF,
          handleQuestionPDFUpload,
          handleRemoveQuestionPDF,
          'questionPdf',
          [
            'PDF should be clear and readable',
            'Maximum file size: 300MB',
            'For best results, keep file size under 100MB',
            'Ensure all pages are properly scanned',
            'Avoid blurry or dark images',
          ],
        )}

        {/* Marking Scheme PDF Upload Section */}
        {renderPDFUploadSection(
          '✅ Marking Scheme PDF',
          selectedMarkingSchemePDF,
          handleMarkingSchemePDFUpload,
          handleRemoveMarkingSchemePDF,
          'markingSchemePdf',
          [
            'This could be an ideal answer sheet or model answer sheet',
            'Should contain detailed marking criteria',
            'PDF should be clear and readable',
            'Maximum file size: 300MB',
            'For best results, keep file size under 100MB',
          ],
        )}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.submitButtonLabel}>
          {isSubmitting ? 'Uploading...' : 'Upload Question Paper'}
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
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  removeButton: {
    padding: scale(4),
    marginLeft: scale(8),
    borderRadius: moderateScale(12),
    backgroundColor: '#FEF2F2',
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

export default NewQuestionPaperUpload;
