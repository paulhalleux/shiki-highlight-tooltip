import { CodeWithTooltips } from "./react/CodeWithTooltips.tsx";

import "./index.css";

const CODE = `
import React from 'react';

function App() {
  return <div></div>;
}

export default App;
`;

function App() {
  return (
    <div className="app">
      <div className="container">
        <CodeWithTooltips
          code={CODE}
          highlight={[
            {
              regex: /App/g,
              title: "App",
              content: "The main component of the application.",
            },
            {
              regex: /return/g,
              title: "return",
              content: "The JSX that will be rendered.",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default App;
