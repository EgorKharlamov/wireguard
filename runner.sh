#!/bin/bash

a_flag=''
b_flag=''
files=''
args="${@:2}"

print_usage() {
  printf "Usage: ..."
}

while getopts 'gsr' flag; do
  case "${flag}" in
    g) a_flag='true'; node worker.js get ;;
    s) b_flag='true'; node worker.js set "$args" ;;
    r) files='true'; node worker.js remove "$args" ;;
    *) print_usage
       exit 1 ;;
  esac
done

# docker compose down && docker compose up -d
