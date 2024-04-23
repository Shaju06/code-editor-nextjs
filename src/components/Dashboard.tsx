"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "@/plugin/unpkg-bundle";

import dynamic from "next/dynamic";
import Preview from "./Preview";
import ResizeWindow from "./ReszieWindow";

const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });

export default function Dashboard() {
  const buildRef = useRef<null | any>(null);
  const [buildString, setBuildString] = useState<string>("");

  useEffect(() => {
    async function intialLoadEsbuild() {
      buildRef.current = await esbuild.initialize({
        wasmURL: "/esbuild.wasm",
        worker: true,
      });
    }
    intialLoadEsbuild();
  }, []);

  const handleChange = async (input: string) => {
    let result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(input)],
    });

    setBuildString(result.outputFiles[0].text);
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
        <div className="flex flex-row">
          <ResizeWindow direction="horizontal">
            <CodeEditor onChange={(value) => handleChange(value)} />
          </ResizeWindow>
          <Preview code={buildString} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
