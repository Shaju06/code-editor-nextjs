import { FC, useEffect, useMemo, useRef } from "react";

const Preview: FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<any>(null);

  useEffect(() => {
    iframeRef.current.srcDoc = html;
    iframeRef.current.contentWindow.postMessage(code, "*");
  }, [code]);

  const html = `<html>
    <head></head>
    <body>
    <div id='root'></div>
    <script>

    const handleError = (err) => {
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h2>Runtime Error:</h2>' + err + '</div>';
    }

    window.addEventListener('error',(evt)=> {
        evt.preventDefault()
        handleError(evt.error.message)
    })

    window.addEventListener('message', (evt) => {
      try {
eval(event.data)
      } catch(err) {
       handleError(evt.error)
      } 
    }, false);
    </script>
    </body>
    </html>`;

  return (
    <iframe
      className="bg-white"
      ref={iframeRef}
      sandbox="allow-scripts"
      srcDoc={html}
    />
  );
};

export default Preview;
