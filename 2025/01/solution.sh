#!/bin/bash

DEBUG_ENABLED=false
debug_log () {
  if [ $DEBUG_ENABLED == true ]; then
    printf "[DEBUG] %s\n" "$1"
  fi
}
rotate_dial() {
  local -i dial_before=$1
  local -i safe_l=$2
  local -i safe_r=$3
  local direction=$4
  local -i digits=$5
  
  local -i zeros=0
  local -i dial
  
  # Calculate new dial position
  if [ "$direction" == "L" ]; then
    dial=$((dial_before - digits))
  elif [ "$direction" == "R" ]; then
    dial=$((dial_before + digits))
  fi
  
  if [ "$direction" == "L" ]; then
    if [ "$dial" -lt 0 ]; then
      # Calculate the number of times the dial has wrapped around 0
      # we need tmp_dial because this can be negative and we need a whole number
      local -i tmp_dial=$((100 + dial))
      local -i wrap_zeros
      if [ "$tmp_dial" -lt 0 ]; then
        wrap_zeros=$(((tmp_dial - 99) / 100 ))
      else
        wrap_zeros=$((tmp_dial / 100))
      fi
      # wrap_zeros might be negative, take absolute value
      if [ "$wrap_zeros" -lt 0 ]; then
        wrap_zeros=$((wrap_zeros * -1))
      fi
      zeros=$((zeros + wrap_zeros))
      if [ "$dial_before" -ne 0 ]; then
        zeros=$((zeros + 1))
      fi
    fi
  elif [ "$direction" == "R" ]; then
    zeros=$((dial / 100))
  fi
  
  dial=$(("$dial" % 100))
  if [ "$dial" -lt 0 ]; then
    dial=$((dial + 100))
  fi
  
  if [ "$direction" == "L" ] && [ "$dial" -eq 0 ]; then
    zeros=$((zeros + 1))
  fi
  
  ROTATED_DIAL=$dial
  TIMES_HIT_ZERO=$zeros
}

solution() {
  local -i part=$1
  local -i safe_l=0
  local -i safe_r=99
  local -i start_dial=50
  local -i dial=$start_dial
  local -i digits=0 
  local direction=""
  debug_log "Ths dial starts by pointing at $dial"
  local -i zero_count=0
  while IFS= read -r line || [ -n "$line" ]; do
    if [[ "$line" =~ ^(L|R)([0-9]+)$ ]]; then
      direction=${BASH_REMATCH[1]}
      digits=${BASH_REMATCH[2]}

    else 
      debug_log "Invalid line: $line"
      continue
    fi
    rotate_dial $dial $safe_l $safe_r "$direction" $digits
    dial=$ROTATED_DIAL
    local -i times_hit_zero=$TIMES_HIT_ZERO
    debug_log "The dial is rotated $direction$digits to point at $dial passing through zero $times_hit_zero times"
    if [ "$part" == 1 ] && [ "$dial" -eq 0 ]; then
      zero_count=$((zero_count + 1))
      debug_log "Zero count incremented to $zero_count"
    fi
    if [ "$part" == 2 ]; then
      zero_count=$((zero_count + times_hit_zero))
    fi
  done < input.txt
  echo "$zero_count"
}
part1() {
  solution 1
}
part2() {
  solution 2
}

echo "part1: $(part1)"
echo "part2: $(part2)"