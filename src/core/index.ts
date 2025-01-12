import { fromHtml } from "hast-util-from-html";
import { h } from "hastscript";
import { marked } from "marked";
import { outdent } from "outdent";
import { ShikiTransformer } from "shiki";

interface TooltipConfig {
  regex: RegExp;
  title: string;
  content: string;
}

export function createTooltipTransformer(
  configs: TooltipConfig[],
): ShikiTransformer {
  return {
    name: "tooltip-transformer",
    span(node): void {
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

            // Create the tooltip node for the matched text
            const tooltipNode = createTooltipNode(matchedText, title, content);

            // Replace the original text node with the new structure
            node.children = [
              h("span", beforeMatch),
              tooltipNode,
              h("span", afterMatch),
            ];
          }
          break;
        }
      }
    },
  };
}

function createTooltipNode(
  originalText: string,
  title: string,
  content: string,
): any {
  return h("span.tooltip-wrapper", [
    h("span.base-text", originalText),
    h("div.tooltip-container", [
      h("div.tooltip-title", title),
      h(
        "div.tooltip-content",
        h(
          "div.markdown",
          fromHtml(marked(outdent.string(content), { async: false })),
        ),
      ),
    ]),
  ]);
}
