export const messageResponse = (statusCode: number, data: any) => {
  return {
    statusCode,
    data,
  } as TResponse;
};
