#!/bin/sh
awhile=10
echo "executing each piece for $awhile seconds"
open ./Pixel-Sorting/index.html &
sleep $awhile
open ./Life/index.html &
sleep $awhile
open ./FlowLake/index.html &
sleep $awhile
echo "done"
