#!/usr/bin/env bash

# Convenience scripts to install and update packages

# Auth
cd auth/auth-api
echo "[auth-api]: Installing"
npm i --silent
cd ../auth-service
echo "[auth-service]: Installing"
npm i --silent

# Root
cd ../../

# Analytic
cd analytic/analytic-api
echo  "[analytic-api]: Installing"
npm i --silent
cd ../analytic-service
echo "[analytic-service]: Installing"
npm i --silent

# Root
cd ../../

# Employee
#cd employee/employee-api
#echo "[employee-api]: Installing"
#npm i --silent
#cd ../employee-service
#echo "[employee-service]: Installing"
#npm i --silent

#cd ../../

# Log
cd log/log-service
echo "[log-service]: Installing"
npm i --silent


cd ../../