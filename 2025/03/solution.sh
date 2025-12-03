#!/bin/bash

part1() {
  local -i total=0
  while IFS= read -r line || [ -n "$line" ]; do
    local -i length=${#line}
    local -i first_digit=${line:0:1}
    local -i second_digit=${line:1:1}
    for ((i=1; i<length; i++)); do
      local -i current_digit=${line:i:1}
      if [[ $current_digit -gt $first_digit && $i -lt $((length-1)) ]]; then
        first_digit=$current_digit
        second_digit=${line:i+1:1}
        continue
      fi
      if [ $current_digit -gt $second_digit ]; then
        second_digit=$current_digit
      fi
    done
    total=$((total + (first_digit * 10) + second_digit))
  done < input.txt
  echo $total
}
find_largest_digit_in_range() {
  local line=$1
  local start=$2
  local end=$3
  local -i largest=0
  local -i found_index=-1
  
  for ((i=start; i<end; i++)); do
    local -i digit=${line:i:1}
    if [[ $digit -gt $largest ]]; then
      largest=$digit
      found_index=$i
      if [[ $digit -eq 9 ]]; then
        break
      fi
    fi
  done
  
  echo "$largest $found_index"
}
part2() {
  local -i total=0
  local -i digits_needed=12
  while IFS= read -r line || [ -n "$line" ]; do
    local -i line_len=${#line}
    local -i search_start=0
    local -i joltage_value=0
    
    for ((pos=0; pos<digits_needed; pos++)); do
      local -i search_end=$((line_len - digits_needed + pos + 1))
      local -i result=0
      result=$(find_largest_digit_in_range "$line" $search_start $search_end)
      # result%% * gives the first word and result##* gives the second word saves using awk etc
      local -i digit=${result%% *}
      search_start=${result##* }
      search_start=$((search_start + 1))
      
      joltage_value=$((joltage_value * 10 + digit))
    done
    
    total=$((total + joltage_value))
  done < input.txt
  echo $total
}

echo "part1: $(part1)"
echo "part2: $(part2)"