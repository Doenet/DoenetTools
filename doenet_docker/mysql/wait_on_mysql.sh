while ! mysqladmin ping --silent -phelloworld -h"$DB_HOST" localhost;
    do sleep 1
done