// screens/ProfileScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppMainContainer from '../../components/AppMainContainer';
import {
  User,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  Bell,
  Edit2,
  Save,
} from 'lucide-react-native';

export default function ProfileScreen({navigation}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Jhon Alex',
    email: 'jhon@example.com',
    phone: '+880 1234-56789',
    dob: '15 Oct 1999',
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to your backend
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const renderInputField = (
    label: string,
    value: string,
    icon: React.ReactNode,
    key: string,
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabelRow}>
        {icon}
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      {isEditing ? (
        <TextInput
          style={styles.textInput}
          value={userData[key as keyof typeof userData]}
          onChangeText={text => setUserData({...userData, [key]: text})}
          placeholder={`Enter ${label}`}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      ) : (
        <Text style={styles.inputValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <AppMainContainer hideTop hideBottom>
      <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
        <StatusBar barStyle={'light-content'} translucent={false} />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>My Profile</Text>
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Profile Info Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <User size={60} color="#fff" />
                </View>
                <TouchableOpacity style={styles.editAvatarButton}>
                  <Edit2 size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
            </View>

            {/* Edit Profile Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Edit Profile</Text>
                {!isEditing ? (
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={styles.editButton}>
                    <Edit2 size={20} color="#F4C66A" />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleSave}
                    style={styles.saveButton}>
                    <Save size={20} color="#4ECDC4" />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                )}
              </View>

              {renderInputField(
                'Name',
                userData.name,
                <User size={20} color="#F4C66A" />,
                'name',
              )}
              {renderInputField(
                'Email',
                userData.email,
                <Mail size={20} color="#F4C66A" />,
                'email',
              )}
              {renderInputField(
                'Phone Number',
                userData.phone,
                <Phone size={20} color="#F4C66A" />,
                'phone',
              )}
              {renderInputField(
                'Date of Birth',
                userData.dob,
                <Calendar size={20} color="#F4C66A" />,
                'dob',
              )}

              {isEditing && (
                <View style={styles.buttonRow}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setIsEditing(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.saveChangesButton}
                    onPress={handleSave}>
                    <Text style={styles.saveChangesButtonText}>
                      Save Changes
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* App Control Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>App Control</Text>
              <View style={styles.appControlGrid}>
                <TouchableOpacity style={styles.appControlItem}>
                  <View
                    style={[
                      styles.controlIcon,
                      {backgroundColor: 'rgba(249, 115, 22, 0.2)'},
                    ]}>
                    <Bell size={24} color="#F97316" />
                  </View>
                  <Text style={styles.controlLabel}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.appControlItem}>
                  <View
                    style={[
                      styles.controlIcon,
                      {backgroundColor: 'rgba(34, 211, 238, 0.2)'},
                    ]}>
                    <User size={24} color="#22D3EE" />
                  </View>
                  <Text style={styles.controlLabel}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.appControlItem}>
                  <View
                    style={[
                      styles.controlIcon,
                      {backgroundColor: 'rgba(134, 239, 172, 0.2)'},
                    ]}>
                    <Save size={24} color="#86EFAC" />
                  </View>
                  <Text style={styles.controlLabel}>Backup</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.appControlItem}>
                  <View
                    style={[
                      styles.controlIcon,
                      {backgroundColor: 'rgba(168, 85, 247, 0.2)'},
                    ]}>
                    <ChevronLeft size={24} color="#A855F7" />
                  </View>
                  <Text style={styles.controlLabel}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </AppMainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F97316',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  sectionContainer: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editButtonText: {
    color: '#F4C66A',
    fontSize: 14,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveButtonText: {
    color: '#4ECDC4',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  inputLabel: {
    color: '#F4C66A',
    fontSize: 14,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  inputValue: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  saveChangesButton: {
    flex: 1,
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveChangesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  appControlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  appControlItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  controlIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
