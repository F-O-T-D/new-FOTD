import { useUserState } from '../Contexts/UserContext';
import { API_BASE_URL } from '../config';

export const login = async (email, password) => {
  const { setUser } = useUserState();

  try {
    const response = await fetch(`${API_BASE_URL}/api/user/login`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success && data.userId) {
      setUser({
        user_id: data.userId,
        user_email: data.email,
        user_name: data.name,
      });
      console.log('✅ 로그인 성공! 저장된 user:', data);
      return data;
    } else {
      console.error('❌ 로그인 실패:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ 로그인 중 오류 발생:', error);
    return null;
  }
};
