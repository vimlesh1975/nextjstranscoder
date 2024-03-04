'use client';

import { useEffect, useState } from 'react';
import Gallery from './Gallery';
import './style.css'; // Import the CSS file

const ApiData = () => {
  const [txt, SetTxt] = useState('');
  const [txt2, SetTxt2] = useState('');
  const [txt3, SetTxt3] = useState('');
  const [txt4, SetTxt4] = useState(false);
  const [txt5, SetTxt5] = useState(false);




  const startProxy = async (val) => {
    SetTxt('');
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ start: val }),
    });

    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt(jsonData.started);
  };

  const getstartProxy = async () => {
    SetTxt('');
    const response = await fetch('/api/proxy', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt(jsonData.started);
  };




  const startThumbnail = async (val) => {
    SetTxt2('');
    const response = await fetch('/api/thumbnail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ start: val }),
    });

    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt2(jsonData.started);
  };

  const getstartThumbnail = async () => {
    SetTxt2('');
    const response = await fetch('/api/thumbnail', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt2(jsonData.started);
  };



  const startImageThumbnail = async (val) => {
    SetTxt3('');
    const response = await fetch('/api/imagethumbnail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ start: val }),
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
      body: JSON.stringify({ start: val }),
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
      body: JSON.stringify({ start: val }),
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
    getstartThumbnail();
    getstartProxy();
  }, []);

  const makeQuery = async (query) => {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }),
    });
    if (!response.ok) {
      console.log(new Error('Network response was not ok'));
    }
    else {
      const jsonData = await response.json();
      console.log(jsonData)
      alert(JSON.stringify(jsonData));
    }

  }

  return (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Functionality</th>
              <th>Status</th>
              <th>Action</th>
              <th>test</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Proxy</td>
              <td>
                <span style={{ color: txt ? 'darkgreen' : 'darkred' }}>
                  {txt ? 'Started' : 'Stopped'}
                </span>
              </td>
              <td>
                {txt ? (
                  <button onClick={() => startProxy(false)}>Stop</button>
                ) : (
                  <button onClick={() => startProxy(true)}>Start</button>
                )}
              </td>

              <td><button onClick={() => makeQuery(`update media set ProxyReady=0, FilenameProxy1=null where MediaType='Video' LIMIT 2`)}>Test</button></td>
            </tr>
            <tr>
              <td>Thumbnail</td>
              <td>
                <span style={{ color: txt2 ? 'darkgreen' : 'darkred' }}>
                  {txt2 ? 'Started' : 'Stopped'}
                </span>
              </td>
              <td>
                {txt2 ? (
                  <button onClick={() => startThumbnail(false)}>Stop</button>
                ) : (
                  <button onClick={() => startThumbnail(true)}>Start</button>
                )}
              </td>
              <td><button onClick={() => makeQuery(`update media set ThumbnailBig=null, ThumbnailSmall=null where MediaType='VIDEO' LIMIT 2`)}>Test</button></td>
            </tr>
            <tr>
              <td>Image Thumbnail</td>
              <td>
                <span style={{ color: txt3 ? 'darkgreen' : 'darkred' }}>
                  {txt3 ? 'Started' : 'Stopped'}
                </span>
              </td>
              <td>
                {txt3 ? (
                  <button onClick={() => startImageThumbnail(false)}>Stop</button>
                ) : (
                  <button onClick={() => startImageThumbnail(true)}>Start</button>
                )}
              </td>
              <td><button onClick={() => makeQuery(`update media set ThumbnailBig=null, ThumbnailSmall=null where MediaType='IMAGE' LIMIT 2`)}>Test</button></td>
            </tr>
            <tr>
              <td>Duration and Size</td>
              <td>
                <span style={{ color: txt4 ? 'darkgreen' : 'darkred' }}>
                  {txt4 ? 'Started' : 'Stopped'}
                </span>
              </td>
              <td>
                {txt4 ? (
                  <button onClick={() => startDurationandSize(false)}>Stop</button>
                ) : (
                  <button onClick={() => startDurationandSize(true)}>Start</button>
                )}
              </td>
              <td><button onClick={() => makeQuery(`update media set FileSize=null, Duration=null where (MediaType='Video' or MediaType='image') LIMIT 2`)}>Test</button></td>
            </tr>
            <tr>
              <td>Deleting Log Files</td>
              <td>
                <span style={{ color: txt5 ? 'darkgreen' : 'darkred' }}>
                  {txt5 ? 'Started' : 'Stopped'}
                </span>
              </td>
              <td>
                {txt5 ? (
                  <button onClick={() => startDeletingLigFiles(false)}>Stop</button>
                ) : (
                  <button onClick={() => startDeletingLigFiles(true)}>Start</button>
                )}
              </td>
              <td><button onClick={() => startDeletingLigFiles(`now`)}>Test</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <Gallery />
      </div>
    </div>
  );
};

export default ApiData;
