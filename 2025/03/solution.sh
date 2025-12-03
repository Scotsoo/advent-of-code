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
    # printf "%s%s\n" $first_digit $second_digit
    total=$((total + (first_digit * 10) + second_digit))
  done < input.txt
  echo $total
}

print_current() {
  local -i multiplier=100000000000
  local -i joined_digits=0
  local -i k
  for ((k=0; k<digits_length; k++)); do
    joined_digits=$((joined_digits + (digits[$k] * multiplier)))
    multiplier=$((multiplier / 10))
  done
  printf "%s\n" $joined_digits
}

shift_digits() {
  local -i idx=$1
  local -i current_digit=$2
  local -i k
  for ((k=idx; k<digits_length-1; k++)); do
    # Fixed: use -gt for numeric comparison instead of > (string comparison)
    if [[ $current_digit -gt ${digits[k]} ]]; then
      # printf "XXXX swapping %s and %s\n" ${digits[$k]} ${digits[$((k+1))]}
      local -i swap_digit=${digits[$k]}
      digits[$k]=$current_digit
      idx=$((k+1))
      shift_digits $idx $swap_digit
      # Removed print_current call - too many calls causing I/O bottleneck
      break
    else 
      # printf "no swaVpping needed\n"
      # Removed print_current call
      break
    fi
  done
}

part2() {
  local -i total=0
  printf "part2\n" >&2
  while IFS= read -r line || [ -n "$line" ]; do
    local -i length=${#line}
    # wants to be a global array cause funcs use them
    digits=(
      ${line:length-12:1}
      ${line:length-11:1}
      ${line:length-10:1}
      ${line:length-9:1}
      ${line:length-8:1}
      ${line:length-7:1}
      ${line:length-6:1}
      ${line:length-5:1}
      ${line:length-4:1}
      ${line:length-3:1}
      ${line:length-2:1}
      ${line:length-1:1}
    )
    digits_length=${#digits[@]}
    # i is from right to left
    local -i max_index=$((length-12))
    for ((i=max_index; i>=0; i--)); do
      local -i current_line_item=${line:i:1}
      # j is from left to right
      for ((j=0; j<digits_length; j++)); do
        local -i current_digit=${digits[$j]}
        # Removed print_current call - too many calls causing I/O bottleneck
        if [[ $current_digit -lt $current_line_item ]] && [[ $j -lt $max_index ]]; then
          # printf "i: %s j: %s current_digit: %s current_line_item: %s\n" $i $j $current_digit $current_line_item
          # printf "==   swapping %s and %s\n" $current_digit $current_line_item
          digits[$j]=$current_line_item
          shift_digits $((j+1)) $current_digit
          # printf "== >>>"
          # Removed print_current call
          break
        fi
      done

      # print_current
      local -i joined_digits=0
      local -i multiplier=100000000000
      for ((j=0; j<digits_length; j++)); do
        joined_digits=$((joined_digits + (digits[$j] * multiplier)))
        multiplier=$((multiplier / 10))
      done
    done
    printf "%s\n" $joined_digits
    total=$((total + joined_digits))
  done < input.txt
  echo $total 
}

# echo "part1: $(part1)"
echo "part2: $(part2)"