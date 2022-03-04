#!/usr/bin/env bash

# Convenience scripts to install and update packages

# Auth
cd auth/auth-api
echo "[auth-api]: Installing"
npm i --silent
echo "[auth-api]: Done"
cd ../auth-service
echo "[auth-service]: Installing"
npm i --silent
echo "[auth-service]: Done"
# Root
cd ../../

# Analytic
cd analytic/analytic-api
echo  "[analytic-api]: Installing"
npm i --silent
echo  "[analytic-api]: Done"
cd ../analytic-service
echo "[analytic-service]: Installing"
npm i --silent
echo "[analytic-service]: Done"
# Root
cd ../../

# Employee
cd employee/employee-api
echo "[employee-api]: Installing"
npm i --silent
echo "[employee-api]: Done"

cd ../employee-service
echo "[employee-service]: Installing"
npm i --silent
echo "[employee-service]: Done"
cd ../../

# Log
cd log/log-service
echo "[log-service]: Installing"
npm i --silent
echo "[log-service]: Done"

cd ../../

# WEb-UI
cd web-ui
echo "[web-ui]: Installing"
npm i --silent
echo "[web-ui]: Done"
cd ../../