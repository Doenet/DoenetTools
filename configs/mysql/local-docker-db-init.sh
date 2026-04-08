#!/bin/bash
# Grant the app user the privileges Prisma needs for migrations and shadow databases
# across all databases matching the MYSQL_DATABASE prefix (e.g. doenet, doenet_shadow).
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<EOF
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, INDEX, REFERENCES, CREATE TEMPORARY TABLES, LOCK TABLES
ON \`${MYSQL_DATABASE}%\`.*
TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
EOF
