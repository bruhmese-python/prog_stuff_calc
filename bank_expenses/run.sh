#!/bin/bash

# Execute the first Python script and wait for it to complete
python3.9 spendings_msg_backup_keep_to_bank_expenses
# Check if the first script executed successfully
if [ $? -eq 0 ]; then
    # Prompt the user to continue
    read -p "Do you want to continue with the next steps? (y/n): " choice

    # If the user answers 'y', execute the next Python script
    if [ "$choice" == "y" ]; then
        python3.9 generate_report.py sms.txt data.csv
        # After executing sms.txt and data.csv, run app.py
        python3.9 app.py
    else
        echo "Operation aborted by the user."
    fi
else
    echo "The first script did not execute successfully. Exiting."
fi

