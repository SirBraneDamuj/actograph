#!/bin/bash

touch .env
RDS_USERNAME=$(/opt/elasticbeanstalk/bin/get-config environment -k RDS_USERNAME)
RDS_PASSWORD=$(/opt/elasticbeanstalk/bin/get-config environment -k RDS_PASSWORD)
RDS_HOSTNAME=$(/opt/elasticbeanstalk/bin/get-config environment -k RDS_HOSTNAME)
RDS_PORT=$(/opt/elasticbeanstalk/bin/get-config environment -k RDS_PORT)
echo "DATABASE_URL='postgresql://$RDS_USERNAME:$RDS_PASSWORD@$RDS_HOSTNAME:$RDS_PORT/ebdb?schema=public'" > .env
chmod a+x node_modules/.bin/prisma
npx prisma migrate deploy

npx prisma db seed
