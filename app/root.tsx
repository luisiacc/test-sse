import * as React from "react";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
      <SSE />
    </html>
  );
}

function SSE() {
  let [data, setData] = React.useState(null);

  React.useEffect(() => {
    const eventSource = new EventSource("/sse/ev1");

    eventSource.onmessage = (event) => {
      setData(event.data);
      console.log(event.data); // This will log the ping message
      // You can also update your component state here to display the data
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    // Clean up the connection when the component is unmounted
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Server-Sent Events Page</h1>
      <pre>{data}</pre>
      {/* You can display the SSE data here if desired */}
    </div>
  );
}
