
import { Client, Content, isFilled } from "@prismicio/client";
import { PrismicLink } from "@prismicio/react";
import Link from "next/link";

export const Navigation = async ({
  client,
}: {
  client: Client<Content.AllDocumentTypes>;
}): Promise<JSX.Element> => {
  const navigation = await client.getSingle("navigation");

  return (
    <nav className="w-full py-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <div className="flex justify-between items-center px-2">
        <Link href="/" className="text-xl font-bold">
          O espaço entre lá e cá
        </Link>
        <ul className="flex space-x-4">
          {isFilled.group(navigation.data.menu_items) &&
            navigation.data.menu_items.map((item) => {
              return (
                <li key={item.label}>
                  <PrismicLink field={item.link} className="hover:underline">
                    {item.label}
                  </PrismicLink>
                </li>
              );
            })}
        </ul>
      </div>
    </nav>
  );
};