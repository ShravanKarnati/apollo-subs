import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split,
  ApolloLink,
  type FetchResult,
  Observable,
  type Operation,
  HttpLink,
} from "@apollo/client";
import { print, Kind, OperationTypeNode } from "graphql";

import { getMainDefinition } from "@apollo/client/utilities";

import { createClient, type ClientOptions, type Client } from "graphql-sse";

const host = "localhost";

const GRAPHQL_API_URL = `http://${host}:4001/graphql`;

class SSELink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        } as never
      );
    });
  }
}

const streamLink = new SSELink({ url: GRAPHQL_API_URL });
const httpLink = new HttpLink({ uri: GRAPHQL_API_URL });

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === Kind.OPERATION_DEFINITION &&
      definition.operation === OperationTypeNode.SUBSCRIPTION
    );
  },
  streamLink,
  httpLink
);

const client = new ApolloClient({
  uri: GRAPHQL_API_URL,
  cache: new InMemoryCache(),
  link: splitLink,
});

export const ApolloClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
