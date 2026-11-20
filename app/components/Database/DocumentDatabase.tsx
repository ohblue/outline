import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { TeamPreference } from "@shared/types";
import type Database from "~/models/Database";
import type Document from "~/models/Document";
import DatabaseView from "~/scenes/Database/components/DatabaseView";
import { useSavedViewSource } from "~/scenes/Database/hooks/useDatabaseViewSource";
import useStores from "~/hooks/useStores";

type Props = {
  /** The document whose anchored database to render, if it has one. */
  document: Document;
  /**
   * The public share the document is being read through. The database is then
   * rendered read-only from what the share exposes, with no sign-in needed.
   */
  shareId?: string;
};

/**
 * Renders the database anchored to a document underneath its body: the
 * saved-view tabs, the toolbar and the rows. A document is a database when a
 * database facet shares its id; for ordinary documents nothing is rendered.
 */
function DocumentDatabase({ document, shareId }: Props) {
  const { auth, databases } = useStores();
  const enabled =
    !shareId && !!auth.team?.getPreference(TeamPreference.DocumentDatabases);

  // the sidebar usually loads all databases already; this covers direct
  // navigation paths where it has not run yet
  React.useEffect(() => {
    if (enabled && !databases.isLoaded && !databases.isFetching) {
      void databases.loadAll();
    }
  }, [enabled, databases]);

  // a share is answered by the server, which only returns the database when
  // the team has the feature on
  const database = enabled || shareId ? databases.get(document.id) : undefined;
  if (!database) {
    return null;
  }

  return (
    <Section>
      <SavedViews database={database} shareId={shareId} />
    </Section>
  );
}

/**
 * Renders a database through its own saved views, where a change to a view is
 * saved on the database.
 */
const SavedViews = observer(function SavedViews_({
  database,
  shareId,
}: {
  database: Database;
  shareId?: string;
}) {
  const readOnly = !!shareId;
  const source = useSavedViewSource(database, { readOnly });
  return (
    <DatabaseView
      database={database}
      source={source}
      shareId={shareId}
      readOnly={readOnly}
    />
  );
});

const Section = styled.div`
  margin: 12px 0;

  @media print {
    break-inside: avoid;
  }
`;

export default observer(DocumentDatabase);
