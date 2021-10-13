import type { TagElement, TextElement } from "./package.ts";

type ReturnSanitize = (
  | Omit<TagElement, "parent" | "prev" | "next" | "children">
  | TextElement
) & {
  children: ReturnSanitize[];
};

export function sanitizer(element: TagElement): ReturnSanitize {
  const { parent, prev, next, ...rest } = element;

  return {
    ...rest,
    children: rest.children?.map((elt) => {
      const mem = elt as TagElement;
      return sanitizer(mem);
    }),
  };
}
