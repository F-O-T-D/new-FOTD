import api from '../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Keyboard,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { AuthRoutes } from '../Navigations/Routes';
import Input, { InputTypes, ReturnKeyTypes } from '../Components/Input';
import { useRef, useReducer, useCallback } from 'react';
import Button from '../Components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeInputView from '../Components/SafeInputView';
import TextButton from '../Components/TextButton';
import HR from '../Components/HR';
import { StatusBar } from 'expo-status-bar';
import { WHITE } from '../Colors';
import {
  authFormReducer,
  AuthFormTypes,
  initAuthForm,
} from '../Reducers/authFormReducer';
import axios from 'axios';
import { useUserState } from '../Contexts/UserContext';

import config from '../config'; // API URL을 config.js에서 가져옴

const API_BASE_URL = config.API_BASE_URL;

const SignInScreen = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  const passwordRef = useRef();

  const [form, dispatch] = useReducer(authFormReducer, initAuthForm);

  const [, setUser] = useUserState();
  useFocusEffect(
    useCallback(() => {
      return () => dispatch({ type: AuthFormTypes.RESET });
    }, [])
  );

  const updateForm = (payload) => {
    const newForm = { ...form, ...payload };
    const disabled = !newForm.email || !newForm.password;

    dispatch({
      type: AuthFormTypes.UPDATE_FORM,
      payload: { disabled, ...payload },
    });
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    if (!form.disabled && !form.isLoading) {
      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/login`,
          {
            email: form.email,
            password: form.password,
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          Alert.alert('로그인 실패', response.data.err);
        }
      } catch (error) {
        Alert.alert('로그인 오류');
      }
      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });
    }
  };

  return (
    <SafeInputView>
      <StatusBar style="light" />
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={require('../assets/cover.png')} // 경로 수정
            style={{ width: '100%' }}
            resizeMode="cover"
          />
        </View>
        <ScrollView
          style={[styles.form, { paddingBottom: bottom ? bottom + 10 : 40 }]}
          contentContainerStyle={{ alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="always"
        >
          <Input
            value={form.email}
            onChangeText={(text) => updateForm({ email: text.trim() })}
            inputType={InputTypes.EMAIL}
            returnKeyType={ReturnKeyTypes.NEXT}
            onSubmitEditing={() => passwordRef.current.focus()}
            styles={{ container: { marginBottom: 20 } }}
          />
          <Input
            ref={passwordRef}
            value={form.password}
            onChangeText={(text) => updateForm({ password: text.trim() })}
            inputType={InputTypes.PASSWORD}
            returnKeyType={ReturnKeyTypes.DONE}
            onSubmitEditing={onSubmit}
            styles={{ container: { marginBottom: 20 } }}
          />
          <Button
            title="로그인"
            onPress={onSubmit}
            disabled={form.disabled}
            isLoading={form.isLoading}
            styles={{ container: { marginTop: 20 } }}
          />
          <HR text={'OR'} styles={{ container: { marginVertical: 30 } }} />
          <TextButton
            title={'회원가입'}
            onPress={() => navigation.navigate(AuthRoutes.SIGN_UP)}
          />
        </ScrollView>
      </View>
    </SafeInputView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  form: {
    flexGrow: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default SignInScreen;
