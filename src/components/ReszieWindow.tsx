import { FC } from "react";
import { ResizableBox } from "react-resizable";

const ResizeWindow: FC<ReszieWindwoProps> = ({ direction, children }) => {
  let width = 0;
  if (typeof window !== "undefined") {
    width = window.innerWidth;
  }
  return (
    <ResizableBox
      className="flex w-full"
      resizeHandles={["e"]}
      minConstraints={[width * 0.2, Infinity]}
      maxConstraints={[width * 0.75, Infinity]}
      width={Infinity}
      height={Infinity}
    >
      {children}
    </ResizableBox>
  );
};

export default ResizeWindow;
