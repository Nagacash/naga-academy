"use client";

import {
  useDecoratorButton,
  useStyleSelector,
  useListButton,
  useAnnotationButton,
  useToolbarSchema,
  type ToolbarDecoratorSchemaType,
  type ToolbarStyleSchemaType,
  type ToolbarListSchemaType,
  type ToolbarAnnotationSchemaType,
  type ExtendDecoratorSchemaType,
  type ExtendStyleSchemaType,
  type ExtendListSchemaType,
  type ExtendAnnotationSchemaType,
} from "@portabletext/toolbar";
import { useEditor } from "@portabletext/editor";
import type { PortableTextBlock } from "@portabletext/editor";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Type,
  ImagePlus,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ToolbarProps {
  onInsertImage: (insertIndex: number) => void;
}

// Extend style schema with icons
const extendStyle: ExtendStyleSchemaType = (style) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    normal: Type,
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    h4: Heading4,
    blockquote: Quote,
  };

  return {
    ...style,
    icon: icons[style.name] || Type,
  };
};

// Extend decorator schema with icons
const extendDecorator: ExtendDecoratorSchemaType = (decorator) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    strong: Bold,
    em: Italic,
    underline: Underline,
    "strike-through": Strikethrough,
    code: Code,
  };

  const icon = icons[decorator.name];
  if (icon) {
    return {
      ...decorator,
      icon,
      title: "", // Hide title since we show icon
    };
  }

  return decorator;
};

// Extend list schema with icons
const extendList: ExtendListSchemaType = (list) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    bullet: List,
    number: ListOrdered,
  };

  return {
    ...list,
    icon: icons[list.name] || List,
    title: "",
  };
};

// Extend annotation schema with icons
const extendAnnotation: ExtendAnnotationSchemaType = (annotation) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    link: Link,
  };

  const icon = icons[annotation.name];
  if (icon) {
    return {
      ...annotation,
      icon,
      title: "",
    };
  }

  return annotation;
};

// Decorator button component
function DecoratorButton({
  schemaType,
}: {
  schemaType: ToolbarDecoratorSchemaType;
}) {
  const button = useDecoratorButton({ schemaType });
  const isActive = button.snapshot.matches({ enabled: "active" });
  const Icon = schemaType.icon as React.ComponentType<{ className?: string }>;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => button.send({ type: "toggle" })}
      className={`h-8 w-8 p-0 ${
        isActive
          ? "bg-violet-600 text-white hover:bg-violet-700"
          : "text-zinc-400 hover:text-white hover:bg-zinc-700"
      }`}
      title={schemaType.name}
    >
      {Icon && <Icon className="h-4 w-4" />}
    </Button>
  );
}

// List button component
function ListButton({ schemaType }: { schemaType: ToolbarListSchemaType }) {
  const button = useListButton({ schemaType });
  const isActive = button.snapshot.matches({ enabled: "active" });
  const Icon = schemaType.icon as React.ComponentType<{ className?: string }>;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => button.send({ type: "toggle" })}
      className={`h-8 w-8 p-0 ${
        isActive
          ? "bg-violet-600 text-white hover:bg-violet-700"
          : "text-zinc-400 hover:text-white hover:bg-zinc-700"
      }`}
      title={schemaType.name}
    >
      {Icon && <Icon className="h-4 w-4" />}
    </Button>
  );
}

// Annotation button component (for links)
function AnnotationButton({
  schemaType,
}: {
  schemaType: ToolbarAnnotationSchemaType;
}) {
  const button = useAnnotationButton({ schemaType });
  const isActive = button.snapshot.matches({ enabled: "active" });
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState("");
  const Icon = schemaType.icon as React.ComponentType<{ className?: string }>;

  const handleClick = () => {
    if (isActive) {
      // If link is already active, remove it
      button.send({ type: "toggle" });
    } else {
      // Show URL input dialog
      setShowUrlInput(true);
      setUrl("");
    }
  };

  const handleSubmitUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      // Apply the link annotation with the URL
      button.send({
        type: "toggle",
        value: { href: url.trim() },
      });
      setShowUrlInput(false);
      setUrl("");
    }
  };

  const handleCancel = () => {
    setShowUrlInput(false);
    setUrl("");
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={`h-8 w-8 p-0 ${
          isActive
            ? "bg-violet-600 text-white hover:bg-violet-700"
            : "text-zinc-400 hover:text-white hover:bg-zinc-700"
        }`}
        title="Add link"
      >
        {Icon && <Icon className="h-4 w-4" />}
      </Button>

      {/* URL Input Dialog */}
      {showUrlInput && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg p-3 min-w-[300px]">
          <form onSubmit={handleSubmitUrl} className="space-y-2">
            <Input
              type="url"
              placeholder="Enter URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Add Link
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Style selector component
function StyleSelector({
  styles,
}: {
  styles: readonly ToolbarStyleSchemaType[];
}) {
  const mutableStyles = [...styles];
  const selector = useStyleSelector({ schemaTypes: mutableStyles });
  const activeStyleName = selector.snapshot.context.activeStyle;
  const activeStyle = styles.find((s) => s.name === activeStyleName);

  return (
    <Select
      value={activeStyle?.name || "normal"}
      onValueChange={(value) => {
        selector.send({ type: "toggle", style: value });
      }}
    >
      <SelectTrigger className="w-[130px] h-8 bg-zinc-800 border-zinc-700 text-zinc-300 text-sm">
        <SelectValue placeholder="Style" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-800 border-zinc-700">
        {styles.map((style) => {
          const Icon = style.icon as React.ComponentType<{
            className?: string;
          }>;
          return (
            <SelectItem
              key={style.name}
              value={style.name}
              className="text-zinc-300 hover:bg-zinc-700 focus:bg-zinc-700"
            >
              <span className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                {style.title || style.name}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

// Main toolbar component
export function Toolbar({ onInsertImage }: ToolbarProps) {
  const toolbarSchema = useToolbarSchema({
    extendStyle,
    extendDecorator,
    extendList,
    extendAnnotation,
  });

  // Get the editor to access current value and selection
  const editor = useEditor();

  const handleInsertImage = () => {
    // Get current snapshot from the editor
    const snapshot = editor.getSnapshot();
    const value = snapshot.context.value as PortableTextBlock[] | undefined;
    const selection = snapshot.context.selection;

    // Find the index of the currently focused block
    let insertIndex = value?.length || 0; // Default to end

    if (selection && value) {
      // Get the focus path - first element is the block key
      const focusPath = selection.focus.path;
      const firstSegment = focusPath[0];
      // Path segment can be string or object with _key
      const focusBlockKey =
        typeof firstSegment === "object" &&
        firstSegment !== null &&
        "_key" in firstSegment
          ? (firstSegment._key as string)
          : undefined;
      if (focusBlockKey) {
        const currentIndex = value.findIndex(
          (block) => block._key === focusBlockKey,
        );
        if (currentIndex !== -1) {
          // Insert after the current block
          insertIndex = currentIndex + 1;
        }
      }
    }

    onInsertImage(insertIndex);
  };

  return (
    <div className="flex items-center gap-1 p-2 bg-zinc-900 border-b border-zinc-700 rounded-t-lg flex-wrap">
      {/* Style selector */}
      {toolbarSchema.styles && toolbarSchema.styles.length > 0 && (
        <>
          <StyleSelector styles={toolbarSchema.styles} />
          <div className="w-px h-6 bg-zinc-700 mx-1" />
        </>
      )}

      {/* Decorator buttons */}
      {toolbarSchema.decorators?.map((decorator) => (
        <DecoratorButton key={decorator.name} schemaType={decorator} />
      ))}

      {toolbarSchema.decorators && toolbarSchema.decorators.length > 0 && (
        <div className="w-px h-6 bg-zinc-700 mx-1" />
      )}

      {/* List buttons */}
      {toolbarSchema.lists?.map((list) => (
        <ListButton key={list.name} schemaType={list} />
      ))}

      {toolbarSchema.lists && toolbarSchema.lists.length > 0 && (
        <div className="w-px h-6 bg-zinc-700 mx-1" />
      )}

      {/* Annotation buttons (links) */}
      {toolbarSchema.annotations?.map((annotation) => (
        <AnnotationButton key={annotation.name} schemaType={annotation} />
      ))}

      {toolbarSchema.annotations && toolbarSchema.annotations.length > 0 && (
        <div className="w-px h-6 bg-zinc-700 mx-1" />
      )}

      {/* Insert image button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleInsertImage}
        className="h-8 px-2 text-zinc-400 hover:text-white hover:bg-zinc-700"
        title="Insert image"
      >
        <ImagePlus className="h-4 w-4 mr-1" />
        <span className="text-xs">Image</span>
      </Button>
    </div>
  );
}
