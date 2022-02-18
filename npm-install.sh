#!/usr/bin/env bash

# Convenience scripts to install and update packages

# Auth
cd auth/auth-api
echo "[auth-api]---------------------------------------------------"
npm i --silent && npm update
cd ../auth-service
echo "[auth-service]---------------------------------------------------"
npm i --silent && npm update

# Root
cd ../../

# Analytic
cd analytic/analytic-api
echo  "[analytic-api]---------------------------------------------------"
npm i --silent && npm update
cd ../analytic-service
echo "[analytic-service]---------------------------------------------------"
npm i --silent && npm update

# Root
cd ../../

# Employee
cd employee/employee-api
echo "[employee-api]---------------------------------------------------"
npm i --silent && npm update
cd ../employee-service
echo "[employee-service]---------------------------------------------------"
npm i --silent && npm update

cd ../../

