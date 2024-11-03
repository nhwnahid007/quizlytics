import { cn } from "@/lib/utils";

const Spinner = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900",
        className
      )}
      {...props}
    />
  );
};

export default Spinner;
