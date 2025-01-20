export const initAuthForm = { //초기 상태 정의
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  disabled: true,
  isLoading: false,
  user: null,
};

export const AuthFormTypes = { //상태 업데이트 유형 정의
  UPDATE_FORM: 'update_form',
  TOGGLE_LOADING: 'toggle_loading',
  RESET: 'reset',
  SET_USER: 'set_user',
};

export const authFormReducer = (state, action) => { //리듀서 함수
  switch (action.type) {
    case AuthFormTypes.UPDATE_FORM:
      return { ...state, ...action.payload };
    case AuthFormTypes.TOGGLE_LOADING:
      return { ...state, isLoading: !state.isLoading };
    case AuthFormTypes.RESET:
      return initAuthForm;
    case AuthFormTypes.SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
