// src/app/page.tsx
import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";


import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { PostCard } from "@/components/PostCard";
import { Navigation } from "@/components/Navigation";


/**
 * This component renders your homepage.
 *
 * Use Next's generateMetadata function to render page metadata.
 *
 * Use the SliceZone to render the content of the page.
 */

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  return {
    title: prismic.asText(home.data.title),
    description: home.data.meta_description,
    openGraph: {
      title: home.data.meta_title || undefined,
      images: [
        {
          url: home.data.meta_image.url || "",
        },
      ],
    },
  };
}

export default async function Index() {
  // The client queries content from the Prismic API
  const client = createClient();

  // Fetch the content of the home page from Prismic
  const home = await client.getByUID("page", "home");

  // Get all of the blog_post documents created on Prismic ordered by publication date
  const posts = await client.getAllByType("blog_post", {
    graphQuery: `
      {
        blog_post {
          title
          subtitle
          featured_image
          publication_date
          
          blog_post_author {
            ...on author {
              uid
              profile_image
              author_name
              description
              bio
            }
          }
        }
      }
    `,
    orderings: [
      { field: "my.blog_post.publication_date", direction: "desc" },
      { field: "document.first_publication_date", direction: "desc" },
    ],
  });

  return (
    <>
      
      <Navigation client={client} />
      

      <SliceZone slices={home.data.slices} components={components} />

      {/* Adjusted section to fill the page with small margins and keep asymmetric cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 py-4">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`${
              index === 0 ? 'md:col-span-2' : 'md:col-span-1'
            } animate-fadeInUp`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </section>
    </>
  );
}