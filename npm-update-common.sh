#!/usr/bin/env bash

# NB!!!!!!!!!!!! DO NOT RUN THIS FILE UNLESS SPECIFICALLY TOLD SO !!!!!!!!!!!!!!!!!

# Auth
cd auth/auth-api
echo "[auth-api]: Updating"
npm update @espressotrip-org/concept-common
cd ../auth-service
echo "[auth-service]: Updating"
npm update @espressotrip-org/concept-common

# Root
cd ../../

# Analytic
cd analytic/analytic-api
echo  "[analytic-api]: Updating"
npm update @espressotrip-org/concept-common
cd ../analytic-service
echo "[analytic-service]: Updating"
npm update @espressotrip-org/concept-common

# Root
cd ../../

# Employee
cd employee/employee-api
echo "[employee-api]: Updating"
npm update
cd ../employee-service
echo "[employee-service]: Updating"
npm update

cd ../../

# Log
cd log/log-service
echo "[log-service]: Updating"
npm update @espressotrip-org/concept-common


cd ../../