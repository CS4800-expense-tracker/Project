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
import BankLink from "./Bank-Link.js";
import Setup from "./Setup.js";

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
      Landing: "",
      Overview: "account/overview",
      Expenses: "account/expenses",
      Account: "account/settings",
      Setup: "account/setup",
      BankLink: "account/bank-link",
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
    <NavigationContainer linking={linking} theme={myTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Overview" component={Overview} />
        <Stack.Screen name="Expenses" component={Expenses} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Setup" component={Setup} />
        <Stack.Screen name="BankLink" component={BankLink} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
