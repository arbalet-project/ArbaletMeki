let charMap = new Map([
    ["A", [0, 1, 0, 2, 0, 3, 0, 4, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 1, 3, 2, 3, 3, 3, 4, 4, 0, 4, 4, 5, 0, 5, 4, 6, 0, 6, 4]],
    ["B", [0, 0, 0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 1, 3, 2, 3, 3, 4, 0, 4, 4, 5, 0, 5, 4, 6, 0, 6, 1, 6, 2, 6, 3]],
    ["C", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 3, 0, 4, 0, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["D", [0, 0, 0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 4, 4, 0, 4, 4, 5, 0, 5, 4, 6, 0, 6, 1, 6, 2, 6, 3]],
    ["E", [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 1, 0, 2, 0, 3, 0, 3, 1, 3, 2, 3, 3, 4, 0, 5, 0, 6, 0, 6, 1, 6, 2, 6, 3, 6, 4]],
    ["F", [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 1, 0, 2, 0, 3, 0, 3, 1, 3, 2, 3, 3, 4, 0, 5, 0, 6, 0]],
    ["G", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 3, 0, 4, 0, 4, 3, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["H", [0, 0, 0, 4, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 1, 3, 2, 3, 3, 3, 4, 4, 0, 4, 4, 5, 0, 5, 4, 6, 0, 6, 4]],
    ["I", [0, 1, 0, 2, 0, 3, 1, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 1, 6, 2, 6, 3]],
    ["J", [0, 3, 0, 4, 1, 4, 2, 4, 3, 4, 4, 0, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["K", [0, 0, 0, 4, 1, 0, 1, 3, 2, 0, 2, 2, 3, 0, 3, 1, 4, 0, 4, 2, 5, 0, 5, 3, 6, 0, 6, 4]],
    ["L", [0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 6, 1, 6, 2, 6, 3, 6, 4]],
    ["M", [0, 0, 0, 4, 1, 0, 1, 1, 1, 3, 1, 4, 2, 0, 2, 2, 2, 4, 3, 0, 3, 4, 4, 0, 4, 4, 5, 0, 5, 4, 6, 0, 6, 4]],
    ["N", [0, 0, 0, 4, 1, 0, 1, 4, 2, 0, 2, 1, 2, 4, 3, 0, 3, 2, 3, 4, 4, 0, 4, 3, 4, 4, 5, 0, 5, 4, 6, 0, 6, 4]],
    ["O", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 4, 4, 0, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["P", [0, 0, 0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 1, 3, 2, 3, 3, 4, 0, 5, 0, 6, 0]],
    ["Q", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 4, 4, 0, 4, 2, 4, 4, 5, 0, 5, 3, 6, 1, 6, 2, 6, 4]],
    ["R", [0, 0, 0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 1, 3, 2, 3, 3, 4, 0, 4, 4, 5, 0, 5, 4, 6, 0, 6, 4]],
    ["S", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 3, 1, 3, 2, 3, 3, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["T", [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 1, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2]],
    ["U", [0, 0, 0, 4, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 4, 4, 0, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["V", [0, 0, 0, 4, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 4, 4, 0, 4, 4, 5, 1, 5, 3, 6, 2]],
    ["W", [0, 0, 0, 4, 1, 0, 1, 4, 2, 0, 2, 4, 3, 0, 3, 4, 4, 0, 4, 2, 4, 4, 5, 0, 5, 2, 5, 4, 6, 1, 6, 3]],
    ["X", [0, 0, 0, 4, 1, 0, 1, 4, 2, 1, 2, 3, 3, 2, 4, 1, 4, 3, 5, 0, 5, 4, 6, 0, 6, 4]],
    ["Y", [0, 0, 0, 4, 1, 0, 1, 4, 2, 1, 2, 3, 3, 2, 4, 2, 5, 2, 6, 2]],
    ["Z", [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 1, 4, 2, 3, 3, 2, 4, 1, 5, 0, 6, 0, 6, 1, 6, 2, 6, 3, 6, 4]],
    ["a", [2, 2, 2, 3, 3, 4, 4, 2, 4, 3, 4, 4, 5, 1, 5, 4, 6, 2, 6, 3, 6, 4]],
    ["b", [0, 1, 1, 1, 2, 1, 3, 1, 3, 2, 3, 3, 4, 1, 4, 4, 5, 1, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["c", [2, 2, 2, 3, 3, 1, 3, 4, 4, 1, 5, 1, 5, 4, 6, 2, 6, 3]],
    ["d", [0, 4, 1, 4, 2, 4, 3, 2, 3, 3, 3, 4, 4, 1, 4, 4, 5, 1, 5, 4, 6, 2, 6, 3, 6, 4]],
    ["e", [2, 2, 2, 3, 3, 1, 3, 4, 4, 1, 4, 2, 4, 3, 4, 4, 5, 1, 6, 2, 6, 3]],
    ["f", [0, 3, 0, 4, 1, 2, 2, 2, 2, 3, 2, 4, 3, 2, 4, 2, 5, 2, 6, 2]],
    ["g", [0, 2, 0, 3, 0, 4, 1, 1, 1, 4, 2, 1, 2, 4, 3, 2, 3, 3, 3, 4, 4, 4, 5, 4, 6, 2, 6, 3]],
    ["h", [0, 1, 1, 1, 2, 1, 3, 1, 3, 2, 3, 3, 4, 1, 4, 4, 5, 1, 5, 4, 6, 1, 6, 4]],
    ["i", [0, 2, 3, 2, 4, 2, 5, 2, 6, 2]],
    ["j", [0, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 1]],
    ["k", [0, 1, 1, 1, 1, 4, 2, 1, 2, 3, 3, 1, 3, 2, 4, 1, 4, 3, 5, 1, 5, 4, 6, 1, 6, 4]],
    ["l", [0, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4]],
    ["m", [2, 0, 2, 1, 2, 2, 2, 3, 3, 0, 3, 2, 3, 4, 4, 0, 4, 2, 4, 4, 5, 0, 5, 2, 5, 4, 6, 0, 6, 2, 6, 4]],
    ["n", [2, 1, 2, 2, 2, 3, 3, 1, 3, 4, 4, 1, 4, 4, 5, 1, 5, 4, 6, 1, 6, 4]],
    ["o", [3, 2, 3, 3, 4, 1, 4, 4, 5, 1, 5, 4, 6, 2, 6, 3]],
    ["p", [0, 2, 0, 3, 1, 1, 1, 4, 2, 1, 2, 4, 3, 1, 3, 2, 3, 3, 4, 1, 5, 1, 6, 1]],
    ["q", [0, 2, 0, 3, 1, 1, 1, 4, 2, 1, 2, 4, 3, 1, 3, 4, 4, 2, 4, 3, 4, 4, 5, 4, 6, 4]],
    ["r", [2, 1, 2, 3, 2, 4, 3, 1, 3, 2, 4, 1, 5, 1, 6, 1]],
    ["s", [2, 2, 2, 3, 2, 4, 3, 1, 4, 2, 4, 3, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["t", [1, 2, 2, 2, 3, 1, 3, 2, 3, 3, 3, 4, 4, 2, 5, 2, 6, 3, 6, 4]],
    ["u", [2, 1, 2, 4, 3, 1, 3, 4, 4, 1, 4, 4, 5, 1, 5, 4, 6, 2, 6, 3, 6, 4]],
    ["v", [2, 0, 2, 4, 3, 0, 3, 4, 4, 0, 4, 4, 5, 1, 5, 3, 6, 2]],
    ["w", [2, 0, 2, 4, 3, 0, 3, 4, 4, 0, 4, 2, 4, 4, 5, 0, 5, 2, 5, 4, 6, 1, 6, 3]],
    ["x", [2, 1, 2, 4, 3, 1, 3, 4, 4, 2, 4, 3, 5, 1, 5, 4, 6, 1, 6, 4]],
    ["y", [0, 1, 0, 4, 1, 1, 1, 4, 2, 1, 2, 4, 3, 2, 3, 3, 3, 4, 4, 4, 5, 4, 6, 2, 6, 3]],
    ["z", [2, 1, 2, 2, 2, 3, 2, 4, 3, 4, 4, 2, 4, 3, 5, 1, 6, 1, 6, 2, 6, 3, 6, 4]],
    ["1", [0, 2, 1, 1, 1, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 1, 6, 2, 6, 3]],
    ["2", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 4, 3, 2, 3, 3, 4, 1, 5, 0, 6, 0, 6, 1, 6, 2, 6, 3, 6, 4]],
    ["3", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 4, 3, 2, 3, 3, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["4", [0, 3, 0, 4, 1, 2, 1, 4, 2, 1, 2, 4, 3, 0, 3, 4, 4, 0, 4, 1, 4, 2, 4, 3, 4, 4, 5, 4, 6, 4]],
    ["5", [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 1, 0, 2, 0, 2, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["6", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 3, 0, 3, 1, 3, 2, 3, 3, 4, 0, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["7", [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 1, 4, 2, 3, 3, 2, 4, 1, 5, 1, 6, 1]],
    ["8", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 2, 4, 3, 1, 3, 2, 3, 3, 4, 0, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["9", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 2, 4, 3, 1, 3, 2, 3, 3, 3, 4, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["0", [0, 1, 0, 2, 0, 3, 1, 0, 1, 4, 2, 0, 2, 3, 2, 4, 3, 0, 3, 2, 3, 4, 4, 0, 4, 1, 4, 4, 5, 0, 5, 4, 6, 1, 6, 2, 6, 3]],
    ["♥", [2, 1, 2, 3, 3, 0, 3, 1, 3, 2, 3, 3, 3, 4, 4, 0, 4, 1, 4, 2, 4, 3, 4, 4, 5, 1, 5, 2, 5, 3, 6, 2]]
]);