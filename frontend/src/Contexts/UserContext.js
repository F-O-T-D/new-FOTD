import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext(null); //UserContext 생성

const UserProvider = ({ children }) => { //UserProvider라는 컴포넌트 생성
  const [user, setUser] = useState(null); //user 상태를 저장할 useState 사용
  return ( //상태를 전역적으로 공유
    <UserContext.Provider value={[user, setUser]}> 
      {children}
    </UserContext.Provider>
  );
};
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useUserState = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserState는 UserProvider 내부에서만 사용해야 합니다.");
  }
  return context;
};
export { useUserState, UserProvider };
