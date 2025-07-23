import { cn } from '../../utils';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    image: string;
    title: string;
    description: string;
    link: string;
    button: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10', className)}>
      {items.map((item, idx) => (
        <Link
          href={item?.link}
          key={item?.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-[#CFB360] dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card image={item.image} title={item.title} description={item.description}>
            <CardButton>{item.button}</CardButton>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
  image,
  title,
  description,
}: {
  className?: string;
  children: React.ReactNode;
  image: string;
  title: string;
  description: string;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl h-[20rem] w-[20rem] p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-[#e6c562] relative z-20 ',
        className
      )}
    >
      <div className="relative z-50 h-[60%] bg-[#020614] flex items-center justify-center rounded-[10px]">
        <img src={image} alt="Project Image" className="max-w-[80%] max-h-[80%]" />
      </div>
      <div className="relative z-50">
        <div className="p-4 flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h4 className={cn('text-zinc-100 font-bold tracking-wide', className)}>{children}</h4>;
};
export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <p className={cn('text-zinc-400 tracking-wide leading-relaxed text-sm', className)}>{children}</p>;
};
export const CardButton = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div>
      <button className={cn('button', className)}>{children}</button>
    </div>
  );
};
