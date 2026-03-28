"use client";

type CodeEditorProps = {
  codeValue: string;
  languageKey: string;
  onCodeChange: (nextCode: string) => void;
};

export function CodeEditor({ codeValue, languageKey, onCodeChange }: CodeEditorProps) {
  const lineCount = codeValue.split("\n").length;

  return (
    <section className="flex h-full flex-col bg-[#0d0d0d]">
      <div className="flex items-center justify-between border-b border-border bg-card px-3 py-2">
        <span className="font-mono text-xs text-muted-foreground">solution.{languageKey === "javascript" ? "js" : languageKey}</span>
      </div>
      <div className="relative flex-1 overflow-auto">
        <div className="pointer-events-none absolute left-0 top-0 z-10 flex min-h-full w-12 select-none flex-col border-r border-border bg-muted/20 py-4 text-right font-mono text-xs text-muted-foreground/60">
          {Array.from({ length: Math.max(lineCount, 1) }).map((_, index) => (
            <div key={index} className="h-6 px-3 leading-6">
              {index + 1}
            </div>
          ))}
        </div>
        <textarea
          spellCheck={false}
          value={codeValue}
          onChange={(event) => onCodeChange(event.target.value)}
          className="min-h-full w-full resize-none bg-transparent p-4 pl-16 font-mono text-sm leading-6 text-foreground outline-none"
        />
      </div>
    </section>
  );
}
