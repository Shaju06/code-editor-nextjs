interface CodeEditorProps {
  onChange: (value: string) => void;
  value: string;
}

interface PreviewProps {
  code: string;
}

interface ReszieWindwoProps {
  direction: "horizontal" | "vertical";
  children: any;
}
