import {
  AuthenticationError,
  NotAllowedError,
  NotFoundError,
} from '@backstage/errors';
import { RootLoggerService } from "@backstage/backend-plugin-api";

export async function parseErrorResponse(logger: RootLoggerService, response: Response) {
  logger?.error(
    `Error occurred while accessing deploy: status: ${response.status}, statusText: ${response.statusText} `,
  );
  const responseText = await response.text();
  if (responseText) {
    logger?.error(`Response Error - ${responseText}`);
  }
  if (response.status === 401) {
    logger?.error(`Inside 401`);
    throw new AuthenticationError(
      `Access Denied: Missing or invalid deploy Token. Unauthorized to Use Digital.ai Deploy`,
    );
  } else if (response.status === 403) {
    throw new NotAllowedError(
      `Permission Denied: The configured Deploy User lacks necessary permission in Digital.ai Deploy`,
    );
  } else if (response.status === 404) {
    throw new NotFoundError(`Deploy service request not found`);
  }
  throw new Error(
    `failed to fetch data, status ${response.status} ${response.statusText}`,
  );
}
