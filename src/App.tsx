import { useCallback } from "react";
import { codeToHtml } from "shiki";

import { createTooltipTransformer } from "./core";
import { useAsync } from "./useAsync.ts";

import "./index.css";

const CODE = `
import React from 'react';

function App() {
  return <div></div>;
}

export default App;
`;

function App() {
  const { value } = useAsync(
    useCallback(() => {
      return codeToHtml(CODE.trim(), {
        lang: "tsx",
        theme: "vesper",
        transformers: [
          createTooltipTransformer([
            {
              regex: /App/g,
              title: "App",
              content: `
                # This is the App component
                
                The App component is the main component of the application.
                
                ## Props
                
                - None
              `,
            },
          ]),
        ],
      });
    }, []),
  );

  return (
    <div className="app">
      <div
        className="container"
        dangerouslySetInnerHTML={{ __html: value ?? "" }}
      />
    </div>
  );
}

export default App;
