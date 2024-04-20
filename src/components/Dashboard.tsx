"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as esbuild from "esbuild-wasm";

export default function Dashboard() {
  const [inputVal, setInputVal] = useState("");
  const buildRef = useRef<null | any>(null);

  useEffect(() => {
    async function intialLoadEsbuild() {
      buildRef.current = await esbuild.initialize({
        wasmURL: "/esbuild.wasm",
        worker: true,
      });
    }
    intialLoadEsbuild();
  }, []);

  const handleSubmit = async () => {
    let result = await esbuild.transform(inputVal, {
      jsx: "preserve",
      loader: "jsx",
      target: "es2015",
    });

    console.log(result);
  };

  return (
    <Tabs defaultValue="code-editor" className="w-full">
      <TabsList className="flex justify-around">
        <TabsTrigger value="text-editor">Text Editor</TabsTrigger>
        <TabsTrigger value="code-editor">Code Editor</TabsTrigger>
      </TabsList>
      <TabsContent value="text-editor">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="code-editor">
        <div className="flex flex-col gap-4">
          <Textarea
            value={inputVal}
            onChange={(evt) => setInputVal(evt.target.value)}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
