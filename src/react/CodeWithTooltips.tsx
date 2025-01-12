import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useAsync } from "react-use";
import { ExtraProps, toJsxRuntime } from "hast-util-to-jsx-runtime";
import { codeToHast } from "shiki";

import {
  createTooltipTransformer,
  isTooltipTrigger,
  TooltipConfig,
} from "../core";

import { Tooltip } from "./Tooltip.tsx";

type CodeWithTooltipsProps = {
  code: string;
  highlight?: TooltipConfig[];
};

export function CodeWithTooltips({ code, highlight }: CodeWithTooltipsProps) {
  const { value } = useAsync(async () => {
    const transformer = createTooltipTransformer(highlight || []);
    return await codeToHast(code.trim(), {
      lang: "tsx",
      theme: "vesper",
      transformers: [transformer],
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
