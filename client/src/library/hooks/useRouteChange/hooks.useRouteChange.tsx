import { useRouter } from "next/navigation";

export const useRouteChange = () => {
  const { push, ...restProps } = useRouter();

  const routeChangeHandler = (url: string) => push(url);

  return { push: (url: string) => routeChangeHandler(url), ...restProps };
};
