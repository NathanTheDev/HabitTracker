import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { api } from '../../lib/api';
import type { Habit, User } from '../../lib/types';
import { colors, fontSizes, fontWeights, radii, spacing } from '../../theme';
import DashboardHeader from '../../components/DashboardHeader';
import SimpleHabitCard from '../../components/SimpleHabitCard';
import QuantityCard from '../../components/QuantityCard';
import CompletedChart from '../../components/CompletedChart';

type Tab = 'pending' | 'completed';

const TODAY = new Date().toDateString();

function isCompletedToday(habit: Habit): boolean {
  const completion = (habit.completions ?? []).find(
    (c) => new Date(c.completedAt).toDateString() === TODAY
  );
  if (!completion) return false;
  if (habit.quantity > 1) return (completion.quantityProgress ?? 0) >= habit.quantity;
  return true;
}

function todayProgress(habit: Habit): number {
  const completion = (habit.completions ?? []).find(
    (c) => new Date(c.completedAt).toDateString() === TODAY
  );
  return completion?.quantityProgress ?? 0;
}

export default function Dashboard() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>('pending');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [habitsData, userData] = await Promise.all([
      api.habits.list(),
      api.user.me(),
    ]);
    setHabits(habitsData);
    setUser(userData);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load().catch(() => {});
    setRefreshing(false);
  }, [load]);

  const filtered = habits.filter((h) =>
    tab === 'completed' ? isCompletedToday(h) : !isCompletedToday(h)
  );

  const renderItem = ({ item }: { item: Habit }) => {
    if (item.quantity > 1) {
      return (
        <QuantityCard
          habit={item}
          progress={todayProgress(item)}
          completed={isCompletedToday(item)}
          onUpdate={load}
        />
      );
    }
    return (
      <SimpleHabitCard
        habit={item}
        completed={isCompletedToday(item)}
        onUpdate={load}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <DashboardHeader email={user?.email} />

      <View style={styles.tabs}>
        {(['pending', 'completed'] as Tab[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<CompletedChart habits={habits} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {tab === 'pending' ? 'All done for today!' : 'Nothing completed yet.'}
            </Text>
          </View>
        }
      />

      <Pressable
        onPress={() => router.push('/habits/new')}
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
      >
        <Feather name="plus" size={26} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.border,
    borderRadius: radii.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.textPrimary,
    fontWeight: fontWeights.semibold,
  },
  list: {
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
