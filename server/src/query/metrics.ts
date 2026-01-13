import { prisma } from "../model";

type Metric = {
  metric: "users_joined" | "content_created" | "content_shared_publicly";
  granularity: "daily" | "weekly" | "monthly";
  timezone: string;
  range: {
    start: Date;
    end: Date;
  };
  data: { date: string; count: bigint }[];
};

/**
 * Get users joined from `start` to `end` weekly.
 * Does not include anonymous users.
 */
export async function getWeeklyUsersJoined({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): Promise<Metric> {
  const result = await prisma.$queryRaw<{ yearWeek: number; count: bigint }[]>`
    SELECT
      YEARWEEK(joinedAt, 0) AS yearWeek,
      COUNT(*) AS count
    FROM users
    WHERE isAnonymous = false
    AND joinedAt BETWEEN ${start} AND ${end}
    GROUP BY yearWeek
    ORDER BY yearWeek;
  `;
  return {
    metric: "users_joined",
    granularity: "weekly",
    timezone: "UTC",
    range: { start, end },
    data: result.map((row) => ({
      date: row.yearWeek.toString(),
      count: row.count,
    })),
  };
}

/**
 * Get content created between `start` to `end` weekly.
 * Does not include deleted content or assignments.
 */
export async function getWeeklyContentCreated({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): Promise<Metric> {
  const result = await prisma.$queryRaw<{ yearWeek: number; count: bigint }[]>`
    SELECT
      YEARWEEK(c.createdAt, 0) AS yearWeek,
      COUNT(*) AS count
    FROM content c
    LEFT JOIN content parent ON c.parentId = parent.id
    WHERE c.isDeletedOn IS NULL
    AND c.isAssignmentRoot = FALSE
    AND (parent.id IS NULL OR parent.isAssignmentRoot = FALSE)
    AND c.createdAt BETWEEN ${start} AND ${end}
    GROUP BY yearWeek
    ORDER BY yearWeek;
  `;
  return {
    metric: "content_created",
    granularity: "weekly",
    timezone: "UTC",
    range: { start, end },
    data: result.map((row) => ({
      date: row.yearWeek.toString(),
      count: row.count,
    })),
  };
}

/**
 * Get content shared publicly between `start` to `end` weekly.
 * Does not include deleted content that was public.
 */
export async function getWeeklyContentSharedPublicly({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): Promise<Metric> {
  const result = await prisma.$queryRaw<{ yearWeek: number; count: bigint }[]>`
    SELECT
      YEARWEEK(publiclySharedAt, 0) AS yearWeek,
      COUNT(*) AS count
    FROM content
    WHERE isDeletedOn IS NULL
    AND publiclySharedAt BETWEEN ${start} AND ${end}
    GROUP BY yearWeek
    ORDER BY yearWeek;
  `;
  return {
    metric: "content_shared_publicly",
    granularity: "weekly",
    timezone: "UTC",
    range: { start, end },
    data: result.map((row) => ({
      date: row.yearWeek.toString(),
      count: row.count,
    })),
  };
}
