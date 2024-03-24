const Response = (success: boolean, message: string, data: any) => {
  return {
    success,
    message,
    data,
  };
};
type IResponseCreator = typeof Response;

export type { IResponseCreator };
export default Response;
