-- Grant myuser full privileges so Prisma can create/use/drop the shadow database
GRANT ALL PRIVILEGES ON *.* TO 'myuser'@'%';
FLUSH PRIVILEGES;
