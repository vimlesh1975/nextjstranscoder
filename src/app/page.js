'use client';

import { useEffect, useState } from 'react';

const ApiData = () => {
  const [data, setData] = useState([]);
  const [stories, setStories] = useState([]);
  const [txt, SetTxt] = useState('');

  const [selectedOption, setSelectedOption] = useState('');
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const postQuery = async (str) => {
    try {
      const postData = {
        query: str,
      };

      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        // throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      return jsonData; // Return the JSON data as a resolved promise
    } catch (error) {
      console.error('Error fetching data:', error);
      // throw error; // Re-throw the error for further handling
    }
  };

  const setData1 = async (str, fn) => {
    const data1 = await postQuery(str);
    fn(data1);
  };

  const getText = async () => {
    SetTxt('Transcoding');
    const response = await fetch('/api/readfile', {
      method: 'GET',
    });
    if (!response.ok) {
      // throw new Error('Network response was not ok');
      console.log(new Error('Network response was not ok'));
    }
    const jsonData = await response.json();
    SetTxt(jsonData);
  };

  useEffect(() => {
    // getText();
  }, []);

  return (
    <div>
      <div>
        <button onClick={getText}>Get text</button>
        {txt}
      </div>
    </div>
  );
};

export default ApiData;
