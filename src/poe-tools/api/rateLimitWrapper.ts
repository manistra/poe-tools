export const rateLimitWrapper = async (
  fetch: () => Promise<any>
): Promise<any> => {
  try {
    const response = await fetch();

    console.log(response);

    if (response.error) {
      // Check if the error message indicates a rate limit
      if (response.message) {
        const waitTimeMatch = response.message.match(
          /Please wait (\d+) seconds/
        );
        const waitTime = waitTimeMatch ? parseInt(waitTimeMatch[1], 10) : 0;
        if (Number(waitTime) > 1)
          throw new Error(`RATE_LIMIT_EXCEEDED:${waitTime}`);
      }
      throw new Error(`Failed to fetch item details: ${response.message}`);
    }

    return response || [];
  } catch (error) {
    // Rethrow rate limit errors to be handled by the caller
    if (
      error instanceof Error &&
      error.message.startsWith("RATE_LIMIT_EXCEEDED")
    ) {
      throw error;
    }
    console.error("Error fetching item details:", error);
    throw error;
  }
};
