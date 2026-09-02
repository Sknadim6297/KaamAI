import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { MoneyProvider } from '../src/context/MoneyContext';
import { AIProvider } from '../src/context/AIContext';
import { ToolsProvider } from '../src/context/ToolsContext';
import { RemindersProvider } from '../src/context/RemindersContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <MoneyProvider>
          <RemindersProvider>
            <AIProvider>
              <ToolsProvider>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false }} />
              </ToolsProvider>
            </AIProvider>
          </RemindersProvider>
        </MoneyProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
