#!/usr/bin/env bash

# NB!!!!!!!!!!!! DO NOT RUN THIS FILE UNLESS SPECIFICALLY TOLD SO !!!!!!!!!!!!!!!!!

# Auth
cd auth/auth-api
echo "[auth-api]: Getting latest concept-common package"
npm install @espressotrip-org/concept-common@latest
cd ../auth-service
echo "[auth-service]: Getting latest concept-common package"
npm install @espressotrip-org/concept-common@latest
echo "[auth-service]: Done"
# Root
cd ../../

# Analytic
cd analytic/analytic-api
echo  "[analytic-api]: Getting latest concept-common package"
npm install @espressotrip-org/concept-common@latest
echo  "[analytic-api]: Done"
cd ../analytic-service
echo "[analytic-service]: Getting latest concept-common package"
npm install @espressotrip-org/concept-common@latest
echo "[analytic-service]: Done"
# Root
cd ../../

# Employee
cd employee/employee-api
echo "[employee-api]: Getting latest concept-common package"
npm install @espressotrip-org/concept-common@latest
echo "[employee-api]: Done"
cd ../employee-service
echo "[employee-service]: Getting latest concept-common package"
npm install @espressotrip-org/concept-common@latest
echo "[employee-service]: Done"
cd ../../

# Log
cd log/log-service
echo "[log-service]: Getting latest concept-common package"
npm install @espressotrip-org/concept-common@latest
echo "[log-service]: Done"

cd ../../