// ./src/slices/Hero/index.tsx

import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicText } from "@prismicio/react";
import { RichText } from "@/components/RichText";
import { PrismicNextImage } from "@prismicio/next";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  return (
    <section
      className="grid gap-4 px-2 py-4"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Header Section */}
      <div className="py-2 text-xs">
        <div className="flex justify-between items-center py-2">
          <p className="font-mono">#001</p>
          <p className="uppercase">blog</p>
          <p>
            {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <hr className="border-neutral-900 dark:border-neutral-100" />
      </div>

      {/* Title Section */}
      <div className="text-center">
        <h1 className='text-2xl md:text-5xl font-["Helvetica"] font-bold'>
          <PrismicText field={slice.primary.title} />
        </h1>
      </div>
      <div className="text-center">
        <div className="text-sm md:text-base text-neutral-700 dark:text-neutral-300">
          <RichText field={slice.primary.description} />
        </div>
      </div>

      {/* Image Section */}
      <PrismicNextImage
        field={slice.primary.image}
        sizes="100vw"
        className="object-cover w-full h-[80vw] md:h-[50vh]"
      />
    </section>
  );
};

export default Hero;