import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  FormTextInput,
  FormDatePicker,
  FormDropdown,
  FormToggle,
} from '../achievement/FormComponents';
import { CertificateUploadRecord } from '../../data/facultyPortalMockData';

interface FacultyAddAchievementProps {
  onGoBack: () => void;
  onAdd: (record: CertificateUploadRecord) => void;
}

type StepType = 'category' | 'type' | 'details' | 'proof' | 'review';

export default function FacultyAddAchievement({
  onGoBack,
  onAdd,
}: FacultyAddAchievementProps) {
  const [currentStep, setCurrentStep] = useState<StepType>('category');

  // Step 1: Category Selector
  const [category, setCategory] = useState('');

  // Step 2: Achievement Type Selector
  const [achievementType, setAchievementType] = useState('');

  // Step 3: Achievement details
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventDate, setEventDate] = useState('2026-08-22');
  const [level, setLevel] = useState('Regional');
  const [result, setResult] = useState('Winner');
  const [participation, setParticipation] = useState('Individual');
  const [teamRole, setTeamRole] = useState('Team Member');
  const [teamMembers, setTeamMembers] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  
  // Cash prize conditional fields
  const [cashPrize, setCashPrize] = useState('no');
  const [cashPrizeAmount, setCashPrizeAmount] = useState('');
  
  // Category-specific conditional fields
  const [publicationDetails, setPublicationDetails] = useState('');
  const [patentDetails, setPatentDetails] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [platform, setPlatform] = useState('');

  // Step 4: Proof
  const [proofFileName, setProofFileName] = useState('');
  const [geotagFileName, setGeotagFileName] = useState('');
  const [prizeProofFileName, setPrizeProofFileName] = useState('');

  // Category and types lists
  const categoriesList = [
    'Technical & Professional / Innovation',
    'Sports & Games',
    'Certifications & Online Learning',
    'Cultural & Co-Curricular',
    'Research, Publication & Intellectual Property',
    'Social Impact & Community Service',
    'Awards, Honors & Recognition',
    'Entrepreneurship & Startup',
    'Leadership & Student Responsibility',
  ];

  const getAchievementTypes = (cat: string) => {
    switch (cat) {
      case 'Technical & Professional / Innovation':
        return ['Hackathon', 'Coding Competition', 'Project Display', 'Technical Symposium'];
      case 'Sports & Games':
        return ['Zone Tournament', 'State Meet', 'National Level Tournament', 'Inter-College Match'];
      case 'Certifications & Online Learning':
        return ['NPTEL Course', 'Coursera Certification', 'Udemy Bootcamp', 'Industrial Training'];
      case 'Research, Publication & Intellectual Property':
        return ['Journal Paper', 'Conference Proceeding', 'Patent Filed', 'Patent Granted'];
      default:
        return ['Award', 'Recognition Certificate', 'Participation Certificate'];
    }
  };

  const isOffline = () => {
    // Offline location and geotagged photos are required for events that happen physically
    return (
      category === 'Technical & Professional / Innovation' ||
      category === 'Sports & Games' ||
      category === 'Cultural & Co-Curricular'
    );
  };

  const handleNext = () => {
    if (currentStep === 'category') {
      if (!category) {
        Alert.alert('Required', 'Please select an achievement category.');
        return;
      }
      setCurrentStep('type');
    } else if (currentStep === 'type') {
      if (!achievementType) {
        Alert.alert('Required', 'Please select an achievement type.');
        return;
      }
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      if (!title.trim()) {
        Alert.alert('Required', 'Please enter the achievement title.');
        return;
      }
      if (!organizer.trim()) {
        Alert.alert('Required', 'Please enter the organizer / institution.');
        return;
      }
      setCurrentStep('proof');
    } else if (currentStep === 'proof') {
      if (!proofFileName) {
        Alert.alert('Required', 'Please upload your primary achievement certificate.');
        return;
      }
      if (isOffline() && !location.trim()) {
        Alert.alert('Required', 'Please specify the event location.');
        return;
      }
      if (isOffline() && !geotagFileName) {
        Alert.alert('Required', 'Please attach a geotagged photo for physical location proof.');
        return;
      }
      if (cashPrize === 'yes' && !prizeProofFileName) {
        Alert.alert('Required', 'Please attach proof for the cash prize award.');
        return;
      }
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'category') onGoBack();
    else if (currentStep === 'type') setCurrentStep('category');
    else if (currentStep === 'details') setCurrentStep('type');
    else if (currentStep === 'proof') setCurrentStep('details');
    else if (currentStep === 'review') setCurrentStep('proof');
  };

  const handleSubmit = () => {
    const newRecord: CertificateUploadRecord = {
      id: `FAC-ACH-${Date.now()}`,
      category,
      achievementType,
      title,
      level,
      organizer,
      eventDate,
      proofFileName,
      uploadedBy: 'Faculty',
      status: 'Pending',
      timestamp: new Date().toISOString(),
      points: 0,
    };
    onAdd(newRecord);
    Alert.alert('Achievement Submitted', 'Your achievement has been submitted successfully.', [
      {
        text: 'OK',
        onPress: onGoBack,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Achievement</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Dynamic Stepper Indicators */}
        <View style={styles.stepperContainer}>
          {['category', 'type', 'details', 'proof', 'review'].map((step, idx) => {
            const steps = ['category', 'type', 'details', 'proof', 'review'];
            const activeIdx = steps.indexOf(currentStep);
            const isCompleted = idx < activeIdx;
            const isActive = idx === activeIdx;

            return (
              <View key={step} style={styles.stepIndicatorWrapper}>
                <View
                  style={[
                    styles.stepIndicatorCircle,
                    isActive && styles.stepCircleActive,
                    isCompleted && styles.stepCircleCompleted,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepIndicatorText,
                        isActive && styles.stepTextActive,
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>
                {idx < 4 && (
                  <View
                    style={[
                      styles.stepperConnector,
                      idx < activeIdx && styles.connectorActive,
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Scroll Form Container */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* STEP 1: Select Category */}
          {currentStep === 'category' && (
            <View style={styles.formCard}>
              <Text style={styles.stepTitle}>Upload Your Achievement</Text>
              <Text style={styles.stepSubtitle}>
                Add your verified achievements, certificates and professional accomplishments to your AchieveX profile.
              </Text>
              <FormDropdown
                label="Select Category"
                value={category}
                options={categoriesList}
                onSelect={(val) => {
                  setCategory(val);
                  setAchievementType('');
                }}
                placeholder="Choose a category..."
                required
              />
            </View>
          )}

          {/* STEP 2: Select Achievement Type */}
          {currentStep === 'type' && (
            <View style={styles.formCard}>
              <Text style={styles.stepTitle}>Achievement Type</Text>
              <Text style={styles.stepSubtitle}>Choose the type of achievement under {category}:</Text>
              <FormDropdown
                label="Select Type"
                value={achievementType}
                options={getAchievementTypes(category)}
                onSelect={setAchievementType}
                placeholder="Choose achievement type..."
                required
              />
            </View>
          )}

          {/* STEP 3: Achievement details */}
          {currentStep === 'details' && (
            <View style={styles.formCard}>
              <Text style={styles.stepTitle}>Achievement Information</Text>
              <Text style={styles.stepSubtitle}>Enter details for: {achievementType}</Text>

              <FormTextInput
                label="Achievement Title"
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Oracle Cloud Certified Expert"
                required
              />

              <FormTextInput
                label="Organizer / Institution"
                value={organizer}
                onChangeText={setOrganizer}
                placeholder="e.g. Oracle University"
                required
              />

              <View style={styles.inlineRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <FormDatePicker
                    label="Event Date"
                    value={eventDate}
                    onChangeText={setEventDate}
                    required
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormDropdown
                    label="Level"
                    value={level}
                    options={['District', 'Zone', 'Regional', 'State', 'National', 'International']}
                    onSelect={setLevel}
                    placeholder="Select Level..."
                  />
                </View>
              </View>

              <FormDropdown
                label="Result / Outcome"
                value={result}
                options={['Winner', 'Runner-Up', 'First Place', 'Second Place', 'Participation', 'Completed', 'Granted']}
                onSelect={setResult}
                placeholder="Select Result..."
              />

              {/* Conditional Field: Location (Physical events only) */}
              {isOffline() && (
                <FormTextInput
                  label="Event Location / Venue"
                  value={location}
                  onChangeText={setLocation}
                  placeholder="e.g. Erode"
                  required
                />
              )}

              {/* Conditional Fields: Certifications specific */}
              {category === 'Certifications & Online Learning' && (
                <>
                  <FormTextInput
                    label="Platform"
                    value={platform}
                    onChangeText={setPlatform}
                    placeholder="e.g. NPTEL / Coursera"
                  />
                  <FormTextInput
                    label="Credential URL"
                    value={credentialUrl}
                    onChangeText={setCredentialUrl}
                    placeholder="https://credentials.oracle.com/..."
                    keyboardType="url"
                  />
                </>
              )}

              {/* Conditional Fields: Publications specific */}
              {achievementType === 'Journal Paper' && (
                <FormTextInput
                  label="Journal/Volume Details"
                  value={publicationDetails}
                  onChangeText={setPublicationDetails}
                  placeholder="e.g. Volume 28, Issue 4, IEEE Trans"
                />
              )}

              {/* Conditional Fields: Patents specific */}
              {category.includes('Intellectual Property') && achievementType.includes('Patent') && (
                <FormTextInput
                  label="Patent / Application Number"
                  value={patentDetails}
                  onChangeText={setPatentDetails}
                  placeholder="e.g. IN2026/09482"
                />
              )}

              {/* Conditional Field: Team / Individual */}
              {category !== 'Certifications & Online Learning' && (
                <FormToggle
                  label="Participation Type"
                  value={participation}
                  options={[
                    { id: 'Individual', label: 'Individual' },
                    { id: 'Team', label: 'Team' },
                  ]}
                  onSelect={setParticipation}
                  required
                />
              )}

              {/* Conditional Team fields */}
              {participation === 'Team' && (
                <View style={styles.teamContainer}>
                  <FormToggle
                    label="Your Team Role"
                    value={teamRole}
                    options={[
                      { id: 'Team Lead', label: 'Team Lead' },
                      { id: 'Team Member', label: 'Team Member' },
                    ]}
                    onSelect={setTeamRole}
                  />
                  {teamRole === 'Team Lead' && (
                    <FormTextInput
                      label="Team Members"
                      value={teamMembers}
                      onChangeText={setTeamMembers}
                      placeholder="e.g. Sathish Kumar, Jeeva"
                    />
                  )}
                </View>
              )}

              {/* Cash Prize Toggle section */}
              <FormToggle
                label="Did you receive a cash prize?"
                value={cashPrize}
                options={[
                  { id: 'yes', label: 'Yes' },
                  { id: 'no', label: 'No' },
                ]}
                onSelect={setCashPrize}
              />

              {cashPrize === 'yes' && (
                <FormTextInput
                  label="Prize Amount"
                  value={cashPrizeAmount}
                  onChangeText={setCashPrizeAmount}
                  placeholder="e.g. ₹10,000"
                  required
                />
              )}

              <FormTextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Briefly describe your accomplishment..."
                multiline
              />
            </View>
          )}

          {/* STEP 4: Proof Upload */}
          {currentStep === 'proof' && (
            <View style={styles.formCard}>
              <Text style={styles.stepTitle}>Upload Proof</Text>
              <Text style={styles.stepSubtitle}>Provide official documentation to verify this record:</Text>

              {/* Primary doc upload card */}
              <Text style={styles.proofLabel}>Certificate / Official Document *</Text>
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => setProofFileName('Certificate.pdf')}
              >
                <Ionicons name="document-text-outline" size={28} color="#2563EB" />
                <Text style={styles.uploadTitle}>
                  {proofFileName || 'Select Certificate (PDF/Image)'}
                </Text>
                {proofFileName !== '' && <Text style={styles.uploadSuccessText}>Attached</Text>}
              </TouchableOpacity>

              {/* Conditional Location proof */}
              {isOffline() && (
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.proofLabel}>Geotagged Photo * (Location Verification)</Text>
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => setGeotagFileName('Geotagged_Venue_Photo.jpg')}
                  >
                    <Ionicons name="location-outline" size={28} color="#0D4733" />
                    <Text style={styles.uploadTitle}>
                      {geotagFileName || 'Select Geotagged Photo'}
                    </Text>
                    {geotagFileName !== '' && <Text style={styles.uploadSuccessText}>Attached</Text>}
                  </TouchableOpacity>
                </View>
              )}

              {/* Conditional Cash prize proof */}
              {cashPrize === 'yes' && (
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.proofLabel}>Cash Prize Proof *</Text>
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => setPrizeProofFileName('Prize_Receipt.pdf')}
                  >
                    <Ionicons name="cash-outline" size={28} color="#0E9F6E" />
                    <Text style={styles.uploadTitle}>
                      {prizeProofFileName || 'Select Prize Receipt / Letter'}
                    </Text>
                    {prizeProofFileName !== '' && <Text style={styles.uploadSuccessText}>Attached</Text>}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* STEP 5: Review Summary */}
          {currentStep === 'review' && (
            <View style={styles.formCard}>
              <Text style={styles.stepTitle}>Review Your Achievement</Text>
              <Text style={styles.stepSubtitle}>Check details before sending for institutional review:</Text>

              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Category</Text>
                  <Text style={styles.summaryVal}>{category}</Text>
                </View>
                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Achievement Type</Text>
                  <Text style={styles.summaryVal}>{achievementType}</Text>
                </View>
                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Title</Text>
                  <Text style={styles.summaryVal}>{title}</Text>
                </View>
                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Organizer</Text>
                  <Text style={styles.summaryVal}>{organizer}</Text>
                </View>
                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Level</Text>
                  <Text style={styles.summaryVal}>{level}</Text>
                </View>
                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Result</Text>
                  <Text style={styles.summaryVal}>{result}</Text>
                </View>
                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Date</Text>
                  <Text style={styles.summaryVal}>{eventDate}</Text>
                </View>
                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Participation</Text>
                  <Text style={styles.summaryVal}>{participation}</Text>
                </View>
                <View style={styles.summaryDivider} />

                {participation === 'Team' && (
                  <>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Team Role</Text>
                      <Text style={styles.summaryVal}>{teamRole}</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                  </>
                )}

                {cashPrize === 'yes' && (
                  <>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Cash Prize Awarded</Text>
                      <Text style={[styles.summaryVal, { color: '#0E9F6E' }]}>{cashPrizeAmount}</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                  </>
                )}

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Primary Proof</Text>
                  <Text style={[styles.summaryVal, { color: '#2563EB', fontWeight: '800' }]}>
                    {proofFileName}
                  </Text>
                </View>
              </View>

              <View style={styles.autoAssignNotice}>
                <Ionicons name="person-circle-outline" size={18} color="#7C3AED" style={{ marginRight: 6 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.noticeTitleText}>Automatic Ownership Assignment</Text>
                  <Text style={styles.noticeDescText}>
                    Uploaded By: <Text style={{ fontWeight: '800' }}>Velusamy Proctor</Text> • Owner: <Text style={{ fontWeight: '800' }}>Velusamy Proctor</Text> (Faculty)
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Stepper Buttons control bar */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.backBtnCtrl} onPress={handleBack}>
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>

            {currentStep === 'review' ? (
              <TouchableOpacity style={styles.submitBtnCtrl} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit Achievement</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.nextBtnCtrl} onPress={handleNext}>
                <Text style={styles.nextBtnText}>Next</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FAF8F5',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stepIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicatorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  stepCircleCompleted: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  stepIndicatorText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  stepTextActive: {
    color: '#2563EB',
  },
  stepperConnector: {
    width: 24,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  connectorActive: {
    backgroundColor: '#2563EB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 16,
  },
  inlineRow: {
    flexDirection: 'row',
  },
  teamContainer: {
    backgroundColor: '#FAF8F5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  proofLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#FAF8F5',
  },
  uploadTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 10,
    flex: 1,
  },
  uploadSuccessText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0E9F6E',
  },
  summaryContainer: {
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  summaryVal: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  autoAssignNotice: {
    flexDirection: 'row',
    backgroundColor: '#F5F3FF',
    borderColor: '#E8E5FF',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginTop: 16,
  },
  noticeTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  noticeDescText: {
    fontSize: 11,
    color: '#8B5CF6',
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  backBtnCtrl: {
    width: 80,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  nextBtnCtrl: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitBtnCtrl: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0E9F6E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
