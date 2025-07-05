import { gql, useQuery } from "@apollo/client";
import { Link } from "wouter";

export default function Home() {
  const { data } = useQuery(
    gql`
      query hello {
        hello
      }
    `
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        flexDirection: "column",
      }}
    >
      <h1>{data?.hello}</h1>
      <Link href="/countdown" style={{ fontSize: "24px" }}>
        Go to Countdown page
      </Link>
    </div>
  );
}
