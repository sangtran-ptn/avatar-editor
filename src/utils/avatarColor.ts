export const getAvatarColor = (initials: string) => {
  const colors = ['#FF8A80','#FFD180','#FFFF8D','#A7FFEB','#80D8FF','#82B1FF','#B388FF'];
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash += initials.charCodeAt(i);
  }
  return colors[hash % colors.length];
};
