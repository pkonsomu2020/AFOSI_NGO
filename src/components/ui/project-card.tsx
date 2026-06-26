import * as React from "react";
import { ArrowRight, ExternalLink, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectStat {
  val: string;
  lbl: string;
}

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  category: string;
  title: string;
  description: string;
  stats?: ProjectStat[];
  tags?: string[];
  link: string;
  linkText?: string;
  external?: boolean;
  disabled?: boolean;
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  (
    {
      className,
      imgSrc,
      category,
      title,
      description,
      stats = [],
      tags = [],
      link,
      linkText = "Explore Project",
      external = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-xl",
          className
        )}
        {...props}
      >
        {/* Image */}
        <div className="overflow-hidden aspect-video">
          <img
            src={imgSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            loading="lazy"
          />
          {/* Category badge over image */}
          <div className="absolute left-4 top-4 z-10">
            <span className="rounded-full bg-[var(--or)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6 gap-3">
          <h3 className="text-xl font-semibold leading-tight transition-colors duration-300 group-hover:text-[var(--or)]">
            {title}
          </h3>

          <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {description}
          </p>

          {/* Stats row */}
          {stats.length > 0 && (
            <div className="flex gap-4 border-t border-border pt-3">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-base font-bold text-[var(--or)]">{s.val}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">{s.lbl}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <a
            href={disabled ? undefined : link}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (disabled) e.preventDefault();
            }}
            className={cn(
              "group/btn mt-2 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300",
              disabled
                ? "cursor-not-allowed text-muted-foreground"
                : "text-[var(--or)] hover:underline"
            )}
          >
            {disabled ? "Coming Soon" : linkText}
            {!disabled && external ? (
              <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            ) : !disabled ? (
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            ) : null}
          </a>
        </div>
      </div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";
export { ProjectCard };
