#!/bin/bash

cd $1
npx cucumber-js --tags @$2 --format html:report.html
