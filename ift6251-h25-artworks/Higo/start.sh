#!/bin/sh
awhile=10
firefox ./ink-mountains/index.html &
sleep $awhile 
pkill -f firefox
firefox ./trees/index.html & 
sleep $awhile 
pkill -f firefox
firefox ./games/results/a2600.png &
sleep $awhile 
pkill -f firefox
