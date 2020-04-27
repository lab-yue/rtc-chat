import { User } from '@prisma/client';

type SuccessResponse = { status: 200 };

type APICollection = {
  '/signup': User;
  '/signin': User;
};
export type ErrorResponse = {
  message: string;
  ref?: string;
};

type APIResponse<T> = {
  data?: T;
  error?: ErrorResponse[];
};
export async function useAPI<P extends keyof APICollection, D = object>(
  path: P,
  postData?: D
): Promise<APIResponse<APICollection[P]>> {
  console.log(`request to "/api${path}", ${JSON.stringify(postData)}`);
  try {
    let res: Response;
    if (postData === undefined) {
      res = await fetch(`/api${path}`);
    } else {
      res = await fetch(`/api${path}`, {
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const data = await res.json();
    console.log({ status: res.status });
    if (res.status > 200) {
      return { error: data };
    }
    return { data };
  } catch (e) {
    console.log(e);
    return {
      error: [
        {
          message: 'network error'
        }
      ]
    };
  }
}
