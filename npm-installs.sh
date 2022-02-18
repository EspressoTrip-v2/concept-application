#!/usr/bin/env bash

# Convenience scripts to install and update packages

# Auth
cd auth/auth-api
echo "[auth-api]: install and update"
npm i
npm update
cd ../auth-service
echo "[auth-service]: install and update"
npm i && npm update

# Root
cd ../../

# Analytic
cd analytic/analytic-api
echo  "[analytic-api]: install and update"
npm i
npm update @espressotrip-org/concept-common

cd ../analytic-api
echo "[analytic-service]: install and update"
npm i && npm update

# Root
cd ../../

# Employee
cd employee/employee-api
echo "[employee-api]: install and update"
npm i
npm update @espressotrip-org/concept-common
cd ../employee-service
echo "[employee-service]: install and update"
npm i && npm update

cd ../../

