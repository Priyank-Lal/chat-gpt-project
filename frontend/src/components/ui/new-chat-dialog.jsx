import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const NewChatDialog = ({ onCreateChat, isCreating = false }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateChat(title.trim());
    setTitle("");
    setOpen(false);
  };

  const handleCancel = () => {
    setTitle("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium transition-all duration-200 rounded-lg h-10 border border-[#3a3a3a] hover:border-[#4a4a4a]"
          disabled={isCreating}
        >
          <Plus size={16} className="mr-2" />
          {isCreating ? "Creating..." : "New chat"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#2a2a2a] border-[#3a3a3a] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Chat</DialogTitle>
          <DialogDescription className="text-gray-400">
            Give your new conversation a descriptive title.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right text-white">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Help with React project"
                className="col-span-3 bg-[#1a1a1a] border-[#3a3a3a] text-white placeholder:text-gray-500"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isCreating}
              className="bg-white text-black hover:bg-gray-200"
            >
              {isCreating ? "Creating..." : "Create Chat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
