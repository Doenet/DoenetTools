import { describe, expect, test } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { findDestructiveStatements } from "./destructiveMigrations";

const reasons = (sql: string) =>
  findDestructiveStatements(sql).map((f) => f.reason);

describe("findDestructiveStatements", () => {
  test("flags drops, renames, narrowing and unsafe additions", () => {
    expect(reasons("DROP TABLE `old`;")).toHaveLength(1);
    expect(
      reasons("ALTER TABLE `t` DROP COLUMN `a`, DROP COLUMN `b`;"),
    ).toHaveLength(2);
    expect(reasons("ALTER TABLE `t` RENAME COLUMN `a` TO `b`;")).toHaveLength(
      1,
    );
    expect(
      reasons("ALTER TABLE `t` MODIFY `a` VARCHAR(10) NOT NULL;"),
    ).toHaveLength(1);
    expect(reasons("ALTER TABLE `t` ADD COLUMN `a` INTEGER NOT NULL;")).toEqual(
      [
        "adds a NOT NULL column without a default, so the running code's inserts fail",
      ],
    );
    expect(reasons("CREATE UNIQUE INDEX `t_a_key` ON `t`(`a`);")).toHaveLength(
      1,
    );
  });

  test("flags hand-written forms", () => {
    expect(reasons("ALTER TABLE t DROP COLUMN a;")).toHaveLength(1);
    expect(reasons("alter table t drop a;")).toHaveLength(1);
    expect(reasons("ALTER TABLE t ADD COLUMN a INT NOT NULL;")).toHaveLength(1);
    expect(
      reasons("ALTER TABLE `t` ADD CONSTRAINT `u` UNIQUE (`a`);"),
    ).toHaveLength(1);
    expect(reasons("# a comment\nDROP TABLE `old`;")).toHaveLength(1);
  });

  test("allows index and default changes", () => {
    expect(
      reasons(`
        ALTER TABLE \`t\` DROP INDEX \`a\`, DROP FOREIGN KEY \`b\`,
            ADD CONSTRAINT \`c\` FOREIGN KEY (\`d\`) REFERENCES \`u\`(\`id\`);
        ALTER TABLE \`t\` RENAME INDEX \`a\` TO \`b\`;
        ALTER TABLE \`t\` ALTER COLUMN \`a\` SET DEFAULT 1;
      `),
    ).toEqual([]);
  });

  test("allows additive changes", () => {
    expect(
      reasons(`
        -- a comment mentioning DROP TABLE
        CREATE TABLE \`new\` (\`id\` INTEGER NOT NULL, PRIMARY KEY (\`id\`));
        ALTER TABLE \`t\` ADD COLUMN \`a\` BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN \`b\` VARCHAR(191) NULL;
        CREATE INDEX \`t_b_idx\` ON \`t\`(\`b\`);
      `),
    ).toEqual([]);
  });

  test("flags the real image-dimension drop", () => {
    const sql = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../prisma/migrations/20260707120000_drop_image_dimensions/migration.sql",
      ),
      "utf8",
    );
    expect(reasons(sql)).toHaveLength(2);
  });
});
