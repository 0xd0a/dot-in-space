#!/bin/sh

mvn package

java -jar ./target/dot-in-space-hive-0.1.0.jar
