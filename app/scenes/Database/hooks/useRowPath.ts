import useShare from "@shared/hooks/useShare";
import type Document from "~/models/Document";
import { sharedModelPath } from "~/utils/routeHelpers";

/**
 * The path that opens a database row, which on a public share has to stay
 * inside the share.
 *
 * @param document the row.
 * @returns the path to the row's page.
 */
export default function useRowPath(document: Document): string {
  const { shareId } = useShare();
  return shareId ? sharedModelPath(shareId, document.path) : document.path;
}
