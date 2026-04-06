#!/bin/bash
set -euo pipefail
exec npm run prisma:deploy
exec npm run start