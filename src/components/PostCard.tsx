import { PrismicNextImage } from "@prismicio/next";
import { PrismicLink, PrismicText } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { RichText } from "./RichText";

type AuthorDocumentData = {
  profile_image?: prismic.ImageField;
  author_name?: prismic.RichTextField;
  description?: prismic.RichTextField;
  bio?: prismic.RichTextField;
};

type AuthorField = prismic.FilledContentRelationshipField<"author", string> & {
  data: AuthorDocumentData;
};

export const PostCard = ({
  post,
}: {
  post: prismic.Content.BlogPostDocument;
}): JSX.Element => {
  const { data } = post;
  const author = data.blog_post_author as AuthorField | null;

  return (
    <PrismicLink 
      document={post} 
      className="block group"
    >
      <div className="grid gap-2 bg-white dark:bg-neutral-800  overflow-hidden
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <PrismicNextImage
            field={data.featured_image}
            sizes="100vw"
            className="object-cover w-full h-48 md:h-60 
              transform transition-transform duration-500 
              group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-300"/>
        </div>
        
        <div className="px-4 pb-4 relative">
          
          
          {/* Title */}
          <h2 className="text-lg md:text-xl font-bold mt-2 text-black dark:text-white transition-colors duration-300
            ">
            <PrismicText field={data.title} />
          </h2>
          
          {/* Subtitle */}
          <div className="text-sm text-neutral-700 dark:text-neutral-300 mt-2
            line-clamp-2
            transition-colors duration-300
            group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
            <RichText field={data.subtitle} />
          </div>
          
          {/* Author Section with Separator */}
          {author && author.data && (
            <>
              <div className="h-px w-full bg-neutral-200 dark:bg-neutral-700 my-3
                transition-all duration-300
                "/>
                
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                {author.data.profile_image && (
                  <div className="relative">
                    <PrismicNextImage
                      field={author.data.profile_image}
                      className="w-8 h-8 rounded-full
                        transition-transform duration-300
                        group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full
                      ring-2 ring-transparent
                      group-hover:ring-black dark:group-hover:ring-white
                      transition-all duration-300"/>
                  </div>
                )}
                
                {author.data.author_name && (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400
                    transition-all duration-300
                    group-hover:text-neutral-900 dark:group-hover:text-neutral-100
                    group-hover:translate-x-1">
                    <PrismicText field={author.data.author_name} />
                  </div>
                )}
                </div>
                {/* Category/Date Tag */}
          <div className="items-center">
            <p className="text-xs text-neutral-600 dark:text-neutral-400
              transition-all duration-300
             ">
              {new Date(data.publication_date || "").toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
              </div>
              
            </>
          )}
          
          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 
            bg-neutral-900 dark:bg-neutral-100 
            scale-x-0 group-hover:scale-x-100
            transition-transform duration-500"/>
        </div>
      </div>
    </PrismicLink>
  );
};

export default PostCard;