import type { Database, Document } from "@server/models";

export default function presentDatabase(database: Database) {
  return {
    id: database.id,
    titleName: database.titleName,
    dataSchema: database.dataSchema,
    views: database.views,
    createdAt: database.createdAt,
    updatedAt: database.updatedAt,
    // identity lives on the anchor document; these fields are presented from
    // it so pickers and the sidebar can label a database without a second
    // request for the document
    name: database.document?.title ?? "",
    icon: database.document?.icon ?? null,
    color: database.document?.color ?? null,
    collectionId: database.document?.collectionId ?? null,
    archivedAt: database.document?.archivedAt ?? null,
  };
}

/**
 * Presents a database row for readers of a public share. Deliberately carries
 * no content or user fields: a share exposes the table, not the rows'
 * bodies or who edited them.
 */
export function presentSharedDatabaseRow(row: Document) {
  return {
    id: row.id,
    urlId: row.urlId,
    url: row.path,
    title: row.title,
    icon: row.icon,
    color: row.color,
    collectionId: row.collectionId,
    parentDocumentId: row.parentDocumentId,
    databaseId: row.databaseId,
    databaseIndex: row.databaseIndex,
    properties: row.properties ?? {},
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publishedAt: row.publishedAt,
  };
}
