import { ShikiTransformer } from "shiki";

export function createLineOddTransformer(): ShikiTransformer {
  return {
    name: "line-odd-transformer",
    line(node, n) {
      const isOdd = n % 2 === 1;
      if (!isOdd) {
        return node;
      }

      return {
        ...node,
        properties: {
          ...node.properties,
          className: node.properties?.className
            ? `${node.properties.className} line-odd`
            : "line-odd",
        },
      };
    },
  };
}
