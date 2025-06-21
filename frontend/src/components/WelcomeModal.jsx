import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WelcomeModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem("hasVisited");
    if (!isFirstVisit) {
      setShowModal(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasVisited", "true");
    setShowModal(false);
  };

  return (
    <Dialog open={showModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to the Disaster Management App</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            This app helps you monitor disasters and respond faster. Stay
            informed and safe!
          </p>
          <div className="mt-2 space-y-1">
            <p className="font-medium text-foreground">🔗 Links:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <a
                  href="https://github.com/ABODHKUMAR/disaster_management"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://leetcode.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  My LeetCode Profile
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  YouTube Demo
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-2">
            <p className="font-medium text-foreground">🛠 Tools & Tech:</p>
            <p>React.js, Node.js, Cursor</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
