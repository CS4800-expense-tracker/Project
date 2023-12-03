import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from 'react-native-toast-notifications'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  useFonts,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";
import Landing from "./Landing.js";
import Overview from "./Overview.js";
import Expenses from "./Expenses.js";
import Account from "./Account.js";
import Login from "./Login.js";
import Signup from "./Signup.js";
import { AppContextProvider } from "./AppContext.js";

const linking = {
  config: {
    screens: {
      Landing: "",
      Overview: "account/overview",
      Expenses: "account/expenses",
      Account: "account/settings",
      Login: "/login",
      Signup: "/signup",
    },
  },
};

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ToastProvider>
      <AppContextProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="Overview" component={Overview} />
            <Stack.Screen name="Expenses" component={Expenses} />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContextProvider>
    </ToastProvider>
  );
}
