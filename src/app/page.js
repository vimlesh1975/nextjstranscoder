'use client';

import { useState } from 'react';

const ApiData = () => {
  const [data, setData] = useState([]);
  const [stories, setStories] = useState([]);

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
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      return jsonData; // Return the JSON data as a resolved promise
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling
    }
  };

  const setData1 = async (str, fn) => {
    const data1 = await postQuery(str);
    fn(data1);
  };

  return (
    <div>
      <div>
        <button
          onClick={() =>
            setData1('select title from newsid ORDER BY title DESC', setData)
          }
        >
          Get Run Orders
        </button>
        <div>
          {data.length > 0 && (
            <label htmlFor="comboBox">Select Run Order: </label>
          )}
          <select
            id="comboBox"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option value="">Select Run Order</option>
            {data?.map((option, index) => (
              <option key={index} value={option.title}>
                {option.title}
              </option>
            ))}
          </select>
          {selectedOption && (
            <h1 style={{ backgroundColor: 'purple', color: 'white' }}>
              Selected Run Order: {selectedOption}
            </h1>
          )}
        </div>
        <button
          onClick={() =>
            setData1(
              `SELECT   script.SlugName, script.Script from script JOIN runorder on script.ScriptID = runorder.ScriptID WHERE runorder.NewsID = '${selectedOption}' and script.newsid = '${selectedOption}'  ORDER by runorder.RunOrder`,
              setStories
            )
          }
        >
          Get Stories
        </button>
      </div>

      <div>
        {stories.map((story, i) => (
          <div key={i}>
            <h2 style={{ backgroundColor: 'yellow' }}>{story.SlugName}</h2>
            <h3>{story.Script}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiData;
