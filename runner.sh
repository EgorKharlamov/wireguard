#!/bin/bash

a_flag=''
b_flag=''
files=''
args="${@:2}"
node=/usr/bin/node
worker_path=./worker.js

print_usage() {
  printf "Usage: ..."
}

while getopts 'gsr' flag; do
  case "${flag}" in
    g) a_flag='true'; $node $worker_path get ;;
    s) b_flag='true'; $node $worker_path set $args ;;
    r) files='true'; $node $worker_path remove $args ;;
    *) print_usage
       exit 1 ;;
  esac
done

# docker compose down && docker compose up -d
