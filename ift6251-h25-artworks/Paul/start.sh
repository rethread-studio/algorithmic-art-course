#!/bin/sh
awhile=10
echo "executing each piece for $awhile seconds"
open ./Pixel-Sorting/exemples/purple_hazard.png &
sleep $awhile
pkill -f firefox
open ./Life/assets/ex2.png &
sleep $awhile
pkill -f firefox
open ./FlowLake/index.html &
sleep $awhile
pkill -f firefox
echo "done"
