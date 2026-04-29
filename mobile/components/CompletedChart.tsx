import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { VictoryArea, VictoryAxis, VictoryChart, VictoryTheme } from 'victory-native';
import type { Habit } from '../lib/types';
import { colors, fontSizes, fontWeights, radii, spacing } from '../theme';

type Range = 'week' | 'month' | 'year' | 'all';

const RANGES: { key: Range; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
  { key: 'all', label: 'All time' },
];

function buildChartData(habits: Habit[], range: Range) {
  const now = new Date();
  const completions = habits.flatMap((h) => h.completions ?? []);

  let buckets: { label: string; date: Date }[] = [];

  if (range === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      buckets.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d });
    }
  } else if (range === 'month') {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      buckets.push({
        label: i % 5 === 0 ? d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '',
        date: d,
      });
    }
  } else if (range === 'year') {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ label: d.toLocaleDateString('en-US', { month: 'short' }), date: d });
    }
  } else {
    const earliest =
      completions.length > 0
        ? new Date(Math.min(...completions.map((c) => new Date(c.completedAt).getTime())))
        : new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const start = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    const d = new Date(start);
    while (d <= now) {
      buckets.push({
        label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        date: new Date(d),
      });
      d.setMonth(d.getMonth() + 1);
    }
  }

  const totalHabits = habits.length || 1;

  return buckets.map(({ label, date }, i) => {
    let count: number;
    if (range === 'year' || range === 'all') {
      count = completions.filter((c) => {
        const d = new Date(c.completedAt);
        return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
      }).length;
    } else {
      count = completions.filter((c) => {
        const d = new Date(c.completedAt);
        return (
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
        );
      }).length;
    }
    return { x: i, y: Math.min(100, Math.round((count / totalHabits) * 100)), label };
  });
}

export default function CompletedChart({ habits }: { habits: Habit[] }) {
  const [range, setRange] = useState<Range>('week');
  const data = useMemo(() => buildChartData(habits, range), [habits, range]);

  const tickValues = data
    .map((d, i) => (d.label ? i : null))
    .filter((v): v is number => v !== null);
  const tickFormat = (x: number) => data[x]?.label ?? '';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Completed</Text>
        <View style={styles.rangeRow}>
          {RANGES.map(({ key, label }) => (
            <Pressable
              key={key}
              onPress={() => setRange(key)}
              style={[styles.rangeBtn, range === key && styles.rangeBtnActive]}
            >
              <Text style={[styles.rangeBtnLabel, range === key && styles.rangeBtnLabelActive]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <VictoryChart
        theme={VictoryTheme.material}
        height={180}
        padding={{ top: 8, bottom: 36, left: 40, right: 12 }}
        domain={{ y: [0, 100] }}
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.primary} stopOpacity={0.25} />
            <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <VictoryAxis
          tickValues={tickValues}
          tickFormat={tickFormat}
          style={{
            axis: { stroke: 'transparent' },
            tickLabels: { fontSize: 10, fill: colors.textMuted, padding: 6 },
            grid: { stroke: 'transparent' },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(v: number) => `${v}%`}
          tickValues={[0, 25, 50, 75, 100]}
          style={{
            axis: { stroke: 'transparent' },
            tickLabels: { fontSize: 10, fill: colors.textMuted, padding: 4 },
            grid: { stroke: colors.border, strokeDasharray: '4,4' },
          }}
        />
        <VictoryArea
          data={data}
          interpolation="monotoneX"
          style={{
            data: {
              stroke: colors.primary,
              strokeWidth: 2,
              fill: colors.primaryLight,
              fillOpacity: 0.18,
            },
          }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  rangeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.md,
  },
  rangeBtnActive: {
    backgroundColor: colors.primary,
  },
  rangeBtnLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.textMuted,
  },
  rangeBtnLabelActive: {
    color: colors.white,
  },
});
