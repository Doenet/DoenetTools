-- Grant myuser the database-scoped privileges Prisma needs for migrations and shadow databases
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, INDEX, REFERENCES, CREATE TEMPORARY TABLES, LOCK TABLES  
ON `doenet%`.*  
TO 'myuser'@'%';  
FLUSH PRIVILEGES;