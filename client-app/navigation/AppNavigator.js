import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

// 画面インポート
import LoginScreen from '../screens/LoginScreen'; 
import SignupScreen from '../screens/SignupScreen';
import RecordListScreen from '../screens/RecordListScreen';
import CreateRecordScreen from '../screens/CreateRecordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ThreadScreen from '../screens/ThreadScreen';
// ↓ 追加
import RecordDetailScreen from '../screens/RecordDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ------------------------------------------------
// メインのタブナビゲーション（ログイン後の画面）
// ------------------------------------------------
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') {
            // 「ホーム」→「ギャラリー」
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Thread') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'MyPage') {
            // 「マイページ」→「Insight」
            iconName = focused ? 'analytics' : 'analytics-outline';
          }

          // アイコンサイズを少し大きく（デフォルト24→30）
          return <Ionicons name={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF', // アクティブな色（青）
        tabBarInactiveTintColor: 'gray',  // 非アクティブな色
        headerShown: false,              // タブ画面の上部タイトルバーを非表示
        tabBarShowLabel: false,          // 下部メニュー名（ラベル）を非表示（アイコンのみ）
        tabBarStyle: {
          paddingTop: 10,                // 上部余白を追加してアイコンを中央に
          paddingBottom: 10,             // 下部余白を追加してアイコンを中央に
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={RecordListScreen} 
        options={{ title: 'ギャラリー' }} 
      />
      <Tab.Screen 
        name="Create" 
        component={CreateRecordScreen} 
        options={{ title: '作成' }}
      />
      <Tab.Screen 
        name="Thread" 
        component={ThreadScreen} 
        options={{ title: 'スレッド' }}
      />
      <Tab.Screen 
        name="MyPage" 
        component={ProfileScreen} 
        options={{ title: 'Insight' }} 
      />
    </Tab.Navigator>
  );
};

// ------------------------------------------------
// 未認証ユーザー向けの画面群
// ------------------------------------------------
const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'ログイン' }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: '新規登録' }} />
    </Stack.Navigator>
);

// ------------------------------------------------
// ルートナビゲーター
// ------------------------------------------------
const AppNavigator = () => {
  const { isLoading, userToken } = React.useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>認証状態を確認中...</Text>
      </View>
    );
  }
  
  return (
    // Stack.Navigator で全体を包み、認証状態によって中身を切り替える
    // ログイン後は TabNavigator を表示する
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          {/* ↓ 追加: 詳細画面 */}
          <Stack.Screen 
            name="RecordDetail" 
            component={RecordDetailScreen} 
            options={{ 
              headerShown: true, 
              title: '詳細',
              headerBackTitleVisible: false 
            }} 
          />
        </>
      ) : (
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