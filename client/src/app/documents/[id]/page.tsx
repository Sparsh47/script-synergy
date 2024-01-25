"use client";

import "quill/dist/quill.snow.css";
import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

const TextEditor = ({ params }) => {
  const { id } = params;
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["link", "image", "blockquote", "code-block"],
    ["clean"],
  ];

  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", id);
  }, [socket, quill, id]);

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("recieve-changes", handler);
    return () => {
      socket.off("recieve-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") {
        return;
      }
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const q = new Quill("#container", {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });
      editorRef.current = q;
      q.disable();
      q.setText("Loading...");
      setQuill(q);
    }
  }, []);

  return (
    <div>
      <div id="container"></div>
    </div>
  );
};

export default TextEditor;
