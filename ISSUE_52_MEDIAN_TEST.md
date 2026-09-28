# Suspect Days Query Test Output

## Test Scenario
- 30 normal days at ~100 views each (5 records/day in test DB)
- 7-day fake traffic run at ~2000 views each (50 records/day in test DB)

## SQL Query Used
```sql
WITH daily_counts AS (
  SELECT day, COUNT(*) as view_count
  FROM page_views
  GROUP BY day
),
ranked_previous AS (
  SELECT 
    curr.day as current_day,
    curr.view_count as current_count,
    prev.view_count as prev_count,
    ROW_NUMBER() OVER (
      PARTITION BY curr.day 
      ORDER BY prev.view_count
    ) as rn,
    COUNT(*) OVER (PARTITION BY curr.day) as total
  FROM daily_counts curr
  JOIN daily_counts prev 
    ON prev.day < curr.day 
    AND prev.day >= date(curr.day, '-14 days')
)
SELECT 
  current_day as day,
  current_count as views,
  AVG(prev_count) as median_previous_14d
FROM ranked_previous
WHERE rn IN ((total + 1) / 2, (total + 2) / 2)
GROUP BY current_day, current_count
HAVING current_count >= 50
  AND AVG(prev_count) IS NOT NULL
  AND current_count > 3 * AVG(prev_count)
ORDER BY current_day DESC;
```

## Test Data Inserted
```
Inserting test data...
  2026-09-01: 97 views (normal) [5 records]
  2026-09-02: 104 views (normal) [5 records]
  2026-09-03: 99 views (normal) [5 records]
  2026-09-04: 99 views (normal) [5 records]
  2026-09-05: 103 views (normal) [5 records]
  2026-09-06: 96 views (normal) [5 records]
  2026-09-07: 97 views (normal) [5 records]
  2026-09-08: 102 views (normal) [5 records]
  2026-09-09: 100 views (normal) [5 records]
  2026-09-10: 98 views (normal) [5 records]
  2026-09-11: 95 views (normal) [5 records]
  2026-09-12: 104 views (normal) [5 records]
  2026-09-13: 104 views (normal) [5 records]
  2026-09-14: 96 views (normal) [5 records]
  2026-09-15: 104 views (normal) [5 records]
  2026-09-16: 98 views (normal) [5 records]
  2026-09-17: 104 views (normal) [5 records]
  2026-09-18: 97 views (normal) [5 records]
  2026-09-19: 101 views (normal) [5 records]
  2026-09-20: 96 views (normal) [5 records]
  2026-09-21: 97 views (normal) [5 records]
  2026-09-22: 99 views (normal) [5 records]
  2026-09-23: 97 views (normal) [5 records]
  2026-09-24: 99 views (normal) [5 records]
  2026-09-25: 99 views (normal) [5 records]
  2026-09-26: 101 views (normal) [5 records]
  2026-09-27: 95 views (normal) [5 records]
  2026-09-28: 96 views (normal) [5 records]
  2026-09-29: 103 views (normal) [5 records]
  2026-09-30: 95 views (normal) [5 records]
  2026-10-01: 1960 views (FAKE TRAFFIC) [50 records]
  2026-10-02: 2001 views (FAKE TRAFFIC) [50 records]
  2026-10-03: 2049 views (FAKE TRAFFIC) [50 records]
  2026-10-04: 2037 views (FAKE TRAFFIC) [50 records]
  2026-10-05: 2040 views (FAKE TRAFFIC) [50 records]
  2026-10-06: 2000 views (FAKE TRAFFIC) [50 records]
  2026-10-07: 2033 views (FAKE TRAFFIC) [50 records]
```

## Query Results
```
Suspect days (flagged):
=======================
2026-10-07: 50 views (median of prev 14d: 5)
2026-10-06: 50 views (median of prev 14d: 5)
2026-10-05: 50 views (median of prev 14d: 5)
2026-10-04: 50 views (median of prev 14d: 5)
2026-10-03: 50 views (median of prev 14d: 5)
2026-10-02: 50 views (median of prev 14d: 5)
2026-10-01: 50 views (median of prev 14d: 5)
```

## Verification
```
Verification:
  Fake traffic days flagged: 7/7
  Normal days wrongly flagged: 0/30

✓ PASS: All 7 fake traffic days flagged, no normal days flagged
```

## Result
**SUCCESS:** The median-based suspect days query correctly identifies all 7 fake traffic days while producing zero false positives on the 30 normal days. The median approach prevents multi-day fake traffic runs from raising their own baseline.
