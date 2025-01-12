import { Element } from "hast";
import { h } from "hastscript";
import { ShikiTransformer } from "shiki";

export interface TooltipConfig {
  regex: RegExp;
  title: string;
  content: string;
}

export interface TooltipTriggerNode extends Element {
  data: {
    _type: "tooltip-trigger";
    title: string;
    content: string;
  };
}

export function isTooltipTrigger(node: Element): node is TooltipTriggerNode {
  return (
    "data" in node &&
    typeof node.data === "object" &&
    "_type" in node.data &&
    node.data._type === "tooltip-trigger"
  );
}

export function createTooltipTransformer(
  configs: TooltipConfig[],
): ShikiTransformer {
  return {
    name: "tooltip-transformer",
    span(node) {
      for (const { regex, title, content } of configs) {
        const firstChild = node.children && node.children[0];
        if (firstChild && firstChild.type === "text") {
          const match = regex.exec(firstChild.value);
          if (match) {
            const matchIndex = match.index;
            const matchLength = match[0].length;

            // Split the original text into parts
            const beforeMatch = firstChild.value.slice(0, matchIndex);
            const matchedText = firstChild.value.slice(
              matchIndex,
              matchIndex + matchLength,
            );
            const afterMatch = firstChild.value.slice(matchIndex + matchLength);

            return {
              ...node,
              children: [
                h("span", beforeMatch),
                {
                  type: "element",
                  tagName: "span",
                  properties: {
                    className: "tooltip-trigger",
                  },
                  children: [{ type: "text", value: matchedText }],
                  data: {
                    _type: "tooltip-trigger",
                    title,
                    content,
                  },
                },
                h("span", afterMatch),
              ],
            };
          }
        }
      }
    },
  };
}
