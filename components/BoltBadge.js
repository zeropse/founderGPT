import { Zap } from "lucide-react";

export default function BoltBadge() {
  return (
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <span>Built with</span>
      <div className="flex items-center gap-1 bg-primary/5 text-primary rounded-full px-2 py-0.5 transition-colors group-hover:bg-primary/10">
        <Zap className="h-3.5 w-3.5" />
        <span className="font-medium">Bolt.new</span>
      </div>
    </a>
  );
}