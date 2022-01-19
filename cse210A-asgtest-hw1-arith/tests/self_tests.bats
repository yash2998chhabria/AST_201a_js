load harness

@test "self-1" {
  check '(2 % 3 + 4)' '6'
}

@test "self-2" {
  check '16 % (3 + 4)' '2'
}

@test "self-3" {
  check '100 % (-3 + 4)' '0'
}

@test "self-4" {
  check '-1 * 4 + (2 + 3 * 2)' '4'
}

@test "self-5" {
  check ' 7 * (-5 + 3 % 3)' '-35'
}