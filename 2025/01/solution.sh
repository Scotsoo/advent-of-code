#!/bin/bash

rotate_dial() {
  local -i dial_before=$1
  local direction=$2
  local -i digits=$3
  
  local -i zeros=0
  local -i dial
  [ "$direction" == "L" ] && dial=$((dial_before - digits)) || dial=$((dial_before + digits))
  
  if [ "$direction" == "L" ]; then
    if [ "$dial" -lt 0 ]; then
      local -i tmp=$((100 + dial))
      local -i wrap_zeros
      if [ "$tmp" -lt 0 ]; then
        wrap_zeros=$(((tmp - 99) / 100))
      else
        wrap_zeros=$((tmp / 100))
      fi
      [ "$wrap_zeros" -lt 0 ] && wrap_zeros=$((wrap_zeros * -1))
      zeros=$((zeros + wrap_zeros))
      [ "$dial_before" -ne 0 ] && zeros=$((zeros + 1))
    fi
  else
    zeros=$((dial / 100))
  fi
  
  dial=$((dial % 100))
  [ "$dial" -lt 0 ] && dial=$((dial + 100))
  [ "$direction" == "L" ] && [ "$dial" -eq 0 ] && zeros=$((zeros + 1))
  
  ROTATED_DIAL=$dial
  TIMES_HIT_ZERO=$zeros
}

solution() {
  local -i part=$1
  local -i dial=50
  local -i zero_count=0
  
  while IFS= read -r line || [ -n "$line" ]; do
    [[ "$line" =~ ^(L|R)([0-9]+)$ ]] || continue
    rotate_dial $dial "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}"
    dial=$ROTATED_DIAL
    if [ "$part" == 1 ] && [ "$dial" -eq 0 ]; then
      zero_count=$((zero_count + 1))
    elif [ "$part" == 2 ]; then
      zero_count=$((zero_count + TIMES_HIT_ZERO))
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