'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';

const width = 300;
const height = 200;

const timefield= process.env.NEXT_PUBLIC_TIMEFIELD ;
// const timefield= 'created_at' ;
console.log(timefield)

function getTimeDifference(mediaUploadedTime) {
  const timestamp = new Date(mediaUploadedTime);
  const now = new Date();
  const differenceInMilliseconds = now - timestamp;
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInDays = Math.floor(differenceInMilliseconds / millisecondsPerDay);

  if (differenceInDays === 0) {
      return 'Today';
  } else if (differenceInDays === 1) {
      return '1 day ago';
  } else {
      return `${differenceInDays} days ago`;
  }
}

const Gallery = () => {
  const [media, setMedia] = useState([]);

  const getMedia = async () => {
    try {
      const response = await fetch('/api/getmedia', {
        method: 'GET',
      });
      if (!response.ok) {
        console.error(new Error('Network response was not ok'));
        return;
      }
      const jsonData = await response.json();
      setMedia(jsonData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMedia();
  }, []);

  const refreshMedia = () => {
    getMedia();
  };

  return (
    <div>
      <div style={{ textAlign: 'left', margin: 10 }}>
        <button onClick={refreshMedia}>Refresh Media</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10  }}>
        {(media?.urls ?? []).map((element, i) => (
          <div key={i} style={{ border: '2px solid red' }}>
            <div>{media.media[i].MediaID}</div>
            <div>{getTimeDifference(media.media[i][timefield])}</div>
            {(media.media[i].MediaType).toUpperCase() === 'VIDEO' ? (
              <video src={media.videoUrls[i]} width={width} height={height} controls />
            ) : (
              <Image priority={false} src={element} alt='' width={width} height={height} style={{ border: '2px solid black' }} />
            )}
            <div>
              size: {(media.media[i].FileSize / 1000000).toFixed(1)}MB 
               {((media.media[i].MediaType).toUpperCase() == 'VIDEO') && ` Duration: ${media.media[i].Duration}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
