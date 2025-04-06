import re
import csv
import sys

# Check if both input and output file arguments are provided
if len(sys.argv) < 3:
    print("Usage: python script.py <input_text_file> <output_csv_file>")
    sys.exit(1)

# Read the input and output file paths from command-line arguments
input_file = sys.argv[1]
output_csv_file = sys.argv[2]

# Read the text from the provided input file
with open(input_file, 'r') as file:
    text = file.read()

# Regex pattern to capture the required fields
pattern = re.compile(r"""
    Sent\s+Rs\.(?P<amount>\d+\.?\d*)          # Extract amount (e.g., Rs.467.99)
    .*?                                       # Non-greedy match for any text
    To\s+(?P<to>[\w]+)                      # Extract 'To' field (e.g., bigbasket)
    .*?                                       # Non-greedy match for any text
    Ref\s+(?P<ref_id>\d+)                     # Extract reference ID (e.g., 509548055600)
""", re.VERBOSE | re.DOTALL)

# Extract matches
matches = pattern.finditer(text)

# Write extracted data to the specified CSV file
with open(output_csv_file, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Sent Amount', 'To', 'Ref ID'])  # CSV headers
    
    # Writing each matched transaction to the CSV
    for match in matches:
        writer.writerow([
            f"{match.group('amount')}",
            match.group('to'),
            match.group('ref_id')
        ])

print(f"Data successfully saved to {output_csv_file}")

