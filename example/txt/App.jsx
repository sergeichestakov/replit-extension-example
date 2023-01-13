import * as React from 'react';
import '../App.css'

export default function App() {
  const [connected, setConnected] =
    React.useState(false);
  const [content, setContent] =
    React.useState('');

  const fileName = React.useMemo(() => {
    const params = new URLSearchParams(document.location.search);
    return params.get("path");
  }, [])

  const runRef = React.useRef(0);

  React.useEffect(() => {
    // this effect runs twice by default
    runRef.current += 1;
    if (runRef.current === 1) {
      return;
    }

    const replit = window.replit;
    (async () => {
      try {
        await replit.init({ permissions: [] });
        setConnected(true);
        // use replit API here to do something
      } catch (e) {
        setError(e);
      }
    })()
  }, []);

  React.useEffect(() => {
    if (!connected) {
      return;
    }

    const disposePromise = replit.fs.watchTextFile(fileName, {
      onReady: async (args) => {
        // TODO: Wtf???
        const content = await args.initialContent;
        setContent(content);
      },
      onChange: ({latestContent}) => {
        setContent(latestContent);
      },
      onError: () => {},
      onMoveOrDelete: () => {},
    });

    return async () => {
      const dispose = await disposePromise;
      dispose();
    }
  }, [connected, fileName])

  const writeFile = (content) => {
    replit.fs.writeFile(fileName, content);
  };

  return (
    <main>
      <div className="txt-container">
        <input type="text" id="text" name="name" value={content} onChange={(e) => {
          const value = e.target.value;
          writeFile(value);
        }}></input>
        <div className="heading">My Custom File Type: {fileName}</div>
        <div>File Contents: {content}</div>
      </div>
    </main>
  )
}