import { ToastProvider } from "react-native-toast-notifications";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
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

const myTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

const linking = {
  config: {
    screens: {
      PennyWise: "",
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
    <AppContextProvider>
      <ToastProvider>
        <NavigationContainer linking={linking} theme={myTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PennyWise" component={Landing} />
            <Stack.Screen name="Overview" component={Overview} />
            <Stack.Screen name="Expenses" component={Expenses} />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </AppContextProvider>
  );
}
