// TODO: Fix this when we turn strict mode on.

import { toc } from "mdast-util-toc";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import { type ListItem, type List, type Node } from "mdast";

const textTypes = ["text", "emphasis", "strong", "inlineCode"];

function flattenNode(node: Node) {
  const p: string[] = [];
  visit(node, (node: Node) => {
    if (!textTypes.includes(node.type)) return;
    // @ts-expect-error value is part of these text nodes
    p.push(node.value as string);
  });
  return p.join(``);
}

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

interface Items {
  items?: Item[];
}

function getItems(node: Node, current: Item): Items {
  if (!node) {
    return {};
  }

  if (node.type === "paragraph") {
    visit(node, (item) => {
      if (item.type === "link") {
        // @ts-expect-error url exist in link
        current.url = item.url as string;
        current.title = flattenNode(node);
      }

      if (item.type === "text") {
        current.title = flattenNode(node);
      }
    });

    return current;
  }

  if (node.type === "list") {
    // @ts-expect-error safe assignments
    current.items = (node as List).children.map((i) => getItems(i, {}));

    return current;
  } else if (node.type === "listItem") {
    // @ts-expect-error safe assignments
    const heading = getItems((node as ListItem).children[0], {});

    if ((node as ListItem).children.length > 1) {
      // @ts-expect-error safe assignment
      getItems((node as ListItem).children[1], heading);
    }

    return heading;
  }

  return {};
}

const getToc = () => (node: Node, file: { data: Items }) => {
  // @ts-expect-error Node incompatibility
  const table = toc(node);
  // @ts-expect-error table map not in type
  file.data = getItems(table.map, {});
};

export type TableOfContents = Items;

export async function getTableOfContents(
  content: string,
): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content);

  return result.data;
}
