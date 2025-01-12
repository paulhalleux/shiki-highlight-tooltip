import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useAsync } from "react-use";
import { ExtraProps, toJsxRuntime } from "hast-util-to-jsx-runtime";
import { codeToHast } from "shiki";

import { createLineNumbersTransformer } from "../core/line-numbers-transformer.ts";
import { createLineOddTransformer } from "../core/line-odd-transformer.ts";
import {
  createTooltipTransformer,
  isTooltipTrigger,
  TooltipConfig,
} from "../core/tooltip-transformer.ts";

import { Tooltip } from "./Tooltip.tsx";

type CodeWithTooltipsProps = {
  code: string;
  highlight?: TooltipConfig[];
};

export function CodeWithTooltips({ code, highlight }: CodeWithTooltipsProps) {
  const { value } = useAsync(async () => {
    return await codeToHast(code.trim(), {
      lang: "tsx",
      theme: "vitesse-dark",
      transformers: [
        createTooltipTransformer(highlight || []),
        createLineNumbersTransformer(),
        createLineOddTransformer(),
      ],
    });
  }, [highlight]);

  if (!value) {
    return null;
  }

  return toJsxRuntime(value, {
    Fragment,
    jsx,
    jsxs,
    components: {
      span: NodeWithTooltip,
    },
    passNode: true,
  });
}

function NodeWithTooltip({
  children,
  node,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> &
  ExtraProps) {
  if (!node) {
    return <span {...props}>{children}</span>;
  }

  if (isTooltipTrigger(node)) {
    return (
      <Tooltip title={node.data.title} content={node.data.content}>
        <span {...props}>{children}</span>
      </Tooltip>
    );
  }

  return <span {...props}>{children}</span>;
}
