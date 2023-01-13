import * as React from 'react';
import './App.css'

export default function App() {
  const [connected, setConnected] = 
    React.useState(false);
  const [error, setError] = 
    React.useState(null);
  const [count, setCount] = 
    React.useState(0);

  const runRef = React.useRef(0);
  const idRef = React.useRef(Math.random().toString(36).slice(2))
  
  React.useEffect(() => {
    // this effect runs twice by default
    runRef.current += 1;
    if (runRef.current === 1) {
      return;
    }
    
    const replit = window.replit;
    (async () => {
      try {
        await replit.init({permissions: []});
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
    
    const disposePromise = replit.events.onWorkspaceEvent((event) => {
      if (event.type === 'click-button' && event.data.id !== idRef.current) {
        setCount((c) => c + 1);
      }
    });

    return async () => {
      const dispose = await disposePromise;
      dispose();
    }
  }, [connected, replit])
  
  return (
    <main>
			<div className="center">
				<div>
      		<div className="heading">Example</div>
		      {error ? (
						<>
		        	<div className="error">error: {error.message ?? error}</div>
							{error.message === "timeout" ? (
								<div>Note: Make sure to open this URL as an extension, not a webview</div>
							) : null}
						</>
		      ) : (
		        <div>{connected ? 'connected' : 'connecting...'}</div>
		      )}
          <button onClick={() => {
            replit.events.emitEvent({
              type: 'click-button',
              data: {
                id: idRef.current,
              },
            })
          }}>Click me</button>
          <div>Count: {count}</div>
				</div>
			</div>
    </main>
  )
}