import useSaveChanges from "@/hook/SaveChangesHook";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import React, { useEffect, useRef } from "react";

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange }) => {
  const isSaveChangesPressed = useSaveChanges();
  const editorValue = useRef<string>("");

  useEffect(() => {
    if (isSaveChangesPressed) {
      onChange(editorValue.current);
    }
  }, [isSaveChangesPressed]);

  const onEditorDidMount: EditorDidMount = (getValue, moancoEditor) => {
    moancoEditor.onDidChangeModelContent(() => {
      editorValue.current = getValue();
    });
  };

  return (
    <MonacoEditor
      editorDidMount={onEditorDidMount}
      height="600px"
      language="javascript"
      theme="dark"
      options={{
        wordWrap: "on",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 16,
        folding: false,
        lineNumbersMinChars: 3,
      }}
    />
  );
};

CodeEditor.defaultProps = {};

export default CodeEditor;
