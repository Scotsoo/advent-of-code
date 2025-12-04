#!/bin/bash
process_rolls() {
  local -a lines=()
  while IFS= read -r line || [ -n "$line" ]; do
    lines+=("$line")
  done < input.txt
  local -i length=${#lines[@]}
  local -i x_length=${#lines[0]}
  local -i sum_of_all_forklift_capable=0
  local remove_rolls=$1
  local continue_removing=true
  while [[ $continue_removing = true ]] ; do
    local -a found_rolls_x=()
    local -a found_rolls_y=()
    for ((y=0; y<length; y++)); do
      local current_line=${lines[$y]}
      for ((x=0; x<x_length; x++)); do
        local current_char=${current_line:$x:1}
        # Skip if we're not a roll
        if [[ $current_char != "@" ]]; then
          continue
        fi
        local -i sum_of_adjacent=0
        local check_above=false 
        [[ $y -gt 0 ]] && check_above=true
        local check_below=false 
        [[ $y -lt $((length-1)) ]] && check_below=true
        local check_left=false 
        [[ $x -gt 0 ]] && check_left=true
        local check_right=false 
        [[ $x -lt $((x_length-1)) ]] && check_right=true
        if [[ $check_above = true ]]; then
          local above_char=${lines[$((y-1))]:$x:1}
          if [[ $above_char == "@" ]]; then
            sum_of_adjacent=$((sum_of_adjacent + 1))
          fi
          if [[ $check_left = true ]]; then
            local left_char=${lines[$((y-1))]:$((x-1)):1}
            if [[ $left_char == "@" ]]; then
              sum_of_adjacent=$((sum_of_adjacent + 1))
            fi
          fi
          if [[ $check_right = true ]]; then
            local right_char=${lines[$((y-1))]:$((x+1)):1}
            if [[ $right_char == "@" ]]; then
              sum_of_adjacent=$((sum_of_adjacent + 1))
            fi
          fi
        fi
        if [[ $check_below = true ]]; then
          local below_char=${lines[$((y+1))]:$x:1}
          if [[ $below_char == "@" ]]; then
            sum_of_adjacent=$((sum_of_adjacent + 1))
          fi
          if [[ $check_left = true ]]; then
            local left_char=${lines[$((y+1))]:$((x-1)):1}
            if [[ $left_char == "@" ]]; then
              sum_of_adjacent=$((sum_of_adjacent + 1))
            fi
          fi
          if [[ $check_right = true ]]; then
            local right_char=${lines[$((y+1))]:$((x+1)):1}
            if [[ $right_char == "@" ]]; then
              sum_of_adjacent=$((sum_of_adjacent + 1))
            fi
          fi
        fi
        if [[ $check_left = true ]]; then
          local left_char=${lines[$y]:$((x-1)):1}
          if [[ $left_char == "@" ]]; then
            sum_of_adjacent=$((sum_of_adjacent + 1))
          fi
        fi
        if [[ $check_right = true ]]; then
          local right_char=${lines[$y]:$((x+1)):1}
          if [[ $right_char == "@" ]]; then
            sum_of_adjacent=$((sum_of_adjacent + 1))
          fi
        fi
        if [[ $sum_of_adjacent -lt 4 ]]; then
          found_rolls_x+=("$x")
          found_rolls_y+=("$y")
          sum_of_all_forklift_capable=$((sum_of_all_forklift_capable + 1))
        fi
      done
    done
    if [[ $remove_rolls = true ]]; then
      if [[ ${#found_rolls_x[@]} -eq 0 ]]; then
        continue_removing=false
      fi
      for ((i=0; i<${#found_rolls_x[@]}; i++)); do
        local x=${found_rolls_x[$i]}
        local y=${found_rolls_y[$i]}
        lines[y]="${lines[$y]:0:x}.${lines[$y]:x+1}"
      done
    else 
      continue_removing=false
   fi
  done

  echo $sum_of_all_forklift_capable
}

part1() {
  process_rolls false
}
part2() {
  process_rolls true
}
echo "part1: $(part1)"
echo "part2: $(part2)"