export const dayOfTheWeek = (y: number, m: number, d: number) => {
  let t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  if (m < 3) y -= 1;

  return Math.round((y + y / 4 - y / 100 + y / 400 + t[m - 1] + d) % 7);
};

export const splitDate = (date: string) => {
  if (date.includes("T")) date = date.split("T")[0];
  const [day, month, year] = date.split("-");
  return {
    day: Number(day),
    month: Number(month),
    year: Number(year),
  };
};

export const skipTake = (limit: string, page: string) => {
  return {
    skip: Number(limit) * Number(page),
    take: Number(limit),
  };
};
