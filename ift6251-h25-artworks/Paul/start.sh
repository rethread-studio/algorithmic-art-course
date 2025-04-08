#!/bin/sh
awhile=10
echo "executing each piece for $awhile seconds"
firefox ./Pixel-Sorting/exemples/purple_hazard.png &
sleep $awhile
pkill -f firefox
firefox ./Life/index.html &
sleep $awhile
pkill -f firefox
firefox ./FlowLake/results/a2600.png &
sleep $awhile
pkill -f firefox
echo "done"
