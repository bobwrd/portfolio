import { Link } from "react-router-dom";
import { siteConfig } from "@/config/site";

export default function AuthorBox() {
  return (
    <div className="mt-10 pt-8 border-t border-border">
      <div className="flex items-start gap-4">
        <div>
          <p className="font-serif text-lg text-foreground">{siteConfig.author}</p>
          <p className="mt-1 font-sans text-[0.9375rem] text-muted-foreground">
            Writing on economics, law and policy from Singapore.{" "}
            <Link to="/" className="text-link underline">
              More about me
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
