#! /bin/bash

# this script 
# picks a random folder
# runs the start.sh script for a series of artworks
# stops after d seconds
# repeat

# duration of each art series, in seconds
d=3

#find -maxdepth 1 -type d
# List all subdirectories, excluding the current directory (.)
dirlist=$(find -mindepth 1 -maxdepth 1 -type d)

# Print the list of subdirectories
echo "Art directories:"
echo "$dirlist"

# Convert the list into an array
IFS=$'\n' read -rd '' -a subdirs <<< "$dirlist"

# Check if the list is not empty
if [ ${#subdirs[@]} -eq 0 ]; then
    echo "No subdirectories found."
    exit 0
fi

# Print the list of subdirectories
echo "Art directories in an array:"
for subdir in "${subdirs[@]}"; do
    echo "$subdir"
done

 # Select a random element from the list
random_subdir=${subdirs[$RANDOM % ${#subdirs[@]}]}

# Print the randomly selected subdirectory
echo "Randomly selected subdirectory: $random_subdir"

# Check if start.sh exists in the selected subdirectory
start_script="$random_subdir/start.sh"

if [[ -f "$start_script" ]]; then
    echo "Found 'start.sh' in $random_subdir. Launching script..."
    
    # Change directory to the selected subdirectory and run start.sh with a timeout of 180 seconds
    #cd "$random_subdir" 
    #./start.sh
    (cd "$random_subdir" &&  timeout $d ./start.sh)
        
    if [ $? -eq 124 ]; then
        echo "'start.sh' was stopped after $d seconds."
    else
        echo "'start.sh' completed execution."
    fi
else
    echo "No 'start.sh' script found in $random_subdir."
fi