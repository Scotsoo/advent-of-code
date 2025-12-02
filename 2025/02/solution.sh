#!/bin/bash
part1() {
  IFS=',' read -ra values < input.txt
  local -i total_added=0
  for value in "${values[@]}"; do
    IFS='-' read -ra range <<< "$value"
    start=${range[0]}
    end=${range[1]}

    for ((i=start; i<=end; i++)); do
      # skip odd lengths
      if [[ $((${#i}%2)) -ne 0 ]]; then
        continue
      fi
      first_half=${i:0:$((${#i}/2))}
      second_half=${i:$((${#i}/2)):$((${#i}/2))}
      if [[ "$first_half" = "$second_half" ]]; then
        printf "found: %s\n" "$i"
        total_added=$((total_added + i))
        continue
      fi
    done
  done
  echo "Part 1: $total_added"
}

part2() {
  IFS=',' read -ra values < input.txt
  local -i total_added=0
  for value in "${values[@]}"; do
    IFS='-' read -ra range <<< "$value"
    start=${range[0]}
    end=${range[1]}
    for ((i=start; i<=end; i++)); do
      local -i length=${#i}
      for ((j=2; j<=length; j++)); do
        divisor=$((length/j))
        # If we can't divide the length evenly, skip
        if [[ $((divisor * j)) -ne $length ]]; then
          continue
        fi
        # Extract the first segment and compare with all others
        local first_segment=${i:0:divisor}
        local all_match=true
        
        # Check all other segments against the first
        for ((k = divisor; k < length; k += divisor)); do
          local current=${i:k:divisor}
          if [[ "$first_segment" != "$current" ]]; then
            all_match=false
            break
          fi
        done
        
        if [[ $all_match = true ]]; then
          printf "found: %s\n" "$i"
          total_added=$((total_added + i))
          break
        fi
      done
    done
  done
  echo "Part 2: $total_added"
}

part1

part2