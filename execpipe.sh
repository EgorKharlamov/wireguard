#!/bin/bash 

PATH=./runner.pipe
cat=/usr/bin/cat

while true; do eval "$($cat $PATH)"; done
