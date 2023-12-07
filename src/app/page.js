'use client';

import { useEffect, useState } from 'react';

const ApiData = () => {
  const [txt, SetTxt] = useState('');
  const [txt2, SetTxt2] = useState('');

  const startTranscoding = async () => {
    SetTxt('');
    const response = await fetch('/api/proxy', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt(jsonData);
  };

  const startThumbnail = async () => {
    SetTxt2('');
    const response = await fetch('/api/thumbnail', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt2(jsonData);
  };

  useEffect(() => {
    // startTranscoding();
  }, []);

  return (
    <div>
      <div>
        <button onClick={startTranscoding}>Start Transcoding</button>
        {txt}
      </div>
      <div>
        <button onClick={startThumbnail}>Start startThumbnail</button>
        {txt2}
      </div>
    </div>
  );
};

export default ApiData;
