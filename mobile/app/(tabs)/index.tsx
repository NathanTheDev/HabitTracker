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

type ListItem =
  | { type: 'chart' }
  | { type: 'progress'; done: number; total: number }
  | { type: 'sectionHeader'; label: string; showAdd?: boolean }
  | { type: 'habit'; habit: Habit }
  | { type: 'empty'; message: string };

export default function Dashboard() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUser] = useState<User | null>(null);
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

  const pending = habits.filter((h) => !isCompletedToday(h));
  const completed = habits.filter((h) => isCompletedToday(h));
  const doneCount = completed.length;
  const totalCount = habits.length;

  const listData: ListItem[] = [
    { type: 'progress', done: doneCount, total: totalCount },
    { type: 'chart' },
    { type: 'sectionHeader', label: 'Today', showAdd: true },
    ...(pending.length === 0
      ? [{ type: 'empty' as const, message: 'All done for today!' }]
      : pending.map((h) => ({ type: 'habit' as const, habit: h }))),
    ...(completed.length > 0
      ? [
          { type: 'sectionHeader' as const, label: 'Completed' },
          ...completed.map((h) => ({ type: 'habit' as const, habit: h })),
        ]
      : []),
  ];

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'chart') {
      return (
        <View style={styles.chartWrapper}>
          <CompletedChart habits={habits} />
        </View>
      );
    }

    if (item.type === 'progress') {
      const pct = item.total > 0 ? Math.round((item.done / item.total) * 100) : 0;
      return (
        <View style={styles.progressPill}>
          <View>
            <Text style={styles.progressLabel}>
              {item.done === item.total && item.total > 0
                ? 'All habits done!'
                : `${item.done} of ${item.total} complete`}
            </Text>
            <Text style={styles.progressSub}>Keep it up</Text>
          </View>
          <Text style={styles.progressPct}>{pct}%</Text>
        </View>
      );
    }

    if (item.type === 'sectionHeader') {
      return (
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionLabel, item.label === 'Completed' && styles.sectionLabelMuted]}>
            {item.label === 'Completed' ? item.label.toUpperCase() : item.label}
          </Text>
          {item.showAdd && (
            <Pressable
              onPress={() => router.push('/habits/new')}
              style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.75 }]}
            >
              <Feather name="plus" size={13} color={colors.white} />
              <Text style={styles.addBtnLabel}>Add habit</Text>
            </Pressable>
          )}
        </View>
      );
    }

    if (item.type === 'empty') {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{item.message}</Text>
        </View>
      );
    }

    const h = item.habit;
    if (h.quantity > 1) {
      return (
        <View style={styles.cardWrapper}>
          <QuantityCard
            habit={h}
            progress={todayProgress(h)}
            completed={isCompletedToday(h)}
            onUpdate={load}
          />
        </View>
      );
    }
    return (
      <View style={styles.cardWrapper}>
        <SimpleHabitCard
          habit={h}
          completed={isCompletedToday(h)}
          onUpdate={load}
        />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <DashboardHeader email={user?.email} />

      <FlatList
        data={listData}
        keyExtractor={(item, i) => {
          if (item.type === 'habit') return item.habit.id;
          if (item.type === 'sectionHeader') return `section-${item.label}`;
          return `${item.type}-${i}`;
        }}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingBottom: 40,
  },
  chartWrapper: {
    marginBottom: spacing.sm,
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: radii.lg,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textPrimary,
  },
  progressSub: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  progressPct: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  sectionLabelMuted: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.white,
  },
  cardWrapper: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyCard: {
    marginHorizontal: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
  },
});
