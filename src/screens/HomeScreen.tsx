import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGreetingQuery } from '../api/useGreetingQuery';
import { useCounterStore } from '../store/useCounterStore';

export function HomeScreen(): React.JSX.Element {
  const count = useCounterStore(state => state.count);
  const increment = useCounterStore(state => state.increment);
  const reset = useCounterStore(state => state.reset);
  const greeting = useGreetingQuery();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>TRAINING REPO</Text>
          <Text accessibilityRole="header" style={styles.title}>
            React Native foundation
          </Text>
          <Text style={styles.subtitle}>
            A small, tested baseline for building production features.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>React Query</Text>
          {greeting.isPending ? (
            <ActivityIndicator accessibilityLabel="Loading greeting" />
          ) : (
            <Text style={styles.value}>{greeting.data}</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Zustand counter</Text>
          <Text accessibilityLabel={`Count: ${count}`} style={styles.count}>
            {count}
          </Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="Increment counter"
              accessibilityRole="button"
              onPress={increment}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Increment</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Reset counter"
              accessibilityRole="button"
              onPress={reset}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f8fafc',
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  title: {
    color: '#0f172a',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
    padding: 20,
  },
  label: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: '#0f172a',
    fontSize: 18,
  },
  count: {
    color: '#0f172a',
    fontSize: 44,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderColor: '#cbd5e1',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '600',
  },
});
