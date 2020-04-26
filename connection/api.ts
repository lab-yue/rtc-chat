import { User } from '@prisma/client';

type SuccessResponse = { status: 200 };

type APICollection = {
  '/signup': User;
};
type ErrorResponse = {
  message: string;
};

type APIResponse<T> = {
  data?: T;
  error?: ErrorResponse;
};
export async function useAPI<P extends keyof APICollection, D = object>(
  path: P,
  postData?: D
): Promise<APIResponse<APICollection[P]>> {
  console.log(`request to "/api${path}", ${JSON.stringify(postData)}`);
  try {
    if (postData === undefined) {
      const res = await fetch(`/api${path}`);
      const data: APICollection[P] = await res.json();
      return { data };
    }
    const res = await fetch(`/api${path}`, {
      body: JSON.stringify(postData),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data: APICollection[P] = await res.json();
    return { data };
  } catch (e) {
    console.log(e);
    return {
      error: {
        message: e?.response?.data?.message ?? 'network error'
      }
    };
  }
}
