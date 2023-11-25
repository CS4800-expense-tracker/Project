import { NavigationContainer } from "@react-navigation/native";
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

const linking = {
  config: {
    screens: {
      Landing: "",
      Overview: "account/overview",
      Expenses: "account/expenses",
      Account: "account/settings",
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
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Overview" component={Overview} />
        <Stack.Screen name="Expenses" component={Expenses} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="BankLink" component={BankLink} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
