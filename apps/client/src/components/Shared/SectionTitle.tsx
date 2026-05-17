interface SectionTitleProps {
  heading: string;
  subHeading?: string;
  subheading?: string;
}

const getSubHeading = ({ subHeading, subheading }: SectionTitleProps) =>
  subHeading ?? subheading ?? "";

const SectionTitle = (props: SectionTitleProps) => {
  const { heading } = props;
  const subHeading = getSubHeading(props);
  return (
    <div className="relative mx-auto max-w-2xl py-12 text-center">
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="relative">
        <div className="inline-block">
          <span className="rounded-full bg-primary-color/10 px-4 py-1 text-sm font-medium text-primary-color md:text-base">
            {subHeading}
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-foreground md:text-4xl">
          {heading}
        </h2>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="h-1 w-8 rounded-full bg-primary-color" />
          <span className="h-1 w-3 rounded-full bg-accent" />
          <span className="h-1 w-2 rounded-full bg-border" />
        </div>
      </div>
    </div>
  );
};

const SectionTitleAlt = (props: SectionTitleProps) => {
  const { heading } = props;
  const subHeading = getSubHeading(props);
  return (
    <div className="relative mx-auto max-w-2xl py-12 text-center">
      <div className="relative rounded-lg border border-border bg-card px-6 py-8 shadow-sm">
        <p className="mb-3 flex items-center justify-center gap-2 font-medium text-primary-color">
          <span className="h-px w-6 bg-border" />
          {subHeading}
          <span className="h-px w-6 bg-border" />
        </p>

        <h2 className="text-2xl font-bold text-foreground md:text-4xl">
          {heading}
        </h2>
      </div>
    </div>
  );
};

const SectionTitleMinimal = (props: SectionTitleProps) => {
  const { heading } = props;
  const subHeading = getSubHeading(props);
  return (
    <div className="mx-auto max-w-2xl px-4 py-4 text-center sm:px-6 2xl:py-10">
      <div className="space-y-2 sm:space-y-4">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          {heading}
        </h2>

        {subHeading ? (
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-1 w-1 rounded-full bg-primary-color sm:h-1.5 sm:w-1.5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-color sm:text-sm">
              {subHeading}
            </span>
            <span className="h-1 w-1 rounded-full bg-primary-color sm:h-1.5 sm:w-1.5" />
          </div>
        ) : null}

        <div className="mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-primary-color to-accent sm:h-1 sm:w-20" />
      </div>
    </div>
  );
};

export { SectionTitle as default, SectionTitleAlt, SectionTitleMinimal };
