import { h } from "hastscript";
import { ShikiTransformer } from "shiki";

export function createLineNumbersTransformer(): ShikiTransformer {
  return {
    name: "line-numbers-transformer",
    line(node, n) {
      return h(
        "span",
        {
          ...node.properties,
        },
        h(
          "span",
          {
            className: "line-number",
          },
          h(null, n),
        ),
        h("span", node.children),
      );
    },
  };
}
