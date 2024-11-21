import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SliceZone } from '@prismicio/react';
import * as prismic from '@prismicio/client';

import { createClient } from '@/prismicio';
import { components } from '@/slices';
import { PrismicNextImage } from '@prismicio/next';
import { PostCard } from '@/components/PostCard';
import { RichText } from '@/components/RichText';
import { Navigation } from '@/components/Navigation';

// Define the structure of the author's data
type AuthorDocumentData = {
  profile_image?: prismic.ImageField;
  author_name?: prismic.RichTextField;
  description?: prismic.RichTextField;
  bio?: prismic.RichTextField;
};

// Define the type for the author field in the blog post
type AuthorField = prismic.FilledContentRelationshipField<'author', string> & {
  data: AuthorDocumentData;
};

/**
 * This page renders a Prismic Document dynamically based on the URL.
 */

export async function generateMetadata(
  params: { params: Promise<{ uid: string }> },
): Promise<Metadata> {
  const { uid } = await params.params;

  const client = createClient();
  const page = await client
    .getByUID('blog_post', uid)
    .catch(() => notFound());

  return {
    title: prismic.asText(page.data.title),
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title || undefined,
      images: [
        {
          url: page.data.meta_image.url || '',
        },
      ],
    },
  };
}

export default async function Page(
  params: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params.params;

  const client = createClient();

  // Fetch the current blog post page using the UID from params
  const page = await client
    .getByUID('blog_post', uid, {
      graphQuery: `
        {
          blog_post {
            title
            subtitle
            featured_image
            publication_date
            slices
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
    })
    .catch(() => notFound());

  // Fetch other posts for the "Recommended Posts" section
  const posts = await client.getAllByType('blog_post', {
    predicates: [prismic.filter.not('my.blog_post.uid', uid)],
    orderings: [
      { field: 'my.blog_post.publication_date', direction: 'desc' },
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
    limit: 2,
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
            }
          }
        }
      }
    `,
  });

  // Destructure the content of the current page
  const {
    slices,
    title,
    publication_date,
    subtitle,
    featured_image,
    blog_post_author,
  } = page.data;

  // Type assertion for blog_post_author
  const author = blog_post_author as AuthorField;

  return (
    <>
      {/* Navigation */}
      <Navigation client={client} />

      {/* Main Content */}
      <article className="px-2 py-4">
        {/* Header Section */}
        <header className="grid gap-4">
          {/* Title */}
          <h1 className="text-2xl md:text-5xl font-bold text-center">
            <RichText field={title} />
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <div className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 text-center">
              <RichText field={subtitle} />
            </div>
          )}

          {/* Publication Date */}
          <p className="text-xs text-neutral-500 text-center">
            {new Date(publication_date || '').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>

          {/* Featured Image */}
          {featured_image && (
            <div className="my-4">
              <PrismicNextImage
                field={featured_image}
                sizes="100vw"
                className="object-cover w-full h-[80vw] md:h-[50vh]"
              />
            </div>
          )}

          {/* Author Information */}
          {author && author.data && (
            <div className="flex flex-col items-start m-2">
              {/* Profile and Name Container */}
              <div className="flex flex-col items-start">
                {/* Separator Line */}
                <hr className="w-full border-t border-neutral-300 dark:border-neutral-700 mb-4" />

                <div className="flex items-center">
                  {author.data.profile_image && (
                    <PrismicNextImage
                      field={author.data.profile_image}
                      className="w-10 h-10 rounded-full"
                    />
                  )}

                  <div className="ml-2 text-sm text-neutral-600 dark:text-neutral-400 text-start">
                    <RichText field={author.data.author_name} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Post Content */}
        <section className="prose dark:prose-invert max-w-none mt-8">
          <SliceZone slices={slices} components={components} />
        </section>
      </article>

      {/* Recommended Posts Section */}
      <section className="px-2 py-4">
        <h2 className="font-bold text-2xl mb-4">Recommended Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}

// Exported at the module level for Next.js to use
export async function generateStaticParams(): Promise<{ uid: string }[]> {
  const client = createClient();

  // Query all Documents from the API
  const pages = await client.getAllByType('blog_post');

  // Return the params for dynamic routes
  return pages.map((page) => ({ uid: page.uid }));
}