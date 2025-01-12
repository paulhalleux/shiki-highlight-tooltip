import { PropsWithChildren, useRef, useState } from "react";
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { marked } from "marked";
import { AnimatePresence, motion } from "motion/react";
import { outdent } from "outdent";

type TooltipProps = PropsWithChildren<{
  title: string;
  content: string;
}>;

export function Tooltip({ children, title, content }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [
      offset({
        mainAxis: 10,
        crossAxis: -10,
      }),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, {
    role: "tooltip",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <span ref={refs.setReference} {...getReferenceProps()}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={refs.setFloating}
            style={floatingStyles}
            className="tooltip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...getFloatingProps()}
          >
            <div className="tooltip-title">{title}</div>
            <div className="tooltip-content">
              <div
                className="markdown"
                dangerouslySetInnerHTML={{
                  __html: marked(outdent.string(content), {
                    async: false,
                  }),
                }}
              />
            </div>
            <div
              ref={arrowRef}
              className="tooltip-arrow"
              style={{
                position: "absolute",
                left: middlewareData.arrow?.x,
                top: middlewareData.arrow?.y,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
