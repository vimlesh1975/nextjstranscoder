'use client';

import { useEffect, useState } from 'react';

const ApiData = () => {
  const [txt, SetTxt] = useState('');
  const [txt2, SetTxt2] = useState('');
  const [txt3, SetTxt3] = useState('');
  const [txt4, SetTxt4] = useState('');

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

  const startImageThumbnail = async () => {
    SetTxt3('');
    const response = await fetch('/api/imagethumbnail', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt3(jsonData);
  };
  const startDurationandSize = async () => {
    SetTxt4('');
    const response = await fetch('/api/durationandsize', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt4(jsonData);
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
      <div>
        <button onClick={startImageThumbnail}>
          Start Image startThumbnail
        </button>
        {txt3}
      </div>
      <div>
        <button onClick={startDurationandSize}>Get Duration and Size</button>
        {txt4}
      </div>
    </div>
  );
};

export default ApiData;
