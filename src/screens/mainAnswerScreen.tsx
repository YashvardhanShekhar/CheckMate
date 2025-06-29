import React, {useState, useMemo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Card, Title, Paragraph, FAB, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {uploadPDF} from '../services/gemini';

const MainAnswerScreen = ({route, navigation}) => {
  const theme = useTheme();

  // State for search and sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'percentage'

  // Sample data - replace with props or route params
  const mainAnswerSheet = {
    name: 'Physics Final 2025',
    creationDate: '2025-05-30',
    subject: 'Physics',
    totalMarks: 20,
  };

  const studentAnswerSheets = [
    {
      id: 45,
      studentName: 'John Doe',
      rollNumber: '21PHY102',
      assignedMarks: 18,
      totalMarks: 20,
      isEvaluated: true,
    },
    {
      id: 2,
      studentName: 'Sarah Johnson',
      rollNumber: '21PHY098',
      assignedMarks: 17,
      totalMarks: 20,
      isEvaluated: true,
    },
    {
      id: 3,
      studentName: 'Michael Chen',
      rollNumber: '21PHY145',
      assignedMarks: 7,
      totalMarks: 20,
      isEvaluated: true,
    },
    {
      id: 4,
      studentName: 'Emily Rodriguez',
      rollNumber: '21PHY087',
      assignedMarks: 0,
      totalMarks: 20,
      isEvaluated: false,
    },
    {
      id: 5,
      studentName: 'David Kim',
      rollNumber: '21PHY134',
      assignedMarks: 2,
      totalMarks: 20,
      isEvaluated: true,
    },
    {
      id: 6,
      studentName: 'Anna Wilson',
      rollNumber: '21PHY156',
      assignedMarks: 15,
      totalMarks: 20,
      isEvaluated: true,
    },
  ];

  // Filter and sort students based on search query and sort preference
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = studentAnswerSheets.filter(student =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.studentName.localeCompare(b.studentName));
    } else if (sortBy === 'percentage') {
      filtered.sort((a, b) => {
        const percentageA = (a.assignedMarks / a.totalMarks) * 100;
        const percentageB = (b.assignedMarks / b.totalMarks) * 100;
        return percentageB - percentageA; // Descending order
      });
    }

    return filtered;
  }, [searchQuery, sortBy]);

  const handleEvaluateMore = async () => {
    console.log('Evaluate More button pressed');
    await uploadPDF();
    // navigation.navigate('EvaluationScreen');
  };

  const handleStudentPress = student => {
    console.log('Student pressed:', student.studentName);
    // navigation.navigate('StudentDetailScreen', { student });
  };

  const toggleSort = () => {
    setSortBy(prev => (prev === 'name' ? 'percentage' : 'name'));
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMarksColor = (marks, total) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return '#10B981'; // Green
    if (percentage >= 80) return '#F59E0B'; // Amber
    if (percentage <= 33) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const getMarksBackgroundColor = (marks, total) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return '#DCFCE7'; // Light Green
    if (percentage >= 80) return '#FEF3C7'; // Light Amber
    if (percentage <= 30) return '#FEE2E2'; // Light Red
    return '#F3F4F6'; // Light Gray
  };

  const getPercentageGrade = (marks, total) => {
    const percentage = (marks / total) * 100;
    return Math.round(percentage);
  };

  const calculateStats = () => {
    const totalStudents = studentAnswerSheets.length;
    const avgScore =
      studentAnswerSheets.reduce(
        (sum, student) =>
          sum + (student.assignedMarks / student.totalMarks) * 100,
        0,
      ) / totalStudents;
    const evaluatedCount = studentAnswerSheets.filter(
      s => s.isEvaluated,
    ).length;

    return {totalStudents, avgScore: Math.round(avgScore), evaluatedCount};
  };

  const stats = calculateStats();

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
                <Title style={styles.headerTitle}>{mainAnswerSheet.name}</Title>
                <View style={styles.headerMetadata}>
                  <Text style={styles.metadataText}>
                    📅 Created: {formatDate(mainAnswerSheet.creationDate)}
                  </Text>
                  <Text style={styles.metadataText}>
                    📊 Total Marks: {mainAnswerSheet.totalMarks}
                  </Text>
                </View>
              </View>
            </View>

            <Title style={styles.statsTitle}>📊 Quick Statistics</Title>
            <View style={styles.statsContainer}>
              <View style={[styles.statItem, styles.statPrimary]}>
                <Text style={styles.statNumber}>{stats.totalStudents}</Text>
                <Text style={styles.statLabel}>Total Students</Text>
              </View>
              <View style={[styles.statItem, styles.statSuccess]}>
                <Text style={styles.statNumber}>{stats.avgScore}%</Text>
                <Text style={styles.statLabel}>Average Score</Text>
              </View>
              <View style={[styles.statItem, styles.statAccent]}>
                <Text style={styles.statNumber}>{stats.evaluatedCount}</Text>
                <Text style={styles.statLabel}>Evaluated</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Search and Sort Section */}
        <Card style={styles.controlsCard} elevation={2}>
          <Card.Content>
            <View style={styles.controlsContainer}>
              {/* Search Box */}
              <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                  <Icon
                    name="search"
                    size={moderateScale(20)}
                    color="#6B7280"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#9CA3AF"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={clearSearch}
                      style={styles.clearButton}>
                      <Icon
                        name="clear"
                        size={moderateScale(18)}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Sort Toggle Button */}
              <TouchableOpacity
                style={styles.sortButton}
                onPress={toggleSort}
                activeOpacity={0.7}>
                <Icon
                  name={sortBy === 'name' ? 'sort-by-alpha' : 'trending-down'}
                  size={moderateScale(20)}
                  color="#4F46E5"
                />
                <Text style={styles.sortButtonText}>
                  {sortBy === 'name' ? 'Name' : 'Score'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Students List Section */}
        <View style={styles.listContainer}>
          <Title style={styles.sectionTitle}>
            👥 Student Evaluations ({filteredAndSortedStudents.length})
          </Title>

          {filteredAndSortedStudents.length === 0 ? (
            <Card style={styles.emptyStateCard} elevation={1}>
              <Card.Content>
                <View style={styles.emptyStateContainer}>
                  <Icon
                    name="search-off"
                    size={moderateScale(48)}
                    color="#9CA3AF"
                  />
                  <Text style={styles.emptyStateText}>
                    No students found matching "{searchQuery}"
                  </Text>
                  <TouchableOpacity
                    onPress={clearSearch}
                    style={styles.clearSearchButton}>
                    <Text style={styles.clearSearchButtonText}>
                      Clear Search
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
          ) : (
            filteredAndSortedStudents.map(student => (
              <TouchableOpacity
                key={student.id}
                onPress={() => handleStudentPress(student)}
                activeOpacity={0.7}>
                <Card style={styles.studentCard} elevation={2}>
                  <Card.Content>
                    <View style={styles.studentCardContent}>
                      <View style={styles.studentInfo}>
                        <View style={styles.studentIconContainer}>
                          <Icon
                            name={
                              student.isEvaluated
                                ? 'check-circle'
                                : 'assignment'
                            }
                            size={moderateScale(24)}
                            color={student.isEvaluated ? '#10B981' : '#6B7280'}
                          />
                        </View>
                        <View style={styles.studentDetails}>
                          <Text style={styles.studentName}>
                            {student.studentName}
                          </Text>
                          <Text style={styles.rollNumber}>
                            Roll No: {student.rollNumber}
                          </Text>
                          <View style={styles.statusContainer}></View>
                        </View>
                      </View>

                      {student.isEvaluated ? (
                        <View style={styles.marksContainer}>
                          <View
                            style={[
                              styles.marksBox,
                              {
                                backgroundColor: getMarksBackgroundColor(
                                  student.assignedMarks,
                                  student.totalMarks,
                                ),
                              },
                            ]}>
                            <Text
                              style={[
                                styles.marksText,
                                {
                                  color: getMarksColor(
                                    student.assignedMarks,
                                    student.totalMarks,
                                  ),
                                },
                              ]}>
                              {student.assignedMarks}/{student.totalMarks}
                            </Text>
                          </View>
                          <Text style={styles.percentageText}>
                            {getPercentageGrade(
                              student.assignedMarks,
                              student.totalMarks,
                            )}
                            %
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.statusBadge,
                            student.isEvaluated
                              ? styles.statusEvaluated
                              : styles.statusPending,
                          ]}>
                          <Text
                            style={[
                              styles.statusText,
                              student.isEvaluated
                                ? styles.statusTextEvaluated
                                : styles.statusTextPending,
                            ]}>
                            {student.isEvaluated ? 'Evaluated' : 'Pending'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        label="Evaluate More"
        onPress={handleEvaluateMore}
        color="#FFFFFF"
        customSize={moderateScale(56)}
      />
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
    paddingBottom: verticalScale(100),
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
    alignItems: 'flex-start',
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
    marginBottom: verticalScale(8),
  },
  headerMetadata: {
    marginBottom: verticalScale(12),
  },
  metadataText: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    marginBottom: verticalScale(4),
  },
  subjectTag: {
    backgroundColor: '#00F5D4',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(12),
    alignSelf: 'flex-start',
  },
  subjectText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#1F2937',
  },
  statsCard: {
    marginBottom: verticalScale(20),
    borderRadius: moderateScale(12),
    backgroundColor: '#FFFFFF',
  },
  statsTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: verticalScale(16),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: scale(16),
    borderRadius: moderateScale(8),
    marginHorizontal: scale(4),
  },
  statPrimary: {
    backgroundColor: '#EEF2FF',
  },
  statSuccess: {
    backgroundColor: '#F0FDF4',
  },
  statAccent: {
    backgroundColor: '#F0FDFA',
  },
  statNumber: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: moderateScale(11),
    color: '#6B7280',
    textAlign: 'center',
  },
  // New styles for controls section
  controlsCard: {
    marginBottom: verticalScale(20),
    borderRadius: moderateScale(12),
    backgroundColor: '#FFFFFF',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  searchContainer: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: scale(12),
    height: verticalScale(44),
  },
  searchIcon: {
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#1F2937',
    paddingVertical: 0,
  },
  clearButton: {
    padding: scale(4),
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  sortButtonText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: scale(6),
  },
  // Empty state styles
  emptyStateCard: {
    borderRadius: moderateScale(12),
    backgroundColor: '#FFFFFF',
    marginBottom: verticalScale(16),
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(32),
  },
  emptyStateText: {
    fontSize: moderateScale(16),
    color: '#6B7280',
    textAlign: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(20),
  },
  clearSearchButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(8),
  },
  clearSearchButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  listContainer: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(4),
  },
  studentCard: {
    marginBottom: verticalScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  studentCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  rollNumber: {
    fontSize: moderateScale(14),
    color: '#6B7280',
    marginBottom: verticalScale(6),
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(8),
  },
  statusEvaluated: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
  statusTextEvaluated: {
    color: '#065F46',
  },
  statusTextPending: {
    color: '#92400E',
  },
  marksContainer: {
    alignItems: 'center',
    minWidth: scale(70),
  },
  marksBox: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(4),
  },
  marksText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: moderateScale(11),
    color: '#6B7280',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: scale(16),
    right: 0,
    bottom: 0,
    backgroundColor: '#4F46E5',
    borderRadius: moderateScale(28),
  },
});

export default MainAnswerScreen;
