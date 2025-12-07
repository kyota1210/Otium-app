import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';

// 画面インポート
import LoginScreen from '../screens/LoginScreen'; 
import SignupScreen from '../screens/SignupScreen';
import RecordListScreen from '../screens/RecordListScreen';
import CreateRecordScreen from '../screens/CreateRecordScreen';

// プレースホルダー画面
// const RecordListScreen = () => (
//     <View style={{ flex: 1, justifyContent: 'center' }}>
//         <Text>記録一覧画面 (AppStack)</Text>
//     </View>
// );
// const LoginScreen = () => (
//     <View style={{ flex: 1, justifyContent: 'center' }}>
//         <Text>ログイン画面 (AuthStack)</Text>
//     </View>
// );
// // SignupScreenもここで定義するか、LoginScreenと同じものを一時的に使用

const Stack = createNativeStackNavigator();

// 認証済みユーザー向けの画面群
const AppStack = () => (
    <Stack.Navigator>
      <Stack.Screen 
          name="Records" 
          component={RecordListScreen} 
          options={({ navigation }) => ({ 
              title: 'レコード一覧',
              // 右上に作成ボタンを配置
              headerRight: () => (
                  <Button
                      onPress={() => navigation.navigate('CreateRecord')}
                      title="追加"
                  />
              ),
          })}
      />
      <Stack.Screen 
          name="CreateRecord" 
          component={CreateRecordScreen} 
          options={{ title: '新しい記録を作成' }} 
      />
    </Stack.Navigator>
  );
// 未認証ユーザー向けの画面群
const AuthStack = () => (
    <Stack.Navigator>
    {/* ログインとサインアップ画面をここに定義 */}
    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'ログイン' }} />
    <Stack.Screen name="Signup" component={SignupScreen} options={{ title: '新規登録' }} />
    </Stack.Navigator>
);

// メインナビゲーター：認証状態によってスタックを切り替える
const AppNavigator = () => {
  const { isLoading, userToken } = React.useContext(AuthContext); // 認証状態を取得

  if (isLoading) {
    // 起動時のチェック中はローディング画面を表示
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>認証状態を確認中...</Text>
      </View>
    );
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        // トークンがあればAppStackを表示
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        // トークンがなければAuthStack（ログイン/サインアップ）を表示
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default AppNavigator;