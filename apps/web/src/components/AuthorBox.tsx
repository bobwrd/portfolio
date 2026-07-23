import { Link } from "react-router-dom";
import { siteConfig } from "@/config/site";

export default function AuthorBox() {
  return (
    <div className="mt-10 pt-8 border-t border-border">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-sm font-semibold text-muted-foreground">
          AJ
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{siteConfig.author}</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Writing on economics, law, and policy from Singapore.{" "}
            <Link to="/profile" className="underline underline-offset-2 hover:text-foreground transition-colors">
              More about me →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
