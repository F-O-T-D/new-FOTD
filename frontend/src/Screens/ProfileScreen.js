import React from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserState } from '../Contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../config';

// --- 메뉴 아이템을 위한 재사용 컴포넌트 ---
const ProfileMenuItem = ({ iconName, text, onPress, isDestructive = false }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={iconName} size={22} color={isDestructive ? '#FF3B30' : '#555'} style={styles.menuIcon} />
    <Text style={[styles.menuText, isDestructive && styles.destructiveText]}>{text}</Text>
    <Ionicons name="chevron-forward" size={20} color="#D3D3D3" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const [user, setUser] = useUserState();

  // --- 로그아웃 처리 ---
  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '확인', onPress: () => setUser({}) },
    ]);
  };

  // --- 회원 탈퇴 처리 ---
  const handleDeleteAccount = () => {
    Alert.alert('회원탈퇴', '정말로 회원을 탈퇴하시겠습니까?\n모든 기록이 영구적으로 삭제됩니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴하기',
        style: 'destructive',
        onPress: async () => {
          try {
            //경로 다시 확인해야함
            const response = await axios.delete(
              `${config.API_BASE_URL}/api/user/delete/${user.id}`
            );

            if (response.status === 200) { // 성공적인 응답 확인
              Alert.alert('회원탈퇴 완료', '회원탈퇴가 완료되었습니다.');
              setUser({}); // 사용자 상태 초기화
            } else {
              Alert.alert('오류', response.data.error || '회원탈퇴 중 오류가 발생했습니다.');
            }
          } catch (error) {
            console.error("회원탈퇴 오류:", error);
            Alert.alert('오류', '서버와 통신 중 오류가 발생했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>마이페이지</Text>
        </View>

        {/* --- 프로필 정보 카드 --- */}
        <View style={[styles.card, styles.profileCard]}>
          <View style={styles.profileInfo}>
            <Ionicons name="person-circle-outline" size={64} color="#FF8C42" />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>{user?.name || '사용자'}</Text>
              <Text style={styles.profileEmail}>{user?.email || '이메일 정보 없음'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* --- 설정 메뉴 카드 --- */}
        <View style={styles.card}>
          <ProfileMenuItem iconName="help-circle-outline" text="FAQ / 고객센터" onPress={() => { /* FAQ 화면으로 이동 */ }} />
          <ProfileMenuItem iconName="notifications-outline" text="알림 설정" onPress={() => { /* 알림 설정 화면으로 이동 */ }} />
          <ProfileMenuItem iconName="document-text-outline" text="약관 및 정책" onPress={() => { /* 약관 화면으로 이동 */ }} />
        </View>

        {/* --- 계정 관리 메뉴 카드 --- */}
        <View style={styles.card}>
          <ProfileMenuItem 
            iconName="warning-outline" 
            text="회원탈퇴" 
            onPress={handleDeleteAccount}
            isDestructive={true}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FDF6EC',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileCard: {
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileTextContainer: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  destructiveText: {
    color: '#FF3B30',
  }
});

export default ProfileScreen;
