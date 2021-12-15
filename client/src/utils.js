export const difficultyColor = (mode) => {
  switch (mode) {
    case "Easy":
      return "text-green-500";
    case "Medium":
      return "text-yellow-400";
    case "Hard":
      return "text-red-500";
    default:
      return "text-black";
  }
};

export const categoryColor = (category) => {
  switch (category) {
    case "Array":
      return "text-blue-500";
    case "String":
      return "text-indigo-500";
    case "Algorithms":
      return "text-purple-500";
    case "Recursion":
      return "text-indigo-900";
    case "Math":
      return "text-blue-700";
    case "Sorting":
      return "text-purple-700";
    case "Matrix":
      return "text-indigo-700";
    case "Hash Table":
      return "text-blue-900";
    case "Two Pointers":
      return "text-green-900";
    case "Greedy":
      return "text-purple-900";
    case "Backtracking":
      return "text-blue-900";
    default:
      return "text-black";
  }
};

export const showedOrderArrow = (name, order, sortBy) => {
  if (sortBy.name !== name) {
    return "block";
  } else if (sortBy.order === order) {
    return "hidden";
  }
};
