#!/bin/bash

bash .bin/builder-js.sh

cp -r src/electron/* app

node_modules/.bin/electron .