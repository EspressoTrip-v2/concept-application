#!/usr/bin/env bash

# NB!!!!!!!!!!!! DO NOT RUN THIS FILE UNLESS SPECIFICALLY TOLD SO !!!!!!!!!!!!!!!!!

# Auth
cd auth/auth-api
echo "[auth-api]: Updating"
npm update @espressotrip-org/concept-common --silent
echo "[auth-api]: Done"
cd ../auth-service
echo "[auth-service]: Updating"
npm update @espressotrip-org/concept-common --silent
echo "[auth-service]: Done"
# Root
cd ../../

# Analytic
cd analytic/analytic-api
echo  "[analytic-api]: Updating"
npm update @espressotrip-org/concept-common --silent
echo  "[analytic-api]: Done"
cd ../analytic-service
echo "[analytic-service]: Updating"
npm update @espressotrip-org/concept-common --silent
echo "[analytic-service]: Done"
# Root
cd ../../

# Employee
cd employee/employee-api
echo "[employee-api]: Updating"
npm update @espressotrip-org/concept-common --silent
echo "[employee-api]: Done"
cd ../employee-service
echo "[employee-service]: Updating"
npm update @espressotrip-org/concept-common --silent
echo "[employee-service]: Done"
cd ../../

# Log
cd log/log-service
echo "[log-service]: Updating"
npm update @espressotrip-org/concept-common --silent
echo "[log-service]: Done"

cd ../../