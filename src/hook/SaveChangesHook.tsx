import { useEffect, useState } from "react";

export default function useSaveChanges() {
  const [saveChangeCount, setSaveChangeCount] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (event: {
      preventDefault: () => void;
      which: any;
      keyCode: any;
      ctrlKey: any;
      metaKey: any;
    }) => {
      const code = event.which || event.keyCode;

      let charCode = String.fromCharCode(code).toLowerCase();
      if ((event.ctrlKey || event.metaKey) && charCode === "s") {
        event.preventDefault();
        setSaveChangeCount((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return saveChangeCount;
}
