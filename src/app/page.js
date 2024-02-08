'use client';

import { useEffect, useState } from 'react';
import Gallery from './Gallery';

const ApiData = () => {
  const [txt, SetTxt] = useState('');
  const [txt2, SetTxt2] = useState('');
  const [txt3, SetTxt3] = useState('');
  const [txt4, SetTxt4] = useState(false);
  const [txt5, SetTxt5] = useState(false);


  const startProxy = async () => {
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

  const startImageThumbnail = async (val) => {
    SetTxt3('');
    const response = await fetch('/api/imagethumbnail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({start:val}),
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt3(jsonData.started);
  };

  const getstartImageThumbnail = async () => {
    SetTxt3('');
    const response = await fetch('/api/imagethumbnail', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt3(jsonData.started);
  };



  const startDurationandSize = async (val) => {
    SetTxt4('');
    const response = await fetch('/api/durationandsize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({start:val}),
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt4(jsonData.started);
  };

  const getstartDurationandSize = async () => {
    SetTxt4('');
    const response = await fetch('/api/durationandsize', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt4(jsonData.started);
  };

  const startDeletingLigFiles = async (val) => {
    SetTxt5('');
    const response = await fetch('/api/deleteLogFiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({start:val}),
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt5(jsonData.started);
  };



  const getstartDeletingLigFiles = async () => {
    SetTxt5('');
    const response = await fetch('/api/deleteLogFiles', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt5(jsonData.started);
  };

  useEffect(() => {
    getstartDeletingLigFiles();
    getstartDurationandSize();
    getstartImageThumbnail();
  }, []);

 

  return (
    <div>
      <div>
        <button onClick={startProxy}>Start proxy</button>
        {txt}
      </div>
      <div>
        <button onClick={startThumbnail}>Start Thumbnail</button>
        {txt2}
      </div>
      <div>
        {/* <button onClick={startImageThumbnail}>Start Image Thumbnail</button>
        {txt3} */}

        <span style={{color:txt3?'darkgreen':'darkred', fontSize:20, fontWeight:'bolder'}}>{txt3?'Started':'Stopped'}</span>
        {txt3? <><button onClick={()=>startImageThumbnail(false)}>
          Stop Image Thumbnail
        </button></>  : <button onClick={()=>startImageThumbnail(true)}>
          Start Image Thumbnail
        </button>}


      </div>
      <div>
        <span style={{color:txt4?'darkgreen':'darkred', fontSize:20, fontWeight:'bolder'}}>{txt4?'Started':'Stopped'}</span>
        {txt4? <><button onClick={()=>startDurationandSize(false)}>
          Stop Duration and Size
        </button></>  : <button onClick={()=>startDurationandSize(true)}>
          Start Duration and Size
        </button>}

      </div>

      <div>
      <span style={{color:txt5?'darkgreen':'darkred', fontSize:20, fontWeight:'bolder'}}>{txt5?'Started':'Stopped'}</span>
        {txt5? <><button onClick={()=>startDeletingLigFiles(false)}>
          Stop Deleting log files
        </button></>  : <button onClick={()=>startDeletingLigFiles(true)}>
          Start Deleting log files
        </button>}
      </div>

      <div>
    <Gallery />
      </div>
    </div>
  );
};

export default ApiData;
