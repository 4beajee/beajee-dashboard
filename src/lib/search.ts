export type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function readSearchParams(
  searchParams?: PageSearchParams,
): Promise<Record<string, string | string[] | undefined>> {
  return searchParams ? searchParams : {};
}
