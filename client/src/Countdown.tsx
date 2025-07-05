import { gql, useSubscription } from "@apollo/client";

export default function Countdown() {
  const { data } = useSubscription(
    gql`
      subscription Countdown($from: Int!) {
        countdown(from: $from)
      }
    `,
    {
      variables: { from: 10000 },
    }
  );

  return (
    <div>
      <h1>Countdown: {data?.countdown ?? -1}</h1>
    </div>
  );
}
