#!/bin/bash

nums=$(ps aux | grep 'node ./bot.js' | awk '{print $2}')


for num in $nums; do
	sudo kill -9 "$num" && echo "PID $num terminated..."
done

node ./bot.js & 2>>bot.log &