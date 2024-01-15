import * as React from "react";
import Image from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";

import { cn } from "@/lib/utils";
import { Callout } from "@/components/callout";
import { MdxCard } from "@/components/mdx-card";

const components = {
  // @ts-expect-error classname
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  // @ts-expect-error classname
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  // @ts-expect-error classname
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  // @ts-expect-error classname
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  // @ts-expect-error classname
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  // @ts-expect-error classname
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  // @ts-expect-error classname
  a: ({ className, ...props }) => (
    <a
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  // @ts-expect-error classname
  p: ({ className, ...props }) => (
    <p
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  // @ts-expect-error classname
  ul: ({ className, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  // @ts-expect-error classname
  ol: ({ className, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  // @ts-expect-error classname
  li: ({ className, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    <li className={cn("mt-2", className)} {...props} />
  ),
  // @ts-expect-error classname
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md border", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  // @ts-expect-error classname
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  // @ts-expect-error classname
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  // @ts-expect-error classname
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  // @ts-expect-error classname
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        className,
      )}
      {...props}
    />
  ),
  Image,
  Callout,
  Card: MdxCard,
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <div className="mdx">
      {/* @ts-expect-error components type */}
      <Component components={components} />
    </div>
  );
}
