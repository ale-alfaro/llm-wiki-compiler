---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---



- [Zsh vs Bash scripting-and-compatibility](https://betterstack.com/community/guides/linux/zsh-vs-bash/#scripting-and-compatibility)

- [Zsh vs Bash Startup Compared](https://gist.github.com/Linerre/f11ad4a6a934dcf01ee8415c9457e7b2)

  - MacOS has some finicky zsh dotfiles.
    Rule of thumb is to NOT use ~/.zshenv.
    Start your environment setup in $ZDOTDIR/.zprofile

Two scripts, one written in bash and the other in zsh

```bash
#!/bin/bash
# Example Bash script demonstrating common patterns

# Define variables
USER_NAME="Admin"
LOG_FILE="/var/log/backup.log"

# Function definition
backup_data() {
    local source_dir="$1"
    local dest_dir="$2"

    echo "Starting backup from $source_dir to $dest_dir"

    # Error handling with exit codes
    rsync -av "$source_dir" "$dest_dir"
    if [ $? -ne 0 ]; then
        echo "Backup failed with error code $?" | tee -a "$LOG_FILE"
        return 1
    fi

    echo "Backup completed successfully at $(date)" | tee -a "$LOG_FILE"
    return 0
}

# Command-line argument handling
if [ $# -lt 2 ]; then
    echo "Usage: $0 <source_directory> <destination_directory>"
    exit 1
fi

# Main script execution
echo "=== Backup Script Started by $USER_NAME ==="
backup_data "$1" "$2"
EXIT_CODE=$?

# Using arrays
FAILED_ITEMS=()
if [ $EXIT_CODE -ne 0 ]; then
    FAILED_ITEMS+=("$1")
    echo "Failed items: ${FAILED_ITEMS[*]}"
fi

exit $EXIT_CODE
```

```zsh
#!/usr/bin/env zsh
# Example Zsh script demonstrating enhanced features

# Define variables similarly to Bash
USER_NAME="Admin"
LOG_FILE="/var/log/backup.log"

# Function with enhanced parameter handling
backup_data() {
    local source_dir="$1"
    local dest_dir="$2"

    print "Starting backup from $source_dir to $dest_dir"

    # Error handling with extended features
    rsync -av "$source_dir" "$dest_dir"
    if (( $? != 0 )); then
        print "Backup failed with error code $?" | tee -a "$LOG_FILE"
        return 1
    fi

    print "Backup completed successfully at $(date)" | tee -a "$LOG_FILE"
    return 0
}

# Enhanced argument handling
if (( $# < 2 )); then
    print "Usage: $0 <source_directory> <destination_directory>"
    exit 1
fi

# Array handling (note the different syntax)
typeset -a FAILED_ITEMS
typeset -A SUCCESS_MAP  # Associative array (not available in basic Bash)

# Main script execution
print "=== Backup Script Started by $USER_NAME ==="
backup_data "$1" "$2"
EXIT_CODE=$?

# Extended pattern matching and array operations
if (( EXIT_CODE != 0 )); then
    FAILED_ITEMS+=("$1")
    print "Failed items: ${(j:, :)FAILED_ITEMS}"  # Join array with commas
else
    SUCCESS_MAP[$1]="$(date)"  # Store success timestamp in associative array
    print "Successful backups:"
    for key val in "${(@kv)SUCCESS_MAP}"; do
        print "  - $key: $val"
    done
fi

exit $EXIT_CODE
```
