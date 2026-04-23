"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useIssueStore } from "@/stores/issueStore";
import type { IssuePriority, IssueSeverity } from "@/types";
import { toast } from "sonner";

const TECHNICIANS = [
  {
    id: "unassigned",
    value: "",
    title: "Leave this issue unassigned.",
    description: "Unassigned",
  },
  {
    id: "tech-1",
    value: "Navindu Ashen",
    title: "Navindu Ashen",
    description: "Software Engineer",
  },
  {
    id: "tech-2",
    value: "Kasun Rathnayake",
    title: "Kasun Rathnayake",
    description: "Network Engineer",
  },
  {
    id: "tech-3",
    value: "Sahan Gamage",
    title: "Sahan Gamage",
    description: "IT Support Engineer",
  },
];

export function CreateIssueDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { createIssue } = useIssueStore();

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<IssuePriority>("Medium");
  const [newSeverity, setNewSeverity] = useState<IssueSeverity>("Major");
  const [newAssignee, setNewAssignee] = useState<string>("");
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  async function handleCreateIssue(event: FormEvent) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    setIsCreateLoading(true);
    try {
      await createIssue({
        title,
        description: newDescription.trim() || undefined,
        priority: newPriority,
        severity: newSeverity,
        assignee: newAssignee || undefined,
      });
      toast.success("Issue created successfully");
      onOpenChange(false);
      setNewTitle("");
      setNewDescription("");
      setNewPriority("Medium");
      setNewSeverity("Major");
      setNewAssignee("");
    } catch {
      toast.error("Failed to create issue");
    } finally {
      setIsCreateLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Issue</DialogTitle>
          <DialogDescription>
            Add a new issue to the tracker. New issues are created with{" "}
            <strong>Open</strong> status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateIssue} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-title">Title</Label>
            <Input
              id="new-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Issue title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-description">Description</Label>
            <textarea
              id="new-description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Describe the issue..."
              className="min-h-[90px] w-full rounded-lg border border-input bg-transparent p-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-3">
              <Label>Severity</Label>
              <div className="flex flex-wrap items-center gap-2">
                {(["Minor", "Major", "Critical"] as IssueSeverity[]).map(
                  (severity) => {
                    const isActive = newSeverity === severity;
                    return (
                      <button
                        type="button"
                        key={severity}
                        onClick={() => setNewSeverity(severity)}
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          isActive
                            ? "bg-[#9D5FD4] hover:bg-[#8B4FC3] text-white border-transparent"
                            : "bg-transparent text-foreground hover:bg-muted border-input"
                        }`}
                      >
                        {severity}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Priority</Label>
              <div className="flex flex-wrap items-center gap-2">
                {(["Low", "Medium", "High"] as IssuePriority[]).map(
                  (priority) => {
                    const isActive = newPriority === priority;
                    return (
                      <button
                        type="button"
                        key={priority}
                        onClick={() => setNewPriority(priority)}
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          isActive
                            ? "bg-[#9D5FD4] hover:bg-[#8B4FC3] text-white border-transparent"
                            : "bg-transparent text-foreground hover:bg-muted border-input"
                        }`}
                      >
                        {priority}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Assignee</Label>
            <RadioGroup
              value={newAssignee}
              onValueChange={setNewAssignee}
              className="grid gap-4 sm:grid-cols-2"
            >
              {TECHNICIANS.map((tech) => (
                <FieldLabel
                  htmlFor={tech.id}
                  key={tech.id}
                  className="cursor-pointer"
                >
                  <Field
                    orientation="horizontal"
                    className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 has-data-[state=checked]:border-primary transition-all"
                  >
                    <FieldContent className="flex-1">
                      <FieldTitle className="text-sm font-medium">
                        {tech.description}
                      </FieldTitle>
                      <FieldDescription className="text-xs text-muted-foreground">
                        {tech.title}
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={tech.value} id={tech.id} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
              disabled={isCreateLoading}
            >
              {isCreateLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
