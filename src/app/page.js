'use client';

import { useEffect, useState } from 'react';

const ApiData = () => {
  const [txt, SetTxt] = useState('');

  const startTranscoding = async () => {
    SetTxt('Transcoding');
    const response = await fetch('/api', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt(jsonData);
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
    </div>
  );
};

export default ApiData;
