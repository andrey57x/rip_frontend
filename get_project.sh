#!/bin/bash

output_file="project_contents.txt"
> "$output_file"

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.json" -o -name "*.js" -o -name "*.jsx" \) ! -path "*/node_modules/*" | while read -r file; do
    if [ -f "$file" ]; then
        echo "File: $file" >> "$output_file"
        echo "==========================================" >> "$output_file"
        cat "$file" >> "$output_file"
        echo -e "\n\n" >> "$output_file"
    fi
done

echo "Содержимое проекта сохранено в $output_file"
