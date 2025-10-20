#!/bin/bash

# # Command to be executed and checked
# COMMAND="mysqladmin ping -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD | grep 'mysqld is alive'"

# # Desired exit status to wait for (e.g., 1 for a specific error)
# DESIRED_EXIT_STATUS=1


# # Loop while the command's exit status is NOT the desired value
# while true; do
#     $COMMAND
#     EXIT_STATUS=$?
#     if [ "$EXIT_STATUS" -eq "$DESIRED_EXIT_STATUS" ]; then
#         echo "Command '$COMMAND' returned the desired exit status ($DESIRED_EXIT_STATUS)."
#         break # Exit the loop
#     else
#         echo "Command '$COMMAND' returned exit status $EXIT_STATUS. Retrying in 5 seconds..."
#         sleep 5
#     fi
# done


npx prisma migrate dev
npx prisma db seed
npm run start