#!/bin/bash

# This script:
# - picks a random folder
# - runs the start.sh script for a series of artworks
# - stops after d seconds
# - closes the older browser tab while keeping the new one
# - repeats

# duration of each art series, in seconds
d=10

# Detect operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
    is_mac=true
    echo "Running on macOS"
else
    is_mac=false
    echo "Running on Linux or other system"
fi

# Function to close the older browser tab based on OS
close_older_browser_tab() {
    if [ "$is_mac" = true ]; then
        # For macOS: Close the older tab in Brave Browser (keep the newest one)
        osascript <<EOD
        tell application "Brave Browser"
            set windowList to every window
            repeat with aWindow in windowList
                set tabList to every tab of aWindow
                set tabCount to count of tabList
                if tabCount > 1 then
                    close tab 1 of aWindow
                    exit repeat
                end if
            end repeat
        end tell
EOD
    else
        # For Linux: Using xdotool to close the older tab (Ctrl+W on the first tab)
        if command -v xdotool &> /dev/null; then
            # Focus the browser window
            xdotool search --onlyvisible --class "firefox|chrome|chromium|brave" windowfocus
            # Switch to first tab (Ctrl+1) and close it (Ctrl+W)
            xdotool key ctrl+1 ctrl+w
        else
            echo "xdotool not installed. Cannot close browser tabs automatically on Linux."
        fi
    fi
}

i=0
while true; do 
    # List all subdirectories, excluding the current directory (.)
    if [ "$is_mac" = true ]; then
        # macOS version - using fixed list
        dirlist=$(find . -type d -maxdepth 1 -mindepth 1 -not -name "." -print0 | xargs -0 -n1 basename)
    else
        # Linux version of find
        dirlist=$(find . -maxdepth 1 -type d | grep -v "^\.$")
    fi

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

    # Select a random element from the list
    random_subdir=$(printf "%s\n" "${dirlist[@]}" | gshuf -n 1)

    # Print the randomly selected subdirectory
    echo "Randomly selected subdirectory: $random_subdir"

    # Check if start.sh exists in the selected subdirectory
    start_script="$random_subdir/start_mac.sh"
    if [[ -f "$start_script" ]]; then
        echo "Found 'start_mac.sh' in $random_subdir. Launching script..."

        # Make sure the script is executable
        chmod +x "$start_script"

        # Change to the directory and start the script
        (
            cd "$random_subdir"
            ./start_mac.sh &
            script_pid=$!
            echo $script_pid > .server_pid

            echo "Script will run for $d seconds..."
            sleep 2  # Give the browser time to open
            
            if (( i > 0 )); then
                echo "Closing older browser tab..."
                close_older_browser_tab
            else
                echo "First tab left open."
            fi
            sleep $((d - 2))

            if kill $script_pid 2>/dev/null; then
                echo "Script stopped after $d seconds."
            else
                echo "Script completed before timeout."
            fi
            
            # Kill the HTTP server started by start.sh
            server_pid_file="$random_subdir/.server_pid"
            if [[ -f "$server_pid_file" ]]; then
                server_pid=$(cat "$server_pid_file")
                kill $server_pid 2>/dev/null && echo "Killed local server (PID $server_pid)"
                rm "$server_pid_file"
            fi
        )
        ((i++))
    else
        echo "No 'start_mac.sh' script found in $random_subdir."
    fi

    sleep 1 
done
